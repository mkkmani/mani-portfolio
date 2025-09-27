import mongoose from "mongoose";
import { ENV_CONFIG } from "@/config/envConfig";

const connectToDB = async () => {
  try {
    const { MONGODB_URI, MONGODB_DB } = ENV_CONFIG;

    const connectionString = `${MONGODB_URI}/${MONGODB_DB}`;

    await mongoose.connect(connectionString);

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDB;
