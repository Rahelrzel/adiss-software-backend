import Playlist from "../models/playlist.js";
import Song from "../models/song.js";
import { dbQuery } from "../middlewares/error.middleware.js";
import HttpError from "../utils/HttpError.js";

export const createPlaylist = dbQuery(async (req, res) => {
  const { name, description, songs, isPublished = false } = req.body;

  const playlist = new Playlist({
    name,
    description,
    songs,
    isPublished,
    userId: req.user.id,
  });

  await playlist.save();
  res.status(201).json(playlist);
});

export const getPlaylists = dbQuery(async (req, res) => {
  const query = {};

  if (req.query.name) query.name = { $regex: req.query.name, $options: "i" };
  if (req.query.description)
    query.description = { $regex: req.query.description, $options: "i" };

  query.$or = [{ userId: req.user.id }, { isPublished: true }];

  const playlists = await Playlist.find(query)
    .populate("songs", "title artist album genre")
    .populate("userId", "username email");

  res.status(200).json(playlists);
});

export const getPlaylistById = dbQuery(async (req, res) => {
  const { id } = req.params;

  const playlist = await Playlist.findById(id)
    .populate("songs", "title artist album genre")
    .populate("userId", "username email");

  if (!playlist) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  res.status(200).json(playlist);
});

export const updatePlaylist = dbQuery(async (req, res) => {
  const { name, description, songs, isPublished } = req.body;

  const updatedFields = {
    ...(name && { name }),
    ...(description && { description }),
    ...(songs && { songs }),
  };

  if (typeof isPublished === "boolean") {
    updatedFields.isPublished = isPublished;
  }

  const playlist = await Playlist.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    {
      new: true,
    }
  );

  if (!playlist)
    throw new HttpError({ status: 404, message: "Playlist not found" });

  res.status(200).json(playlist);
});

export const deletePlaylist = dbQuery(async (req, res) => {
  const playlist = await Playlist.findByIdAndDelete(req.params.id);
  if (!playlist)
    throw new HttpError({ status: 404, message: "Playlist not found" });

  await Song.updateMany(
    { playlistId: playlist._id },
    { $unset: { playlistId: "" } }
  );

  res.status(200).json({ message: "Playlist deleted successfully" });
});

export const getPlaylistStats = dbQuery(async (_req, res) => {
  const totalPlaylists = await Playlist.countDocuments();
  const publishedPlaylists = await Playlist.countDocuments({
    isPublished: true,
  });

  const playlistsWithMostSongs = await Playlist.aggregate([
    { $project: { name: 1, songsCount: { $size: "$songs" } } },
    { $sort: { songsCount: -1 } },
    { $limit: 5 },
  ]);

  res.status(200).json({
    totalPlaylists,
    publishedPlaylists,
    playlistsWithMostSongs,
  });
});

export const addSongToPlaylist = dbQuery(async (req, res) => {
  const { playlistId, songId } = req.body;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist)
    throw new HttpError({ status: 404, message: "Playlist not found" });

  const song = await Song.findById(songId);
  if (!song) throw new HttpError({ status: 404, message: "Song not found" });

  if (!playlist.songs.includes(songId)) {
    playlist.songs.push(songId);
    await playlist.save();
  }

  if (!song.playlistId || song.playlistId.toString() !== playlistId) {
    song.playlistId = playlistId;
    await song.save();
  }

  const updatedPlaylist = await Playlist.findById(playlistId)
    .populate("songs")
    .populate("userId", "username email");

  res.status(200).json(updatedPlaylist);
});

export const removeSongFromPlaylist = dbQuery(async (req, res) => {
  const { playlistId, songId } = req.body;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist)
    throw new HttpError({ status: 404, message: "Playlist not found" });

  const song = await Song.findById(songId);
  if (!song) throw new HttpError({ status: 404, message: "Song not found" });

  playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
  await playlist.save();

  if (song.playlistId?.toString() === playlistId) {
    song.playlistId = null;
    await song.save();
  }

  res.status(200).json(playlist);
});
