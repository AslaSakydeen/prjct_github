import express from "express";
import { pool } from "../db";

const router = express.Router();

router.get("/:referenceNumber", async (req, res) => {
  try {
    const { referenceNumber } = req.params;

    const result = await pool.query(
      `
      SELECT
        complaint_id,
        reference_no,
        title,
        description,
        category,
        status,
        complaint_date,
        image_url,
        resolution_proof,
        admin_response
      FROM complaints
      WHERE reference_no = $1
      `,
      [referenceNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;