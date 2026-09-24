import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js"
import ConnectToDB from "./src/DB/Database.js"
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