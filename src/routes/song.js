import express from "express";

import {
  createSongSchema,
  updateSongSchema,
} from "../validations/song.validation.js";
import { validateBody } from "../middlewares/validateBody.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  createSong,
  deleteSong,
  getSongById,
  getSongs,
  getStats,
  updateSong,
} from "../controllers/song.controller.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/", validateBody(createSongSchema), createSong);
router.get("/", getSongs);
router.get("/stats", getStats);
router.get("/:id", getSongById);
router.put("/:id", validateBody(updateSongSchema), updateSong);
router.delete("/:id", deleteSong);

export default router;
