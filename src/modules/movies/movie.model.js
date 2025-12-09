import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    rating: { type: Number, required: true },
    duration: { type: Number, required: true }, // minutes, can be decimal
    releaseDate: { type: Date, required: true },
    posterUrl: { type: String },
    genre: [{ type: String }],

    cast: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        characterName: {
          type: String,
          required: true,
          trim: true,
        },
        imageUrl: {
          type: String,
          trim: true,
        },
      },
    ],

    crew: [
      {
        role: {
          type: String,
          required: true,
          trim: true, // e.g. "Director", "Writer"
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    trailerUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

movieSchema.index({ title: "text", description: "text" });

export const Movie = mongoose.model("Movie", movieSchema);
