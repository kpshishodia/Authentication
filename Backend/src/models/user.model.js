import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: [true, "username is required."],
            unique: [true, "username must be unique."]
        },
        email: {
            type: String,
            required: [true, "email is required."],
            unique: [true, "email must be unique."]
        },
        password: {
            type: String,
            required: [true, "password is required."],
        }
    },
    {timestamps: true}
)


// 🧠 Create Model
// -----------------------------
const User = mongoose.model(
  "User", // model name used in code
  userSchema,
  "user" // collection name in MongoDB
);

export default  User;