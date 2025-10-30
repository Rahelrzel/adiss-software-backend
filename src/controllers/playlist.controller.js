import Playlist from "../models/playlist.js";
import Song from "../models/song.js";
import { dbQuery } from "../middlewares/error.middleware.js";
import HttpError from "../utils/HttpError.js";

// CREATE PLAYLIST
export const createPlaylist = dbQuery(async (req, res) => {
  const playlist = new Playlist({ ...req.body, userId: req.user.id });
  await playlist.save();
  res.status(201).json(playlist);
});

// GET ALL PLAYLISTS
export const getPlaylists = dbQuery(async (req, res) => {
  const query = {};
  if (req.query.name) query.name = { $regex: req.query.name, $options: "i" };
  if (req.query.description)
    query.description = { $regex: req.query.description, $options: "i" };

  const playlists = await Playlist.find(query)
    .populate("songs", "title artist album genre")
    .populate("userId", "username email");

  res.status(200).json(playlists);
});

// GET SINGLE PLAYLIST
export const getPlaylistById = dbQuery(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)
    .populate("songs", "title artist album genre")
    .populate("userId", "username email");

  if (!playlist)
    throw new HttpError({ status: 404, message: "Playlist not found" });

  res.status(200).json(playlist);
});

// UPDATE PLAYLIST
export const updatePlaylist = dbQuery(async (req, res) => {
  const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!playlist)
    throw new HttpError({ status: 404, message: "Playlist not found" });

  res.status(200).json(playlist);
});

// DELETE PLAYLIST
export const deletePlaylist = dbQuery(async (req, res) => {
  const playlist = await Playlist.findByIdAndDelete(req.params.id);
  if (!playlist)
    throw new HttpError({ status: 404, message: "Playlist not found" });

  // Remove playlist reference from songs
  await Song.updateMany(
    { playlistId: playlist._id },
    { $unset: { playlistId: "" } }
  );

  res.status(200).json({ message: "Playlist deleted successfully" });
});

// PLAYLIST STATISTICS
export const getPlaylistStats = dbQuery(async (_req, res) => {
  const totalPlaylists = await Playlist.countDocuments();

  const playlistsWithMostSongs = await Playlist.aggregate([
    { $project: { name: 1, songsCount: { $size: "$songs" } } },
    { $sort: { songsCount: -1 } },
    { $limit: 5 },
  ]);

  res.status(200).json({ totalPlaylists, playlistsWithMostSongs });
});

// ADD SONG TO PLAYLIST
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

// REMOVE SONG FROM PLAYLIST
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
