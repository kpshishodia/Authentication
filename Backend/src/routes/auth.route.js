import express from "express"
import registerUserController from "../controllers/registerUserController.js"
import loginUsercontroller from "../controllers/loginUserController.js"
import logOutUserController from "../controllers/logOutcontroller.js"
import verifyJWT from "../middlewares/verifyJWT.js"

const userRouter = express.Router()

// Public routes — no verifyJWT
userRouter.route("/register").post(
  registerUserController,
  
);

userRouter.route("/login").post(
  loginUsercontroller,
)

// Protected Routes

userRouter.route("/logout").post(
verifyJWT , logOutUserController
)

export default userRouter;