import express, { Request, Response } from "express";
import { pool } from "../db";
import multer from "multer";
import path from "path";
import auth from "../middleware/auth";

const router = express.Router();


// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: Function
  ) => {
    cb(null, "uploads/");
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: Function
  ) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


// GET ALL COMPLAINTS
router.get("/complaints", async (req: Request, res: Response) => {
  try {
    const data = await pool.query("SELECT * FROM complaints");

    res.json(data.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


// ADD COMPLAINT
router.post(
  "/complaints",
  auth,
  upload.single("image"),
  async (req: any, res: Response) => {
    try {
      const {
        category,
        priority,
        title,
        description,
        location,
        phone,
      } = req.body;
      const user_id = req.user.id;

      // TypeScript fix
      const file = req.file as Express.Multer.File;

      const image_url = file ? file.filename : null;

      const newComplaint = await pool.query(
        `
        INSERT INTO complaints
        (user_id, category, priority, title, description, location, phone, image_url)
        
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        
        RETURNING *
        `,
        [
          user_id,
          category,
          priority,
          title,
          description,
          location,
          phone,
          image_url,
        ]
      );

      res.json(newComplaint.rows[0]);
    } catch (error: any) {

  console.error("FULL BACKEND ERROR:");
  console.error(error);

  res.status(500).json({
    message: error.message,
  });
}
  }
);

export default router;