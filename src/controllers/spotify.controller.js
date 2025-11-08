import axios from "axios";
import { getSpotifyToken } from "../utils/spotifyAuth.js";
import { dbQuery } from "../middlewares/error.middleware.js";
import HttpError from "../utils/HttpError.js";

export const searchTracks = dbQuery(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new HttpError({ status: 400, message: "Query is required" });
  }

  const token = await getSpotifyToken();

  // ✅ Request only 10 tracks
  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: "track", limit: 10 },
  });

  // ✅ Simplify the data
  const simplifiedTracks = response.data.tracks.items.map((track) => ({
    id: track.id,
    title: track.name,
    artist: track.artists?.[0]?.name || "Unknown Artist",
    album: track.album?.name || "Unknown Album",
    image: track.album?.images?.[0]?.url || null,
    spotifyUrl: track.external_urls?.spotify || null,
    previewUrl: track.preview_url || null,
  }));

  res.json({
    success: true,
    count: simplifiedTracks.length,
    data: simplifiedTracks,
  });
});
