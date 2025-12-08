import dotenv from "dotenv";
import IORedis from "ioredis";

dotenv.config();

let redisConnection = null;

console.log("REDIS_URL from env in redis.js:", process.env.REDIS_URL); // 👈 debug line

if (process.env.REDIS_URL) {
  try {
    redisConnection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null
    });

    redisConnection.on("connect", () => {
      console.log("Redis connected successfully");
    });

    redisConnection.on("error", (err) => {
      console.error("Redis connection error:", err.message);
    });
  } catch (err) {
    console.error("Failed to create Redis client:", err.message);
    redisConnection = null;
  }
} else {
  console.warn("REDIS_URL not set. Queue features are disabled.");
}

export { redisConnection };
