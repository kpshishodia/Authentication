import User from "../../models/user.model.js"
import ValidateSignUpData from "../../utils/RegisterValidation.js"
import {uploadOnCloudinary} from "../../services/cloudinaryService.js"

const registerUserController = async (req,res) => {
try{
    // 1 . get user fields from req.body

        // convert before validation
req.body.age = Number(req.body.age);

if (Number.isNaN(req.body.age)) {
    throw new Error("Age must be a valid number.");
}

    const {userName, email, password, gender, age} = req.body;
    console.log(`username : ${userName}`) // for debuging only



    // 2 . validate allowed fields with request fields from client(user)

    const allowedFeilds = ["userName", "email", "password", "gender", "age"];
    const requestFields = Object.keys(req.body)

    const isValid = requestFields.every((feild)=>{
        return allowedFeilds.includes(feild)
    })

    if(!isValid){
        return res.status(400).json({
            message:"Invalid fields in request object."
        })
    }

    // 3 . run ValidateSignUpData(body) function

    ValidateSignUpData(req.body)

    // 4 . check if user already exist

    const userAlreadyExist = await User.findOne({email : email})
    console.log(`userAlreadyExist : ${userAlreadyExist}`) // for dubugging purpose only

    if(userAlreadyExist){
        return res.status(400).json({
            message: "User already exist with this email."
        })
    }

    // 5 . upload files we getting from client with use of multer middleware in user register route

    const allFiles = req.files;

    console.log("AllFiles:",  allFiles) // for debugging

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    console.log("avatarLocalPath :", avatarLocalPath)  // for dubugging
    console.log("coverImageLocalPath :" , coverImageLocalPath) // for dubugging

    if(!avatarLocalPath || !coverImageLocalPath){
        return res.status(400).json({
            message : "Error getting files from client through multer.",
        })
    }

    // 6 . upload files we are getting from multer to cloudnary using uploadOnCloudinary() function

    const avatarUploadedResult = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUploadedResult = await uploadOnCloudinary(coverImageLocalPath);

    console.log("avatarUploadedResult :" ,  avatarUploadedResult.url) // for debugging
    console.log("coverImageUploadedResult :" , coverImageUploadedResult.url) // for debugging
    
    if(!avatarUploadedResult || !coverImageUploadedResult){
        return res.status(400).json({
            message : "Error uploading loac files we are getting from multer to cloudnary.",
        })
    }

    // 7 . create user instance or entry in DB with files 

    const user = await User.create({
        userName : userName.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        gender : gender.trim().toLowerCase(),
        age: age,
        password : password.trim(),
        avatar: {
        url: avatarUploadedResult.url,
        public_id: avatarUploadedResult.public_id,
},

        coverImage: {
        url: coverImageUploadedResult.url,
        public_id: coverImageUploadedResult.public_id,
},
        
    })

    console.log("user :" ,  user) // for debugging

    if(!user){
        return res.status(400).json({
            message: "Error creating user entry in DB.",
        })
    }

    // 8 . create accessToken and refreshToken

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    console.log("accessToken:", accessToken)    // for debugging 
    console.log("refreshToken:", refreshToken)  // for debugging 


     // 9 . cookieOptions 

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


    // 10 . save refreshToken in DB and run save query

    console.log("Generated refreshToken:", refreshToken);

user.refreshToken = refreshToken;

console.log("Before save");

await user.save({
    validateBeforeSave: false,
});

console.log("After save");
    // 11 . fetch newly created user from Db and remove sensitive info like password ,  refreshToken , etc from user before send that user in response

    const createdUser = await User.findById(user._id).select(
        "-password  -refreshToken"
    )

    if(!createdUser){
        return res.status(400).json({
            message: "Error fetching newly created user from DB.",
        })
    }
    console.log("createdUser :", createdUser)

    // 12 . return respone with cookie

    return res.status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json({
        message: "User registered successfully.",
        createdUser
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

export default  registerUserController;