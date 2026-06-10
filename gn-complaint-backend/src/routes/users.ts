import express, { Request, Response } from "express";
import { pool } from "../db";

const router = express.Router();

/* =========================
   GET ALL USERS
========================= */

router.get("/", async (_req: Request, res: Response) => {
  try {

    const result = await pool.query(`
      SELECT 
        u.user_id,
        u.full_name,
        u.email,
        u.role,
        u.status,

        COUNT(c.complaint_id)::INT AS total_complaints,

        COUNT(
          CASE 
            WHEN c.status = 'Resolved' THEN 1
          END
        )::INT AS resolved,

        COUNT(
          CASE 
            WHEN c.status = 'Pending' THEN 1
          END
        )::INT AS pending

      FROM users u

      LEFT JOIN complaints c
      ON u.user_id = c.user_id

      GROUP BY u.user_id

      ORDER BY u.user_id ASC
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================
   UPDATE USER STATUS
========================= */

router.put("/:id", async (req: Request, res: Response) => {

  try {

    const { status } = req.body;

    await pool.query(
      `
      UPDATE users
      SET status = $1
      WHERE user_id = $2
      `,
      [status, req.params.id]
    );

    res.json({
      message: "User status updated successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================
   DELETE USER
========================= */

router.delete("/:id", async (req: Request, res: Response) => {

  try {

    await pool.query(
      `
      DELETE FROM users
      WHERE user_id = $1
      `,
      [req.params.id]
    );

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;