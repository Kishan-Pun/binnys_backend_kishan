import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String },
    rating: { type: Number, required: true, index: true }, 
    releaseDate: { type: Date, index: true },
    duration: { type: Number,required: true, index: true }, 
    genre: [String],
    posterUrl: String
  },
  { timestamps: true }
);

// text index for search on title + description
movieSchema.index({ title: "text", description: "text" });

export const Movie = mongoose.model("Movie", movieSchema);
