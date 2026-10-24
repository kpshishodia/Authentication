import express from "express";
import registerUserController from "../controllers/register.controller.js";
import loginUserController from "../controllers/login.controller.js";
import logOutController from "../controllers/logout.controller.js";
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


export default userRouter;