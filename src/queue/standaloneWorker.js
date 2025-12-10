// src/queue/standaloneWorker.js
import dotenv from "dotenv";
dotenv.config();

import { startMovieWorker } from "./movieWorker.js";

console.log("[Standalone] Starting movie worker as separate process...");
startMovieWorker();
