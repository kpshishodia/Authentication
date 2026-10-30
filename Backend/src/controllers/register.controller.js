
import User from "../models/user.model.js";
import ValidateSignUpData from "../utils/RegisterValidation.js";
import { uploadOnCloudinary } from "../services/cloudinaryService.js";
import transporter from "../services/nodeMailer.js";

const registerUserController = async (req, res) => {
    try {

        // 1. get user fields from req.body

        // convert before validation
        req.body.age = Number(req.body.age);

        if (Number.isNaN(req.body.age)) {
            throw new Error("Age must be a valid number.");
        }

        const { userName, email, password, gender, age } = req.body;

        console.log(`username : ${userName}`); // for debugging only


        // 2. validate allowed fields with request fields from client(user)

        const allowedFields = ["userName", "age", "email", "password", "gender"];
        const requestFields = Object.keys(req.body);

        const isValid = requestFields.every((field) => {
            return allowedFields.includes(field);
        });

        if (!isValid) {
            return res.status(400).json({
                message: "Invalid fields in request object."
            });
        }


        // 3. run ValidateSignUpData(body) function

        ValidateSignUpData(req.body);


        // 4. check if user already exist

        const userAlreadyExist = await User.findOne({ email: email });

        console.log(`userAlreadyExist : ${userAlreadyExist}`);

        if (userAlreadyExist) {
            return res.status(400).json({
                message: "User already exist with this email."
            });
        }


        // 5. get optional files from client through multer middleware

        const allFiles = req.files;

        console.log("AllFiles:", allFiles);

        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

        console.log("avatarLocalPath :", avatarLocalPath);
        console.log("coverImageLocalPath :", coverImageLocalPath);


        // 6. upload files to Cloudinary only if files exist

        let avatarUploadedResult = null;
        let coverImageUploadedResult = null;

        if (avatarLocalPath) {
            avatarUploadedResult = await uploadOnCloudinary(avatarLocalPath);
        }

        if (coverImageLocalPath) {
            coverImageUploadedResult = await uploadOnCloudinary(coverImageLocalPath);
        }

        console.log("avatarUploadedResult :", avatarUploadedResult);
        console.log("coverImageUploadedResult :", coverImageUploadedResult);


        // 7. create user instance or entry in DB with optional files

        const user = await User.create({
            userName: userName.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            gender: gender.trim().toLowerCase(),
            age: age,
            password: password.trim(),

            avatar: avatarUploadedResult ? {
                url: avatarUploadedResult.url,
                public_id: avatarUploadedResult.public_id,
            } : undefined,

            coverImage: coverImageUploadedResult ? {
                url: coverImageUploadedResult.url,
                public_id: coverImageUploadedResult.public_id,
            } : undefined,

        });

        console.log("user :", user);

        if (!user) {
            return res.status(400).json({
                message: "Error creating user entry in DB."
            });
        }


        // 8. create accessToken and refreshToken

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        console.log("accessToken:", accessToken);
        console.log("refreshToken:", refreshToken);


        // 9. cookieOptions

        const refreshTokenCookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        const accessTokenCookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        };


        // 10. save refreshToken in DB and run save query

        console.log("Generated refreshToken:", refreshToken);

        user.refreshToken = refreshToken;

        console.log("Before save");

        await user.save({
            validateBeforeSave: false,
        });

        console.log("After save");


        // 11. fetch newly created user from DB and remove sensitive info

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        if (!createdUser) {
            return res.status(400).json({
                message: "Error fetching newly created user from DB."
            });
        }

        console.log("createdUser :", createdUser);


        // sending welcome email

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to my app.",
            text: `Welcome : ${email}`
        };

        await transporter.sendMail(mailOptions);


        // 12. return response with cookies

        return res.status(200)
            .cookie("accessToken", accessToken, accessTokenCookieOptions)
            .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
            .json({
                message: "User registered successfully.",
                createdUser
            });

    } catch (error) {

        console.error(error);

        return res.status(400).json({
            message: "Bad request",
            error: error.message,
            stack: error.stack
        });
    }
};

export default registerUserController;
