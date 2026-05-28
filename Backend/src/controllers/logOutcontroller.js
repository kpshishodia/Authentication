import User from "../models/user.model.js";

const logOutUserController = async(req,res) => {

    // 1. remove refrehToken from user DB

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new : true
        }
    )


    // 2. cookie option 

      const options = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };


    // 3. respone and clear cokkie

return res.status(200)
.clearcookie("accessToken" , options)
.clearcookie("refreshToken", options)
.json({
    message: "user log Out successfully."
})
}

export default logOutUserController;