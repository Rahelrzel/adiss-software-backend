// routes/spotifyRoutes.js
import express from "express";
import { searchTracks } from "../controllers/spotify.controller.js";
import { getSpotifyToken } from "../utils/spotifyAuth.js";

const router = express.Router();

router.get(
  "/search",
  async (req, res, next) => {
    try {
      const token = await getSpotifyToken();
      req.spotifyToken = token;
      next();
    } catch (err) {
      next(err);
    }
  },
  searchTracks
);

export default router;
