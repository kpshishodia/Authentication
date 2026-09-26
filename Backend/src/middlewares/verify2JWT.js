import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const verifyJWT = async(req,res,next) =>{
    
    try{
        // 1 . get user info from token exist in cookie in req.body

    const accessToken = req.cookies.accessToken

    console.log("accessToken:", accessToken )

     // If token missing
    if (!accessToken) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    // 2 . verify the token

    const decodeUser =  jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
    )

    console.log("decodeUser:", decodeUser)

    // 3 . find user from DB  and remove sensitive info like refreshToken and password

    const user = await User.findById(decodeUser?._id).select(
        "-refreshToken -password"
    )

    if(!user){
        return res.status(400).json({
          message: "Error fetching user from DB.",  
        })
    }

    console.log("user:", user)

    // 4 . attach user to request

req.user = user    
     // Continue to next middleware/controller
    next();

    }catch(error){
        return res.status(400).json({
            message: "Bad request",
        })
    }
}

export default verifyJWT;