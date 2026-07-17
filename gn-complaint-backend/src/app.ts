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
import { sendEmail } from "./utils/sendEmail";
import notificationRoutes from "./routes/notification";

import path from "path";//image upload
console.log("APP FILE LOADED");

dotenv.config();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));//image upload

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api", complaintRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/track", trackRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
    res.send("GN Complaint Management API is running 🚀");
});


app.use("/api/auth", authRoutes);


pool.query("SELECT NOW()")
.then((res) => {
    console.log("✅ Database connected successfully:", res.rows[0]);
})
.catch((err) => {
    console.error("❌ Database connection failed:", err.message);
});


const PORT = process.env.PORT || 5000;

const server = app.listen(Number(PORT));

server.on("listening", () => {
    console.log("🚀 SERVER IS LISTENING");
    console.log(server.address());
});

server.on("close", () => {
    console.log("❌ SERVER CLOSED");
    console.trace("Close stack:");
});

server.on("error", (err) => {
    console.error("❌ SERVER ERROR:", err);
});
server.on("close", () => {
    console.log("❌ SERVER CLOSED");
});
process.on("exit", (code) => {
    console.log("❌ NODE PROCESS EXITING. Code:", code);
});

