import express from "express";
import { pool } from "../db";

const router = express.Router();

// Get all notifications
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        n.notification_id,
        u.full_name,
        c.reference_no,
        n.title,
        n.message,
        n.created_at
      FROM notifications n
      JOIN users u
        ON n.user_id = u.user_id
      LEFT JOIN complaints c
        ON n.complaint_id = c.complaint_id
      ORDER BY n.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;