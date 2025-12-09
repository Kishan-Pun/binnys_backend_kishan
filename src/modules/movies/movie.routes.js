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
import { authMiddleware } from "../../middleware/auth.js";
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
  authMiddleware,
  requireRole("admin", "superadmin"),
  validate(movieCreateSchema, "body"),
  createMovie
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin", "superadmin"),
  validate(movieUpdateSchema, "body"),
  updateMovie
);

router.delete("/:id", authMiddleware, requireRole("admin"), deleteMovie);

export default router;
