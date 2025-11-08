import { Router } from "express";
import UserRouter from "./auth.js";

import PlaylistRouter from "./playlist.js";
import SongRouter from "./song.js";
import SpotifyRouter from "./spotify.js";
import GenreRouter from "./genre.js";
import ArtistRouter from "./artist.js";
import AlbumRouter from "./album.js";
import statRoutes from "./stat.js";

const router = Router();
router.use("/auth", UserRouter);
router.use("/playlist", PlaylistRouter);
router.use("/songs", SongRouter);
router.use("/spotify", SpotifyRouter);
router.use("/genre", GenreRouter);
router.use("/artist", ArtistRouter);
router.use("/album", AlbumRouter);
router.use("/stat", statRoutes);

export default router;
