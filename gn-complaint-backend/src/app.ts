import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { pool } from "./db";
import authRoutes from "./routes/authRoutes";
import complaintRoutes from "./routes/complaints";
import usersRoutes from "./routes/users";
import trackRoutes from "./routes/track";
import reviewRoutes from "./routes/review";
import reportRoutes from "./routes/report";
import notificationRoutes from "./routes/notification";

console.log("APP FILE LOADED");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "https://prjct-github.vercel.app",
      "https://prjct-github-wyyz.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", complaintRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/track", trackRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("GN Complaint Management API is running 🚀");
});

// Database connection test
pool.query("SELECT NOW()")
  .then((result) => {
    console.log(
      "✅ Database connected successfully:",
      result.rows[0]
    );
  })
  .catch((err) => {
    console.error(
      "❌ Database connection failed:",
      err.message
    );
  });

export default app;