import express from "express"
import registerUserController from "../controllers/registerUserController.js"
import  loginUsercontroller from "../controllers/loginUserController.js"

const userRouter = express.Router()

// Public routes — no verifyJWT
userRouter.route("/register").post(
  registerUserController,
  
);

userRouter.route("/login").post(
  loginUsercontroller,
)


export default userRouter;