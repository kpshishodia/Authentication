import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required."]
    },
     refreshTokenHash: {
        type: String,
        required: [true, "Refresh Token is required."]
     },
     ip: {
        type: String,
        required: [true, "IP is required."],
     },
     userAgent: {
        type: String,
        required: [true, "User Agent is required."]
     },
     revoked: {
        type: Boolean,
        default: false
     },

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