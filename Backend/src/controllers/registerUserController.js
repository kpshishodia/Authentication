import User from "../models/user.model.js"
import generateAccessAndRefreshTokens from "../utils/generateTokens.js"

const registerUserController = async (req , res) =>{
    try{

    /// ----------------------------------------------------
    // 1. Get data from frontend (Postman / client)
    // ----------------------------------------------------

    // Destructure expected fields from request body for easy validation/use.
   const {userName, email, password, role} = req.body;
   
   // debug
   console.log("user data from req(body):" , userName, email, password, role )

   // 2.  field validation

   const allowedFields = ["userName", "email", "password", "role"]

   const requestFeilds = Object.keys(req.body)

   const isValid = requestFeilds.every((field) => {
    return allowedFields.includes(field)
   })

   if(!isValid){

    return res.status(400).json({
        message: "invalid input fields.",
      });
   }

    // ----------------------------------------------------
    // 3. Basic validations
    // ----------------------------------------------------

    // Username must be present and reasonably long for readability/uniqueness.
    if (!userName || userName.trim().length < 4) {
      return res.status(400).json({
        message: "userName should be at least 4 characters long",
      });
    }


    // Email presence check (format validation can be added later if needed).
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Password minimum length check for basic security.
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password should be at least 6 characters long",
      });
    }
 
    // Role check ensures user type is explicitly provided.

    if(!role){
       return res.status(400).json({
        message: "Role is required",
      });
    }


    // 4 . find if user already exist

    const existingUser = await User.findOne({
        email: email.toLowerCase()
    })

    if(existingUser){
        return res.status(400).json({
            message : "User with this email already exist."
        })
    }

    // 5 . create user in DB

   const user = await User.create({
    userName : userName.toLowerCase(),
    email: email.toLowerCase(),
    password: password,
    role: role.toLowerCase()
   })

   console.log("user created in Db:" , user)

    // ----------------------------------------------------
    // 6. Generate Tokens (via shared utility)
    // ----------------------------------------------------

    // Utility internally:
    // - fetches user
    // - generates access/refresh tokens through schema methods
    // - saves refresh token in DB
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user._id);

      console.log("accesstoken: ",  accessToken )
      console.log("refreshToken:" , refreshToken)

       // 7. Remove sensitive data from response
    // ----------------------------------------------------

    // Read user again and exclude password before sending response.
    const createdUser = await User.findById(user._id).select("-password");

     
    // ------------------------------------------------
    // 8. Cookie options
    // ------------------------------------------------

    // Cookie options:
    // - httpOnly blocks JS access (XSS protection)
    // - secure=false for local/dev HTTP (set true in production HTTPS)
    // - sameSite strict helps reduce CSRF risk
    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };


    // 9 . send cookies with response 

    return res.status(201)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshtoken" , refreshToken , options)
    .json({
      message: "User successfully registered",
      user: createdUser,
      accessToken,
      refreshToken
    });


    }catch(error){
         // ----------------------------------------------------
    // Error handling: keeps response consistent for any unexpected failure.
    // ----------------------------------------------------

    return res.status(400).json({
      message: "Bad request",
      error: error.message,
    });
    }
}
export default registerUserController;