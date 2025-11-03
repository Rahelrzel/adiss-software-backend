import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
  isPublished: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Playlist", playlistSchema);
