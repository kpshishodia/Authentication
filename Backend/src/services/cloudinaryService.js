import dotenv from "dotenv";
dotenv.config();

// 📦 Loads environment variables from .env file into process.env

// Import Cloudinary SDK
import { v2 as cloudinary } from "cloudinary";

// File system module
import fs from "fs";

// -----------------------------
// ☁️ Cloudinary Configuration
// -----------------------------

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -----------------------------
// 📤 Upload Function
// -----------------------------

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // ❌ If file path is not provided, exit early
    if (!localFilePath) return null;

    // 📤 Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "auto",
      }
    );

    // 🧾 Log upload response
    console.log("uploadResult:", uploadResult);

    // 🗑️ Delete local temp file after successful upload
    fs.unlinkSync(localFilePath);

    // ✅ Return upload result
    return uploadResult;

  } catch (error) {
    // ❌ If any error occurs during upload
    console.log(error);

    // 🗑️ Delete local file if it still exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    // ❌ Return null to indicate failure
    return null;
  }
};


// -----------------------------
// 🗑️ Delete Function
// -----------------------------

const deleteFromCloudinary = async (publicId) => {
  try {
    // ❌ If public_id is not provided, exit early
    if (!publicId) return null;

    // 🗑️ Delete image from Cloudinary
    const deleteResult = await cloudinary.uploader.destroy(
      publicId
    );

    // 🧾 Log delete response
    console.log("deleteResult:", deleteResult);

    // ✅ Return delete result
    return deleteResult;

  } catch (error) {
    // ❌ If deletion fails
    console.log("Cloudinary delete error:", error);

    // ❌ Return null to indicate failure
    return null;
  }
};


// -----------------------------
// 📦 Exports
// -----------------------------

export {uploadOnCloudinary, deleteFromCloudinary };

