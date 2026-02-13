import dotenv from "dotenv";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from server root
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

interface Env {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  CORS_ORIGIN: string;
}

export const env: Env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "8000", 10),
  MONGODB_URI: process.env.MONGODB_URI || "",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};

// Validate required variables
const requiredEnvVars: (keyof Env)[] = ["MONGODB_URI"];

for (const key of requiredEnvVars) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
