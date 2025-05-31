import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.route.js";
import promptRoutes from "./routes/prompt.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;
const MONGO_URL = process.env.MONGO_URI;

// Use a fallback for local development (for CORS origin)
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// DB Connection Code
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1); // Exit the process if connection fails
  });

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/AdilsAi", promptRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
