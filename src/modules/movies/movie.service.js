import { Movie } from "./movie.model.js";

const SORT_MAP = {
  name: "title",
  rating: "rating",
  releaseDate: "releaseDate",
  duration: "duration"
};

export const movieService = {
  async getMovies({ page = 1, limit = 10 }) {
    const p = Number(page) || 1;
    const l = Number(limit) || 10;
    const skip = (p - 1) * l;

    const [movies, total] = await Promise.all([
      Movie.find().sort({ createdAt: -1 }).skip(skip).limit(l).lean(),
      Movie.countDocuments()
    ]);

    return {
      movies,
      page: p,
      totalPages: Math.ceil(total / l),
      total
    };
  },

  async getSortedMovies({ by = "name", order = "asc" }) {
    const sortField = SORT_MAP[by] || "title";
    const sortOrder = order === "desc" ? -1 : 1;

    const movies = await Movie.find()
      .sort({ [sortField]: sortOrder })
      .lean();

    return { movies };
  },

  async searchMovies({ q }) {
    if (!q) return { movies: [] };

    const movies = await Movie.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .lean();

    return { movies };
  },

  async createMovie(data) {
    const movie = await Movie.create(data);
    return movie.toObject();
  },

  async updateMovie(id, data) {
    const movie = await Movie.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).lean();

    return movie;
  },

  async deleteMovie(id) {
    await Movie.findByIdAndDelete(id);
    return { success: true };
  },

  async getMovieById(id) {
    const movie = await Movie.findById(id).lean();
    return movie;
  }
};
