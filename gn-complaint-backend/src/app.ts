import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { pool } from "./db";
import authRoutes from "./routes/authRoutes";
import complaintRoutes from "./routes/complaints";
import usersRoutes from "./routes/users";



import path from "path";//image upload

dotenv.config();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));//image upload

app.use(cors());
app.use(express.json());
app.use("/api", complaintRoutes);
app.use("/api/users", usersRoutes);


app.get("/", (req, res) => {
    res.send("GN Complaint Management API is running 🚀");
});


app.use("/api/auth", authRoutes);


pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Database connected successfully:", res.rows[0]);
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});