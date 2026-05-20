import express from "express"
import registerUserController from "../controllers/registerUserController.js"

const userRouter = express.Router()

// Public routes — no verifyJWT
userRouter.route("/register").post(
  registerUserController
);

export default userRouter;