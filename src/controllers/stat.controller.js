import { dbQuery } from "../middlewares/error.middleware.js";
import Song from "../models/song.js";
import Artist from "../models/artist.js";
import Album from "../models/album.js";
import Genre from "../models/genre.js";

export const getTotals = dbQuery(async (_req, res) => {
  const [songsCount, artistsCount, albumsCount, genresCount] =
    await Promise.all([
      Song.countDocuments(),
      Artist.countDocuments(),
      Album.countDocuments(),
      Genre.countDocuments(),
    ]);

  res.status(200).json({
    totalSongs: songsCount,
    totalArtists: artistsCount,
    totalAlbums: albumsCount,
    totalGenres: genresCount,
  });
});

export const getSongsByGenre = dbQuery(async (_req, res) => {
  const genres = await Genre.find();

  const data = await Promise.all(
    genres.map(async (genre) => {
      const count = await Song.countDocuments({ genre: genre._id });
      return {
        genre: genre.name,
        songCount: count,
      };
    })
  );

  res.status(200).json(data);
});

export const getArtistStats = dbQuery(async (_req, res) => {
  const artists = await Artist.find();

  const data = await Promise.all(
    artists.map(async (artist) => {
      const [songCount, albumCount] = await Promise.all([
        Song.countDocuments({ artistId: artist._id }),
        Album.countDocuments({ artistId: artist._id }),
      ]);

      return {
        artist: artist.name,
        songCount,
        albumCount,
      };
    })
  );

  res.status(200).json(data);
});

export const getAlbumStats = dbQuery(async (_req, res) => {
  const albums = await Album.find().populate("artistId", "name");

  const data = await Promise.all(
    albums.map(async (album) => {
      const songCount = await Song.countDocuments({ albumId: album._id });
      return {
        album: album.name,
        artist: album.artistId?.name || "Unknown Artist",
        songCount,
      };
    })
  );

  res.status(200).json(data);
});
