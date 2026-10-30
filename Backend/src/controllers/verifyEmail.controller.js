const verifyEmailController = async (req, res) => {
  try {
    // Only the OTP comes from the client
    const { otp } = req.body;

    // Identity comes from the token (set by verifyJWT)
    const user = req.user;

    // Make sure the client actually sent an OTP
    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required." });
    }

    // Nothing to verify if the account is already verified
    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified." });
    }

    // verifyOtp === "" means no OTP was ever sent (or it was already used).
    // String(otp) handles the case where Postman sends a number instead of a string.
    if (user.verifyOtp === "" || user.verifyOtp !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // Check expiry
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }

    // All good: verify the account and clear the OTP so it can't be reused
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying the email.",
    });
  }
};

export default verifyEmailController;