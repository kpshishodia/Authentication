// ============================================================
// server.js — application entry point
// ============================================================
// Flow / Pseudo Code:
// 1. Load environment variables from .env (PORT, DB config, JWT secrets, etc.)
// 2. Connect to MongoDB via src/DB/Database.js
// 3. After DB is ready, start Express app from src/app.js on PORT
// ============================================================

// 1. Load environment variables from .env (PORT, DB config, etc.)
import dotenv from "dotenv";
dotenv.config();

// 2. MongoDB connector (throws if connection fails)
import ConnectToDB from "./src/DB/Database.js"

// 3. Configured Express app (middlewares + routes)
import app from "./src/app.js"

// Prefer PORT from .env, but fall back to 8000 for local dev
const port = process.env.PORT || 8000;

// ================= DATABASE CONNECTION =================

// Connect to MongoDB first, then start the HTTP server (do not listen before DB)
ConnectToDB()
  .then(() => {
    console.log("MongoDB Connected Successfully");

    // Start server only after DB is connected successfully
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error);
  });