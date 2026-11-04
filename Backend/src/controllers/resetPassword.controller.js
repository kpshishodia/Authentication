import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const resetPasswordController = async (req, res) => {
  try {
    const { otp, email, newPassword } = req.body;

    if (!otp || !email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, otp and newPassword are required.",
      });
    }

    const user = await User.findOne({ email });

    // Same message for "no user" and "no OTP" so attackers can't find which emails exist
    if (!user || !user.resetOtp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    // Expiry check first (cheap), with the typo fixed
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    const isResetOtpValid = await bcrypt.compare(String(otp), user.resetOtp);
    if (!isResetOtpValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    // Set the new password (your pre-save hook should hash it)
    user.password = newPassword;

    // Clear the OTP so it can't be reused
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    // No validateBeforeSave: false here, we want password validators to run
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting the password.",
    });
  }
};

export default resetPasswordController;