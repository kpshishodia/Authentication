import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/auth.route.js';

const app = express();

// 1. Parse incoming JSON request bodies.
// Makes JSON data available through req.body.
app.use(express.json({ limit: '16kb' }));

// 2. Log HTTP requests in the terminal.
// Useful for debugging incoming requests and responses.
app.use(morgan('dev'));

// 3. Configure CORS to allow requests from the frontend.
// credentials: true allows cookies to be sent with cross-origin requests.
// The frontend origin must match the actual frontend URL.
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    })
);

// 4. Parse URL-encoded request bodies.
// Useful when data is submitted through HTML forms.
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// 5. Parse cookies from incoming requests.
// Makes cookies available through req.cookies.
// Useful for JWT authentication stored in cookies.
app.use(cookieParser());

// 6. Health-check route.
// Allows us to check whether the API is running.
// No authentication is required for this route.
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Auth API is running',
    });
});

// 7. Mount the authentication router.
// All routes defined in userRouter will start with /api/v1/auth.
app.use('/api/v1/auth', userRouter);

// 8. Export the Express app.
export default app;