import axios from "axios";
import { env } from "../config/env.config.js";

let spotifyToken = null;
let tokenExpiresAt = null;

export const getSpotifyToken = async () => {
  const now = Date.now();

  if (spotifyToken && tokenExpiresAt && now < tokenExpiresAt) {
    return spotifyToken;
  }

  try {
    const response = await axios.post(
      env.SPOTIFY_TOKEN_URL,
      new URLSearchParams({ grant_type: "client_credentials" }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64"),
        },
      }
    );

    spotifyToken = response.data.access_token;
    tokenExpiresAt = now + response.data.expires_in * 1000;

    return spotifyToken;
  } catch (error) {
    console.error(
      "Spotify auth failed:",
      error.response?.data || error.message
    );
    throw new Error("Spotify authentication failed");
  }
};
