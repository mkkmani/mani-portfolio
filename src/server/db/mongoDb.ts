import mongoose, { Connection } from "mongoose";
import { ENV_CONFIG } from "@/config/envConfig";

let isConnected = false;
let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const connectionOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

const connectToDB = async (): Promise<Connection> => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection");
    return mongoose.connection;
  }

  try {
    const { MONGODB_URI, MONGODB_DB } = ENV_CONFIG;
    const connectionString = `${MONGODB_URI}/${MONGODB_DB}`;

    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(connectionString, connectionOptions);

    isConnected = true;
    retryCount = 0;
    console.log("✅ MongoDB connected successfully");
    return mongoose.connection;
  } catch (error: unknown) {
    retryCount++;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(
      `❌ Error connecting to MongoDB (attempt ${retryCount}/${MAX_RETRIES}):`,
      errorMessage
    );

    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectToDB();
    }

    console.error(
      "❌ Max retries reached. Please check your MongoDB connection."
    );
    throw new Error("Failed to connect to MongoDB after multiple attempts");
  }
};

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
  isConnected = false;
});

mongoose.connection.on("disconnected", () => {
  console.log("ℹ️ MongoDB disconnected");
  isConnected = false;
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
});

export default connectToDB;
