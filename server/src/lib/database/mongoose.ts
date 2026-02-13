import mongoose from "mongoose";
import { env } from "@/lib/config/env.js";
import { logger } from "@/lib/utils/logger.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    if (!env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables",
      );
    }

    await mongoose.connect(env.MONGODB_URI);

    logger.info("🍃 Connected to MongoDB");
  } catch (error) {
    logger.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
