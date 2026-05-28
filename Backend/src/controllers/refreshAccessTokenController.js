import User from "../models/user.model";
import jwt from "jsonwebtoken"
import generateAccessAndRefreshTokens from "../utils/generateTokens";




const refreshAccesstoken = async (req,res) => {
try{

// 1 . get refresh token from cokkie

const incomingRefreshToken = req.cookies.refreshToken

if(!incomingRefreshToken){
    return res.status(400).json({
        message: "erron accessing refresh token from cookie ."
    })
}

// 2. verify token

const decodedIncomingRefreshToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
)

if(!decodedIncomingRefreshToken){
    return res.status(400).json({
        messgae: "error in verifying incomingrefrehtoken."
    })
}

// 3 . find user 

const user = await User.findById(decodedIncomingRefreshToken._id)

if (!user) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // 4 .  Match refresh token with DB

    if (incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json({
        message: "Refresh token expired or mismatch",
      });
    }


    // 5 . generate  new tokens

    const {accessToken , newRefreshtoken} = generateAccessAndRefreshTokens(user._id)

    // 6. Cookie options
    // ------------------------------------------------
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };

    // ------------------------------------------------
    // 7. Send response
    // ------------------------------------------------
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshtoken, options)
      .json({
        message: "Access token refreshed successfully",
        accessToken,
        refreshToken : newRefreshtoken,
      });



}catch(error){
     return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
}
}


export default refreshAccesstoken;