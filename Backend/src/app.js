// ============================================================
// src/app.js — Express application setup
// ============================================================

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// CORS: allow frontend origin; credentials: true so cookies work cross-origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Parse JSON / urlencoded bodies and read cookies (needed for JWT auth)
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());


// Health check — no auth required
app.get("/", (req, res) => {
  return res.status(200).json({
    message: " Auth API is running",
  });
});


export default app;
