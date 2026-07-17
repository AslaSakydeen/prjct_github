import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";

// REGISTER
export const register = async (req: any, res: any) => {
    try {
        const { name, email, password } = req.body;

        console.log("REGISTER REQUEST:", req.body);

        // check user exists
        const userExists = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // INSERT 
       const result = await pool.query(
        `INSERT INTO users (full_name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING user_id, full_name, email, role`,
        [name, email, hashedPassword, "user"]
);

        res.json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error: any) {
        console.error("REGISTER ERROR 👉", error); // IMPORTANT
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
export const login = async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        // find user
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = result.rows[0];
        
     
        
        // check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        

        // create token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            role: user.role,
            user: {
                id: user.user_id,
                name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};