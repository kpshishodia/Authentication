import express from 'express'
import morgan from 'morgan'
import userRouter from "./routes/auth.route.js"
const app = express()
app.use(express.json())
app.use(morgan("dev"))

// Health check — no auth required
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Auth  API is running",
  });
});

app.use("/api/v1/auth", userRouter);

export default app;