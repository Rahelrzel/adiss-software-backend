import Song from "../models/song.js";
import Playlist from "../models/playlist.js";
import HttpError from "../utils/HttpError.js";
import { dbQuery } from "../middlewares/error.middleware.js";

export const createSong = dbQuery(async (req, res) => {
  const {
    title,
    artistId,
    albumId,
    genre,
    spotifyUrl,

    image,
    playlistId,
  } = req.body;

  const song = new Song({
    title,
    artistId,
    albumId,
    genre,
    spotifyUrl,

    image,
    playlistId: playlistId || null,
  });

  await song.save();

  // ✅ If a playlistId was provided, update that playlist
  let playlist = null;
  if (playlistId) {
    playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { songs: song._id } },
      { new: true }
    ).populate("songs");

    if (!playlist) {
      throw new HttpError({ status: 404, message: "Playlist not found" });
    }
  }

  res.status(201).json({
    message: playlist
      ? "Song added and linked to playlist successfully"
      : "Song added successfully",
    song,
    playlist,
  });
});

export const getSongs = dbQuery(async (req, res) => {
  const query = {};
  if (req.query.title) query.title = { $regex: req.query.title, $options: "i" };
  if (req.query.artist)
    query.artist = { $regex: req.query.artist, $options: "i" };
  if (req.query.album) query.album = { $regex: req.query.album, $options: "i" };
  if (req.query.genre) query.genre = { $regex: req.query.genre, $options: "i" };

  const songs = await Song.find(query).populate(
    "playlistId",
    "name description"
  );
  res.status(200).json(songs);
});

export const getSongById = dbQuery(async (req, res) => {
  const song = await Song.findById(req.params.id).populate(
    "playlistId",
    "name description"
  );
  if (!song) throw new HttpError({ status: 404, message: "Song not found" });
  res.status(200).json(song);
});

export const updateSong = dbQuery(async (req, res) => {
  const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!song) throw new HttpError({ status: 404, message: "Song not found" });
  res.status(200).json(song);
});

export const deleteSong = dbQuery(async (req, res) => {
  const song = await Song.findByIdAndDelete(req.params.id);
  if (!song) throw new HttpError({ status: 404, message: "Song not found" });

  if (song.playlistId) {
    await Playlist.findByIdAndUpdate(song.playlistId, {
      $pull: { songs: song._id },
    });
  }

  res.status(200).json({ message: "Song deleted successfully" });
});

export const getStats = dbQuery(async (req, res) => {
  const totalSongs = await Song.countDocuments();

  const songsByGenre = await Song.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } },
  ]);

  const artistStats = await Song.aggregate([
    {
      $group: {
        _id: "$artist",
        songs: { $sum: 1 },
        albums: { $addToSet: "$album" },
      },
    },
  ]);

  res.status(200).json({ totalSongs, songsByGenre, artistStats });
});
