import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { connectDB } from "../config/db.js";
import { movieService } from "../modules/movies/movie.service.js";

const MOVIE_QUEUE_NAME = "movie-insert-queue";

const start = async () => {
  try {
    if (!process.env.REDIS_URL || !redisConnection) {
      console.log(
        "REDIS_URL not set or Redis not available. Worker will not start."
      );
      process.exit(0);
    }

    await connectDB();
    console.log("Worker connected to MongoDB");

    const worker = new Worker(
      MOVIE_QUEUE_NAME,
      async (job) => {
        if (job.name === "add-movie") {
          console.log("Processing job:", job.id, job.data.title);
          await movieService.createMovie(job.data);
          console.log("Movie inserted:", job.data.title);
        } else {
          console.log("Unknown job type:", job.name);
        }
      },
      {
        connection: redisConnection
      }
    );

    worker.on("completed", (job) => {
      console.log(`Job ${job.id} completed`);
    });

    worker.on("failed", (job, err) => {
      console.error(`Job ${job?.id} failed:`, err?.message);
    });

    console.log(`Movie worker is listening on queue: ${MOVIE_QUEUE_NAME}`);
  } catch (err) {
    console.error("Worker startup error:", err.message);
    process.exit(1);
  }
};

start();
