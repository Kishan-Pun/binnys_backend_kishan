import { z } from "zod";

const baseMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required").optional(),
  rating: z.coerce
    .number()
    .min(0, "Rating cannot be negative")
    .max(10, "Rating cannot be more than 10"),
  releaseDate: z
    .string()
    .min(1, "Release date is required")
    .or(z.date())
    .optional(),
  duration: z.coerce
    .number()
    .positive("Duration must be positive")
    .optional(),
  genre: z.array(z.string()).optional(),
  posterUrl: z.string().url("Poster URL must be a valid URL").optional(),
});

export const movieCreateSchema = baseMovieSchema.extend({
  title: z.string().min(1, "Title is required"),
  rating: z.coerce
    .number()
    .min(0, "Rating cannot be negative")
    .max(10, "Rating cannot be more than 10"),
});

export const movieUpdateSchema = baseMovieSchema.partial();

export const getMoviesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export const sortMoviesQuerySchema = z.object({
  by: z
    .enum(["name", "rating", "releaseDate", "duration"])
    .optional()
    .default("name"),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});

export const searchMoviesQuerySchema = z.object({
  q: z.string().min(1, "Search query cannot be empty"),
});
