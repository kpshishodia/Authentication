import express from "express";
import registerUserController from "../controllers/register.controller.js";
import loginUserController from "../controllers/login.controller.js";
import logOutController from "../controllers/logout.controller.js";
import getProfileController from "../controllers/getProfile.controller.js";
import sendVerifyOtpController from "../controllers/sendVerifyOtp.controller.js"
import verifyEmailController from "../controllers/verifyEmail.controller.js"
import fileUpload from '../middlewares/multer.js';
import verifyJWT from "../middlewares/verifyJWT.js";
const userRouter = express.Router()

// Public routes — no verifyJWT
userRouter.route("/register").post(
  fileUpload.fields([
    {name: "avatar" , maxCount: 1},
    {name: "coverImage" , maxCount: 2}
  ]),
  registerUserController
);

userRouter.route("/login").post(
loginUserController
)

// Private (controlled) routes - verifyJWT

userRouter.route("/logOut").post(
  verifyJWT ,
   logOutController
)

userRouter.route("/profile").get(
  verifyJWT ,
  getProfileController
)

userRouter.route("/sendverifyotp").post(
  verifyJWT ,
  sendVerifyOtpController
)

userRouter.route("/verifyemail").post(
  verifyJWT ,
  verifyEmailController
)


export default userRouter;