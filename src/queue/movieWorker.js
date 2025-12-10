import { Worker } from "bullmq";
import { MOVIE_QUEUE_NAME } from "./movieQueue.js";
import { redisConnection } from "../config/redis.js";
import { movieService } from "../modules/movies/movie.service.js"; // reuse service
import { movieCreateSchema } from "../modules/movies/movie.schemas.js";

let movieWorkerInstance = null;

export function startMovieWorker() {
  if (!process.env.REDIS_URL) {
    console.log("[Worker] REDIS_URL not set. Movie worker not started.");
    return;
  }

  if (movieWorkerInstance) {
    console.log("[Worker] Movie worker already running in this process.");
    return;
  }

  movieWorkerInstance = new Worker(
    MOVIE_QUEUE_NAME,
    async (job) => {
      console.log("[Worker] job.data:", job.data);

      const { movieData } = job.data || {};

      if (!movieData) {
        throw new Error("movieData missing from job payload");
      }

      const result = movieCreateSchema.safeParse(movieData);
      if (!result.success) {
        console.error("[Worker] Zod validation failed:", result.error.format());
        throw new Error("Zod validation failed in worker");
      }

      const validated = result.data;

      const created = await movieService.createMovie(validated);
      return created;
    },
    { connection: redisConnection }
  );

  movieWorkerInstance.on("completed", (job) => {
    console.log(`[Worker] Movie job ${job.id} completed`);
  });

  movieWorkerInstance.on("failed", (job, err) => {
    console.error(`[Worker] Movie job ${job?.id} failed`, err);
  });

  console.log("[Worker] Movie worker started in API process.");
}
