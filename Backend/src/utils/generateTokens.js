// ----------------------------------------------------
// generateTokens.js — shared token helper
// ----------------------------------------------------
// Flow / Pseudo Code:
// 1. Find user by userId
// 2. Generate access token (User schema method)
// 3. Generate refresh token (User schema method)
// 4. Save latest refresh token on user document
// 5. Return { accessToken, refreshToken }
// ----------------------------------------------------
// Used by: register, login, refreshAccessToken controllers

import User from "../models/user.model.js";

const generateAccessAndRefreshTokens = async (userId) => {

  try {

    // 1. Fetch fresh user document before calling schema methods
    const user = await User.findById(userId);

    // 2. & 3. Schema methods return signed JWT strings
    const accessToken =
      await user.generateAccessToken();

    const refreshToken =
      await user.generateRefreshToken();

    // 4. Keep only the latest refresh token in DB
    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    return {
      accessToken,
      refreshToken,
    };

  } catch (error) {

    throw new Error(
      "Something went wrong while generating tokens"
    );
  }
};

export default generateAccessAndRefreshTokens;