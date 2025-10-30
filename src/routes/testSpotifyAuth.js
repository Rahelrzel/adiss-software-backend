import express from "express";
import { getSpotifyToken } from "../utils/spotifyAuth.js";

const router = express.Router();

router.get("/test-token", async (req, res, next) => {
  try {
    const token = await getSpotifyToken();
    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
});

export default router;
