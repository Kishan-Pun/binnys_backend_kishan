import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const MOVIE_QUEUE_NAME = "movie-insert-queue"; 

export let movieQueue = null;

if (redisConnection) {
  movieQueue = new Queue(MOVIE_QUEUE_NAME, {
    connection: redisConnection,
  });
  console.log(`Movie queue "${MOVIE_QUEUE_NAME}" initialized`);
} else {
  console.warn("Movie queue disabled because Redis is not connected.");
}
