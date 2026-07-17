  import express, { Request, Response } from "express";
  import { pool } from "../db";
  import multer from "multer";
  import path from "path";
  import auth from "../middleware/auth";
  import { sendEmail } from "../utils/sendEmail";

  const router = express.Router();

  // Generate Complaint Reference Number
  const generateReferenceNumber = (): string => {
    const date = new Date();

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const random = Math.floor(1000 + Math.random() * 9000);

    return `CMP-${yyyy}${mm}${dd}-${random}`;
  };


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
  // DELETE COMPLAINT
  router.delete("/complaints/:id", async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query(
        "DELETE FROM complaints WHERE complaint_id = $1",
        [id]
      );

      res.json({ message: "Complaint deleted successfully" });

    } catch (error) {
      console.log("DELETE ERROR:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
router.put(
  "/complaints/:id",
  upload.single("resolutionProof"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { status, admin_response } = req.body;

      const file = req.file as Express.Multer.File;

      const resolution_proof = file
        ? file.filename
        : null;

      const result = await pool.query(
        `
        UPDATE complaints
        SET
          status = $1,
          admin_response = $2,
          resolution_proof =
            COALESCE($3, resolution_proof)
        WHERE complaint_id = $4
        RETURNING *
        `,
        [
          status,
          admin_response,
          resolution_proof,
          id,
        ]
      );

const complaintInfo = await pool.query(
`
SELECT
u.user_id,
u.full_name,
u.email,
c.complaint_id,
c.reference_no,
c.title

FROM complaints c

JOIN users u
ON c.user_id = u.user_id

WHERE c.complaint_id = $1
`,
[id]
);

if (complaintInfo.rows.length > 0) {

  const user = complaintInfo.rows[0];

  await sendEmail(
    user.email,

    "Complaint Status Updated",

    `
    <div style="font-family:Arial;padding:20px">

      <h2>Complaint Updated</h2>

      <p>Hello <b>${user.full_name}</b>,</p>

      <p>Your complaint has been updated.</p>

      <table border="1" cellpadding="8">

        <tr>
          <td><b>Reference Number</b></td>
          <td>${user.reference_no}</td>
        </tr>

        <tr>
          <td><b>Title</b></td>
          <td>${user.title}</td>
        </tr>

        <tr>
          <td><b>Status</b></td>
          <td>${status}</td>
        </tr>

        <tr>
          <td><b>Officer Response</b></td>
          <td>${admin_response || "No response"}</td>
        </tr>

      </table>

      <br>

      <p>
      Thank you.
      </p>

    </div>
    `
  );

  router.put("/:id/priority", async (req, res) => {
    const { id } = req.params;
    const { priority } = req.body;

    try {
        await pool.query(
            `UPDATE complaints
             SET priority=$1
             WHERE complaint_id=$2`,
            [priority, id]
        );

        res.json({
            message: "Priority updated"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
//save notifications to database
  await pool.query(
  `
  INSERT INTO notifications
  (user_id, complaint_id, title, message)
  VALUES ($1, $2, $3, $4)
  `,
  [
    user.user_id,
    user.complaint_id,
    "Complaint Updated",
    `Your complaint "${user.title}" has been updated to "${status}". ${
      admin_response ? "Response: " + admin_response : ""
    }`
  ]
);
}

      res.json({
        success: true,
        complaint: result.rows[0],
      });

    } catch (error) {
      console.log("UPDATE ERROR:", error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

  // ADD COMPLAINT
  router.post(
    "/complaints",
    auth,
    upload.single("image"),
    async (req: any, res: Response) => {
      
      try {
        const referenceNo = generateReferenceNumber();

        const {
          category,
          title,
          description,
          latitude,
          longitude,
          location_name,
          phone,
        } = req.body;

        console.log("Authorization:", req.headers.authorization);
        console.log("req.user =", req.user);
        console.log("user_id =", req.user?.id);


        const user_id = req.user.user_id;
        console.log("user_id =", user_id);

        // TypeScript fix
        const file = req.file as Express.Multer.File;

        const image_url = file ? file.filename : null;

        const newComplaint = await pool.query(
          `
          INSERT INTO complaints
          (reference_no, user_id, category, title, description, latitude, longitude, location_name, phone, image_url)
          
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
          
          RETURNING *
          `,
          [
            referenceNo,
            user_id,
            category,
            title,
            description,
            latitude,
            longitude,
            location_name,
            phone,
            image_url,
          ]
        );


        await pool.query(
  `
  INSERT INTO notifications
  (user_id, complaint_id, title, message)
  VALUES ($1, $2, $3, $4)
  `,
  [
    user_id,
    newComplaint.rows[0].complaint_id,
    "Complaint Submitted",
    `Your complaint "${title}" has been submitted successfully. Reference Number: ${referenceNo}.`
  ]
);


        // Get user's full name
        const userResult = await pool.query(
          `
          SELECT full_name, email
          FROM users
          WHERE user_id = $1
          `,
          [user_id]
        );

        console.log("====================================");
console.log("User Query Result:", userResult.rows);

if (userResult.rows.length === 0) {
  console.log("❌ No user found for user_id:", user_id);
} else {
  console.log("✅ User Name:", userResult.rows[0].full_name);
  console.log("✅ User Email:", userResult.rows[0].email);
}
console.log("====================================");


console.log("📧 About to send email...");

        //email
await sendEmail(
  userResult.rows[0].email,
  "Complaint Submitted Successfully",

  `
  <div style="font-family:Arial;padding:20px">

      <h2>Complaint Submitted Successfully</h2>

      <p>Hello <b>${userResult.rows[0].full_name}</b>,</p>

      <p>Your complaint has been received.</p>

      <p><b>Reference Number:</b> ${referenceNo}</p>

      <p><b>Category:</b> ${category}</p>

     

      <p><b>Status:</b> Pending</p>

      <hr>

      <p>
      Thank you for using the GN Complaint Management System.
      </p>

  </div>
  `
);
  console.log("✅ sendEmail() finished");


        // Return data needed for success popup
        res.status(201).json({
          success: true,
          complaintId: newComplaint.rows[0].complaint_id,
          referenceNo: newComplaint.rows[0].reference_no,
          userName: userResult.rows[0]?.full_name,
        });
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