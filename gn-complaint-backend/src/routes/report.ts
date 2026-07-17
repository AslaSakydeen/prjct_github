import express, { Request, Response } from "express";
import { pool } from "../db";


const router = express.Router();


// GET SINGLE COMPLAINT REPORT

router.get("/:id", async(req:Request,res:Response)=>{


try{


const complaintId = req.params.id;



const result = await pool.query(

`

SELECT

c.complaint_id,
c.reference_no,
c.title,
c.description,
c.category,
c.priority,
c.status,
c.location_name,
c.image_url,
c.complaint_date,
c.admin_response,


u.full_name,
u.email


FROM complaints c


JOIN users u

ON c.user_id = u.user_id


WHERE c.complaint_id = $1


`,

[complaintId]


);



if(result.rows.length === 0){


return res.status(404).json({

message:"Complaint not found"

});


}



res.json(result.rows[0]);



}

catch (error: any) {
  console.error("REPORT ROUTE ERROR:");
  console.error(error);

  res.status(500).json({
    message: error.message
  });
}



});



export default router;