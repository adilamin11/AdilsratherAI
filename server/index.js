import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/user.route.js";
import promtRoutes from "./routes/prompt.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;
const MONGO_URL = process.env.MONGO_URI;

if (!MONGO_URL) {
  throw new Error("MONGO_URI is not defined in .env");
}

// middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// DB Connection
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ MongoDB Connection Error: ", error));

// API routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/AdilsAi", promtRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "./client/dist")));

  app.get(" / ", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
