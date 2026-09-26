import validator from "validator";

const ValidateSignUpData = (body) => {
  const { userName, email, password, gender, age} = body;

  // ===========================
  // Username Validation
  // ===========================
  if (!userName?.trim()) {
    throw new Error("Username is required.");
  }

  if (userName.trim().length < 4 || userName.trim().length > 20) {
    throw new Error("Username must be between 4 and 20 characters.");
  }

  // ===========================
  // Email Validation
  // ===========================
  if (!email?.trim()) {
    throw new Error("Email is required.");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address.");
  }

  // ===========================
  // Password Validation
  // ===========================
  if (!password) {
    throw new Error("Password is required.");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must contain uppercase, lowercase, number and special character."
    );
  }

  // ===========================
  // Gender Validation
  // ===========================
  if (!gender) {
    throw new Error("Gender is required.");
  }

  if (!["male", "female", "others"].includes(gender.toLowerCase())) {
    throw new Error("Invalid gender.");
  }

  // ===========================
  // Age Validation
  // ===========================
  if (age === undefined || age === null) {
    throw new Error("Age is required.");
  }

  if (typeof age !== "number") {
    throw new Error("Age must be a number.");
  }

  if (age < 18) {
    throw new Error("User must be at least 18 years old.");
  }

  
};

export default ValidateSignUpData;