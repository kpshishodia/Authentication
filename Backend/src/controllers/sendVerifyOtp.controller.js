
import transporter from "../services/nodeMailer.js";

const sendVerifyOtpController = async (req, res) => {
  try {
    // verifyJWT already found the user in the DB and attached it here
    const user = req.user;

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified.",
      });
    }

    // 6 digit OTP, stored as a string
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // req.user is a real mongoose document, so save() works.
    // Only the changed fields (verifyOtp, verifyOtpExpireAt) get written.
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL, // your app's verified Brevo sender
      to: user.email,                 // the logged-in user's own email
      subject: "Account Verification OTP",
      text: `Your verification OTP is ${otp}. It is valid for 24 hours.`,
    });

    return res.json({
      success: true,
      message: "Verification OTP sent to your email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending the OTP.",
      error: error.message,
    });
  }
};

export default sendVerifyOtpController;