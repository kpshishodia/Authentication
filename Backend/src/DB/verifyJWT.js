import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

const verifyJWT = async (req,res,next) => {

    // 1. get accessToken from cookies in request
    
    const accessToken = req.cookies.accessToken;
    
    // 2. basic validation

    if(!accessToken){
        return res.status(400).json({
            message: "invalid Token."
        })
    }

    // 3 . verify token

    const decoded = jwt.verify(
        accessToken , 
        process.env.ACCESS_TOKEN_SECRET
    )

    // 4. verify token validation
    if(!decoded){
        return res.status(400).json({
            messgae: "token verification failed."
        })
    }


    // 5 . find user and remove sensitive data

    const user = await User.findById(decoded._id)
    .select(" -password - refreshToken")

    if(!user){
        return res.status(400).json({
            message: "error finding user in verifyjwt middleware"
        })
    }

    // 6 . attach user with req

    req.user = user;

    next()
}

export default verifyJWT;