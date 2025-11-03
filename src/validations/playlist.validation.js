import { z } from "zod";

export const createPlaylistSchema = z.object({
  name: z.string().min(1, { message: "Playlist name is required" }),
  description: z.string().optional(),
});

export const updatePlaylistSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});
