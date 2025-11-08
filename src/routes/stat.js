import express from "express";
import {
  getTotals,
  getSongsByGenre,
  getArtistStats,
  getAlbumStats,
} from "../controllers/stat.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser);
router.get("/totals", getTotals);
router.get("/songs-by-genre", getSongsByGenre);
router.get("/artist-stats", getArtistStats);
router.get("/album-stats", getAlbumStats);

export default router;
