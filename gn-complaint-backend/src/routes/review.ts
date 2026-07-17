
import express from "express";
import { pool } from "../db";
import auth from "../middleware/auth";
console.log("Review route loaded"); 

const router = express.Router();
//check if user can review
router.get("/can-review", auth, async (req: any, res) => {
  try {

    console.log("Decoded JWT:", req.user);

    const user_id = req.user.user_id;

    console.log("User ID:", user_id);

    const result = await pool.query(
      `
      SELECT complaint_id, user_id, status
      FROM complaints
      WHERE user_id = $1
      `,
      [user_id]
    );

    console.log("Database Result:", result.rows);

    const canReview = result.rows.some(
      (c) => c.status === "Resolved"
    );

    console.log("Can Review:", canReview);

    res.json({ canReview });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.review_id,
        u.full_name,
        r.rating,
        r.review_text,
        r.admin_reply,
        r.created_at
      FROM reviews r
      INNER JOIN users u
      ON r.user_id = u.user_id
      ORDER BY r.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Add review
router.post("/", auth, async (req:any, res) => {

  try {

    const user_id = req.user.user_id;

    const {
      rating,
      review_text
    } = req.body;
// Check if the user has a resolved complaint
    const resolvedComplaint = await pool.query(
    `SELECT complaint_id
     FROM complaints
     WHERE user_id = $1
     AND status='Resolved'
     LIMIT 1`,
    [req.user.user_id]
);

if (resolvedComplaint.rows.length === 0) {
    return res.status(403).json({
        message: "You can review only after a complaint is resolved."
    });
}
    const result = await pool.query(
      `
      INSERT INTO reviews
      (user_id, rating, review_text)
      VALUES($1,$2,$3)
      RETURNING *
      `,
      [
        user_id,
        rating,
        review_text
      ]
    );


    res.status(201).json(result.rows[0]);


  } catch(err) {

    console.error(err);

    res.status(500).json({
      message:"Server Error"
    });

  }

});


// Admin Reply to Review


router.put("/:id", async (req, res) => {

  try {

    const { admin_reply } = req.body;

    await pool.query(
      `
      UPDATE reviews
      SET admin_reply = $1
      WHERE review_id = $2
      `,
      [
        admin_reply,
        req.params.id
      ]
    );

    res.json({
      message: "Reply added successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

});

// ======================================
// Delete Review
// ======================================

router.delete("/:id", async (req, res) => {

  try {

    await pool.query(
      `
      DELETE FROM reviews
      WHERE review_id = $1
      `,
      [req.params.id]
    );

    res.json({
      message: "Review deleted successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

});

export default router;