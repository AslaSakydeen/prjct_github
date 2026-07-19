import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


interface Report {
   complaint_id:number;
  reference_no:string | null;

  title:string;
  description:string;

  category:string;
  priority:string;
  status:string;

  location_name:string | null;

  image_url:string | null;

  complaint_date:string;

  admin_response:string;
  resolution_proof?: string;
  full_name:string;
  email:string;



}



export default function Report(){

const {id}=useParams();
console.log("Report ID:", id);

const navigate=useNavigate();


const [report,setReport]=useState<Report | null>(null);



useEffect(()=>{

getReport();

},[]);



const getReport=async()=>{

try{

const res=await axios.get(

`${import.meta.env.VITE_API_URL}/api/report/${id}`

);


setReport(res.data);


}

catch(error){

console.log(error);

}

};




const printReport=()=>{

window.print();

};



if(!report){

return (

<h2>
Loading Report...
</h2>

);

}



return (

<>


<style>{`

*{

margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial;

}



.report-page{

min-height:100vh;
background:#f4f3ef;
padding:40px;

}



.report-container{

background:white;
max-width:900px;
margin:auto;
padding:35px;
border-radius:15px;

}



h1{

text-align:center;
color:#003b12;
font-size:40px;

}



.subtitle{

text-align:center;
margin:10px 0 30px;

}



.section{
background:#003b12;
color:white;
padding:12px;
border-radius:8px;
margin-top:25px;

}



table{

width:100%;
border-collapse:collapse;
margin-top:15px;

}



td{

border:1px solid #ddd;
padding:12px;

}



td:first-child{

font-weight:bold;
background:#d9e9da;
width:30%;

}



.description{
 
padding:15px;
border-radius:10px;
text-align: left;

}

.page-break {
  page-break-before: always;
}



.complaint-image{

width:300px;
margin-top:30px;
border-radius:10px;

}



.buttons{

display:flex;
justify-content:flex-end;
gap:15px;
margin-top:30px;

}
@media print {

  .buttons {
    display: none !important;
  }

  .report-page {
    padding: 0;
    background: white;
  }

  .report-container {
    box-shadow: none;
    border-radius: 0;
    max-width: 100%;
    width: 100%;
    margin: 0;
    padding: 20px;
  }

  body {
    background: white;
  }

  @page {
    size: A4;
    margin: 15mm;
  }

}


button{

background:#0d5c11;
color:white;
border:none;
padding:12px 25px;
border-radius:8px;
cursor:pointer;

}
.no-image{
 margin-top:20px;


`}</style>





<div className="report-page">


<div className="report-container">



<h1>
Complaint Report
</h1>


<p className="subtitle">

Community Complaint Management System

</p>




<h3 className="section">

Complaint Information

</h3>



<table>

<tbody>


<tr>

<td>
Complaint ID
</td>

<td>
{report.complaint_id}
</td>

</tr>



<tr>

<td>
Reference Number
</td>

<td>
{report.reference_no}
</td>

</tr>



<tr>

<td>
Category
</td>

<td>
{report.category}
</td>

</tr>



<tr>

<td>
Priority
</td>

<td>
{report.priority}
</td>

</tr>



<tr>

<td>
Status
</td>

<td>
{report.status}
</td>

</tr>



<tr>

<td>
Submitted Date
</td>

<td>

{
new Date(
report.complaint_date
)
.toLocaleDateString()

}

</td>

</tr>



</tbody>

</table>







<h3 className="section">

Citizen Information

</h3>



<table>

<tbody>


<tr>

<td>
Name
</td>

<td>
{report.full_name}
</td>

</tr>


<tr>

<td>
Email
</td>

<td>
{report.email}
</td>

</tr>





</tbody>

</table>







<h3 className="section">

Complaint Details

</h3>



<table>

<tbody>


<tr>

<td>
Title
</td>

<td>
{report.title}
</td>

</tr>


<tr>

<td>
Description
</td>

<td>

<div className="description">

{report.description}

</div>

</td>

</tr>



<tr>
  <td>Location</td>
  <td>{report.location_name}</td>
</tr>



</tbody>

</table>







<h3 className="section page-break">

Evidence

</h3>


{report.image_url ? (
  <img
    className="complaint-image"
    src={`${import.meta.env.VITE_API_URL}/uploads/${report.image_url}`}
    alt="Complaint"
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      if (!target.src.includes("prjctgithub-production")) {
        target.src = `https://prjctgithub-production.up.railway.app/uploads/${report.image_url}`;
      }
    }}
  />
) : (
  <p className="no-image">No complaint image available.</p>
)}

{report.status === "Resolved" && report.resolution_proof && (
  <>
    <h3 className="section">Resolution Proof</h3>
    <img
      className="complaint-image"
      src={`${import.meta.env.VITE_API_URL}/uploads/${report.resolution_proof}`}
      alt="Resolution Proof"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (!target.src.includes("prjctgithub-production")) {
          target.src = `https://prjctgithub-production.up.railway.app/uploads/${report.resolution_proof}`;
        }
      }}
    />
  </>
)}

<h3 className="section">

Administrative Response

</h3>

<table>
  <tbody>
    <tr>
      <td>Response Comment</td>
      <td>
        <div className="description">
          {report.admin_response ? report.admin_response : "No response added yet"}
        </div>
      </td>
    </tr>
  </tbody>
</table>


<div className="buttons">


<button onClick={printReport}>

Print / Save PDF

</button>



<button onClick={()=>navigate(-1)}>

Back

</button>


</div>





</div>


</div>



</>

);


}