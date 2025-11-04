import express from "express";
import {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  getPlaylistStats,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../controllers/playlist.controller.js";

import {
  createPlaylistSchema,
  updatePlaylistSchema,
} from "../validations/playlist.validation.js";

import { validateBody } from "../middlewares/validateBody.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/", validateBody(createPlaylistSchema), createPlaylist);
router.get("/", getPlaylists);
router.get("/:id", getPlaylistById);

router.get("/stats", getPlaylistStats);

router.put("/:id", validateBody(updatePlaylistSchema), updatePlaylist);
router.delete("/:id", deletePlaylist);

// New routes for adding/removing songs
router.post("/add-song", addSongToPlaylist);
router.post("/remove-song", removeSongFromPlaylist);

export default router;
