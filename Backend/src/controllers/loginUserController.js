import User from "../models/user.model";
import generateAccessAndRefreshTokens from "../utils/generateTokens.js"

const loginUsercontroller = async (req,res) => {
   
    // 1. get data from req/client
    const {password , email} = req.body

    // 2 . basic validation 
    if (!password || !email){
        return res.status(400).json({
            message : "password and email required."
        })
    }

    // 3 . find user from  DB

    const user = await User.findOne({email : email})

    if (!user){
        return res.status(400).json({
            message : "user with given email do not exist."
        })
    }

    // 4 . compare password get method from user model

const isMatch = ispasswordCorrect.User(password)

if (!isMatch){
    return res.status(400).json({
        message: "invalid password."
    })
}

// 5 . generater JWT token 

const {accessToken , refreshToken} = generateAccessAndRefreshTokens(user._id)
console.log("Login -  accessToken:" , accessToken)
console.log(" Login - refreshToken" , refreshToken)



    // 6. Cookie options
    // ------------------------------------------------

    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };


    // 7 . send cookies and response 

    return res.status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json({
        message : "User Logged in Successfully."
    })
}

export default loginUsercontroller;

