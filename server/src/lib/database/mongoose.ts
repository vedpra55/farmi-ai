import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
let connectionPromise: Promise<typeof mongoose> | null = null;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env",
  );
}

export async function connectToDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  try {
    connectionPromise = mongoose.connect(MONGODB_URI);
    const connectionInstance = await connectionPromise;
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    connectionPromise = null;
    console.log("MONGODB connection FAILED ", error);
    throw error;
  }
}
