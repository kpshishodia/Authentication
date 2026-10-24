import User from "../models/user.model.js"
const logOutController = async (req,res) => {
    
    try{

    // 1 . remove refreshToken form document in DB. user is already attch to request by verifyJWT
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            // $set: {
            //     refreshToken: 1,
            // }

            $unset: { refreshToken: 1 }
        },
        {
            new: true
        },
    )
    if(!user){
        return res.status(400).json({
            messgae : "Error finding user from Db while LogOut.",
        })
    }

    console.log("LogOut - user:", user) // for debugging

    // 2 . cookieOptions 

    const clearCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

//  3 . return respone and clear cookies

return res.status(200)
.clearCookie("refreshToken", clearCookieOptions )
.clearCookie("accessToken", clearCookieOptions)
.json({
    message: "User Successfully LogOut. "
})


    }catch(error){
        return res.status(400).json({
            message: "Error in LogOut.",
            error: error.message,
        })
    }

}

export default logOutController;