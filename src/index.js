import mongoose from "mongoose";
import express from "express";
import { env } from "./config/env.config.js";
import cors from "cors";

import testRoute from "./routes/test.js";
import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import songRoute from "./routes/song.js";
import testSpotifyAuth from "./routes/testSpotifyAuth.js";
import spotifyRoutes from "./routes/spotify.js";

import playlistRoutes from "./routes/playlist.js";

import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.config.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json()); // OK for POST/PUT/PATCH
app.use(express.urlencoded({ extended: true }));

app.use("/api", testRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/song", songRoute);
app.use("/api/spotify", testSpotifyAuth);
app.use("/api/spotify", spotifyRoutes);
app.use("/playlist", playlistRoutes);
app.use(errorMiddleware);

connectDB();

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
