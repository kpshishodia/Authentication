
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import transporter from "../services/nodeMailer.js";

const sendResetOtpController = async (req ,res) => {
try{
    const {email} = req.body

    if(!email){
        return res.json({ success: false, message: "Email is required."})
    }

    const user = await User.findOne({email})
    if(!user){
        return res.json({ success: false, message: "user not found."})
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOtp = await bcrypt.hash(otp, 10);   // store hashed
  user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save({ validateBeforeSave: false });

   await transporter.sendMail({
      from: process.env.SENDER_EMAIL, // your app's verified Brevo sender
      to: user.email,                 // the logged-in user's own email
      subject: "Account Verification OTP",
      text: `Your OTP for resetting your password is  ${otp}. It is valid for 10 minutes.`,
    });


return res.json({
      success: true,
      message: "Reset OTP sent to your email.",
    });

} catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending the  reset OTP to reset the password.",
      error: error.message,
    });
  }
}

export default sendResetOtpController;