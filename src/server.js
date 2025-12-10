import dotenv from "dotenv";
import app from "./app.js";
import { startMovieWorker } from "./queue/movieWorker.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);

  // ✅ Auto-start BullMQ worker if Redis is available
  if (process.env.REDIS_URL) {
    console.log("✅ REDIS_URL detected → starting BullMQ worker...");
    startMovieWorker();
  } else {
    console.log("⚠️ REDIS_URL not set → worker disabled");
  }
});
