import User from "../models/user.model.js"
import ValidateLoginData from "../utils/LoginValidation.js"

const loginUserController = async(req,res) => {
    try{

        // 1 . fetch data from client
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            message: "Error fetching email and pasword from client request."
        })
    }

    // 2 . validate feilds coming from client user throught ValidateLoginData()

    ValidateLoginData(req.body);

    // 3 . check if user with this email already exist 

    const user = await User.findOne({email: email});
    if(!user){
        return res.status(400).json({
            message : "Error fetching user with this email."
        })
    }

    // 4 . check if password is correct or not 

    const isMatch = await user.isPasswordCorrect(password)

    if(!isMatch){
        return res.status(400).json({
            message: "Wrong password verification failed.",
        })
    }
    
    // 5 . generate accessToken and refreshToken

    const accessToken = await user.generateAccessToken()

    const refreshToken = await user.generateRefreshToken()

    console.log("accessToken :" , accessToken) // for debugging
    console.log("refreshToken :", refreshToken) // for debugging

    // 6 . cokkie options 

    const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

 const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
};


// 7 . save refresh token in DB

user.refreshToken = refreshToken;

await user.save({
     validateBeforeSave: false,
})

// 8 . remove sensitive info like password and refresh token from user document  before sending respone to client

const createdUser = await User.findById(user._id).select(
    "-refreshToken  -password"
)

if(!createdUser){
    return res.status(400).json({
        message : "Error fetching newly created user from DB to Client.",
    })
}

// 9 . return respone with newly created user document cookies 

return res.status(200)
.cookie("accessToken", accessToken, accessTokenCookieOptions)
.cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
.json({
    message: "User Successfully Log in.",
    createdUser,
})

    }catch (error) {
    console.error(error);

    return res.status(400).json({
        message: "Bad request",
        error: error.message,
        stack: error.stack
    });
}
    
}

export default loginUserController;
