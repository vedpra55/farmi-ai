import { createApp } from "@/app.js";
import { env } from "@/lib/config/env.js";
import { connectDatabase } from "@/lib/database/mongoose.js";
import { logger } from "@/lib/utils/logger.js";

const startServer = async () => {
  try {
    await connectDatabase();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
    });

    const shutdown = () => {
      logger.info("🛑 Shutting down server...");
      server.close(() => {
        logger.info("👋 Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
