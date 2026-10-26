import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({


},{
    timestamps: true
})

// -----------------------------
// 🧠 Create Model
// -----------------------------
const Session = mongoose.model(
  "Session", // model name used in code
  sessionSchema,
  "Session" // collection name in MongoDB
);

export default Session;