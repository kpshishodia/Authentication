import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

const verifyJWT = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?._id).select(
      "-refreshToken -password"
    );

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid access token" });
    }

    req.user = user;
    next();
  } catch (error) {
    // jwt.verify throws for expired or tampered tokens
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default verifyJWT;