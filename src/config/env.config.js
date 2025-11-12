import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z
    .string()
    .min(10, "JWT_SECRET must be at least 10 characters long"),
  JWT_EXPIRES_IN: z.string().default("1d"),

  SPOTIFY_CLIENT_ID: z.string().min(1, "SPOTIFY_CLIENT_ID is required"),
  SPOTIFY_CLIENT_SECRET: z.string().min(1, "SPOTIFY_CLIENT_SECRET is required"),
  SPOTIFY_TOKEN_URL: z
    .string()
    .url("SPOTIFY_TOKEN_URL must be a valid URL")
    .default("https://accounts.spotify.com/api/token"),
  SPOTIFY_API_URL: z
    .string()
    .url("SPOTIFY_API_URL must be a valid URL")
    .default("https://api.spotify.com/v1"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(" Invalid environment configuration:");
  parsed.error.errors.forEach((err) => {
    console.error(`→ ${err.path.join(".")}: ${err.message}`);
  });
  process.exit(1);
}
  
export const env = parsed.data;
