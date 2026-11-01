import User from "../models/user.model.js";
import transporter from "../services/nodeMailer.js";
import bcrypt from "bcrypt"

const resetPasswordController = async (req , res) => {
    try {
        
        const {otp , email , newPassword} = req.body;

        if(!otp || !email || !newPassword){
            return res.json({
                success: false, message: "Email , otp , newPassword are  required."
            })
        }

    } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while reseting the password.",
      error: error.message,
    });
  }
}

export default resetPasswordController;