// server/index.js

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

// ✅ CORRECT WAY to handle multiple origins
const allowedOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map(origin => origin.trim());

console.log("✅ Allowed origins:", allowedOrigins); // <- DEBUG

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

// DB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/AdilsAi", promptRoutes);

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
