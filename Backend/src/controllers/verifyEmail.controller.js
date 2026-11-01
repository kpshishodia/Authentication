import bcrypt from "bcrypt";

const verifyEmailController = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = req.user;

    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required." });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account already verified." });
    }

    // No OTP stored (never sent or already used)
    if (!user.verifyOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // Check expiry first (cheap check before the bcrypt compare)
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }

    // Compare plain OTP from client with the hashed OTP in the DB
    const isOtpValid = await bcrypt.compare(String(otp), user.verifyOtp);
    if (!isOtpValid) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
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