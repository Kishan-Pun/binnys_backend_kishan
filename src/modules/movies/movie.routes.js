import express from "express";
import {
  getMovies,
  getSortedMovies,
  searchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getMovieById
} from "./movie.controller.js";
import { validate } from "../../middleware/validateRequest.js";
import {
  movieCreateSchema,
  movieUpdateSchema,
  getMoviesQuerySchema,
  sortMoviesQuerySchema,
  searchMoviesQuerySchema
} from "./movie.schemas.js";
import { protect } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = express.Router();

// Public routes
router.get("/", validate(getMoviesQuerySchema, "query"), getMovies);
router.get("/sorted", validate(sortMoviesQuerySchema, "query"), getSortedMovies);
router.get("/search", validate(searchMoviesQuerySchema, "query"), searchMovies);
router.get("/:id", getMovieById);

// Protected admin routes
router.post(
  "/",
  protect,
  requireRole("admin"),
  validate(movieCreateSchema, "body"),
  createMovie
);

router.put(
  "/:id",
  protect,
  requireRole("admin"),
  validate(movieUpdateSchema, "body"),
  updateMovie
);

router.delete("/:id", protect, requireRole("admin"), deleteMovie);

export default router;
