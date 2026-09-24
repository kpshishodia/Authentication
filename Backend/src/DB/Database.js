// ----------------------------------------------------
// Database.js — MongoDB connection
// ----------------------------------------------------
// Flow / Pseudo Code:
// 1. Read MONGO_URI and DB_NAME from .env
// 2. Build connection URL and call mongoose.connect
// 3. On failure, log and re-throw so server.js does not start listening
// ----------------------------------------------------

import dotenv from "dotenv";
dotenv.config();

import  mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME

const URL = (`${MONGO_URI}/${DB_NAME}`)

const ConnectToDB = async () => {
  try {
    // Debug log to verify your URL (remove in production if you want)
    console.log("Mongo URL:", URL);

    await mongoose.connect(URL);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    // IMPORTANT:
    // Re-throw the error so the caller can stop the server from starting
    // when MongoDB connection fails.
    console.log("❌ MongoDB Connection Failed:", error.message);
    throw error;
  }
};

export default  ConnectToDB;