import app from "./app.js";
import { connectToDB } from "./lib/database/mongoose.js";

const PORT = 8000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`[INFO] 🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("[ERROR] Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
