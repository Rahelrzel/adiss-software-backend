// controllers/spotifyController.js
import axios from "axios";
import { dbQuery } from "../middlewares/error.middleware.js";
import HttpError from "../utils/HttpError.js";

export const searchTracks = dbQuery(async (req, res) => {
  const { query } = req.query;
  const token = req.spotifyToken; // token from middleware

  if (!query) {
    throw new HttpError({ status: 400, message: "Query is required" });
  }

  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: "track", limit: 10 },
  });

  const simplifiedTracks = response.data.tracks.items.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0]?.name,
    album: track.album.name,
    preview_url: track.preview_url,
    image: track.album.images[0]?.url,
    external_url: track.external_urls.spotify,
    genre: track.album.genres ? track.album.genres[0] : "Unknown",
  }));

  res.json({ success: true, data: simplifiedTracks });
});
