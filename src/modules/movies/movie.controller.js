import { movieService } from "./movie.service.js";
import { movieQueue } from "../../queue/movieQueue.js";

export const getMovies = async (req, res, next) => {
  try {
    const data = await movieService.getMovies(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getSortedMovies = async (req, res, next) => {
  try {
    const data = await movieService.getSortedMovies(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const searchMovies = async (req, res, next) => {
  try {
    const data = await movieService.searchMovies(req.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const createMovie = async (req, res, next) => {
  try {
    // NOTE: by the time we reach here, Zod validate middleware
    // has already validated & coerced req.body (movieCreateSchema)

    if (movieQueue) {
      // ✅ IMPORTANT: wrap inside { movieData: ... }
      const job = await movieQueue.add("add-movie", {
        movieData: req.body,
      });

      return res.status(202).json({
        message: "Movie queued for insertion",
        jobId: job.id,
      });
    }

    // Fallback: no Redis/queue → insert directly via service
    const movie = await movieService.createMovie(req.body);

    return res.status(201).json({
      message: "Queue disabled, movie inserted directly",
      movie,
    });
  } catch (err) {
    next(err);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await movieService.updateMovie(req.params.id, req.body);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    await movieService.deleteMovie(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (err) {
    next(err);
  }
};
