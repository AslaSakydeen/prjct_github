import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Review {
  review_id: number;
  user_id: number;
  full_name: string;
  rating: number;
  review_text: string;
  admin_reply: string;
  created_at: string;
}

export default function ManageReview() {

  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([]);

  const [search] = useState("");

  const [selectedReview, setSelectedReview] =
    useState<Review | null>(null);

  const [reply, setReply] = useState("");

  const [showReplyModal, setShowReplyModal] =
    useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {

    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/review`
      );

      setReviews(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  const filteredReviews = reviews.filter((review) => {

    return (

      review.full_name
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      review.review_text
        .toLowerCase()
        .includes(search.toLowerCase())

    );

  });

  const openReplyModal = (review: Review) => {

    setSelectedReview(review);

    setReply(review.admin_reply || "");

    setShowReplyModal(true);

  };

  const closeModal = () => {

    setSelectedReview(null);

    setShowReplyModal(false);

    setShowDeleteConfirm(false);

  };
// SAVE REPLY
const handleReply = async () => {

  if (!selectedReview) return;

  try {

    await axios.put(

      `${import.meta.env.VITE_API_URL}/api/review/${selectedReview.review_id}`,

      {
        admin_reply: reply
      }

    );

    alert("Reply Saved Successfully");

    fetchReviews();

    closeModal();

  } catch (err) {

    console.log(err);

    alert("Failed to save reply");

  }

};

// DELETE REVIEW
const handleDelete = async () => {

  if (!selectedReview) return;

  try {

    await axios.delete(

      `${import.meta.env.VITE_API_URL}/api/review/${selectedReview.review_id}`

    );

    alert("Review Deleted Successfully");

    fetchReviews();

    closeModal();

  } catch (err) {

    console.log(err);

    alert("Delete Failed");

  }

};
  return (

    <>

      <style>

{`

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:Arial, Helvetica, sans-serif;
}

.manage-page{
display:flex;
min-height:100vh;
background:#f4f3ef;
}

.sidebar{
width:250px;
background:#003b12;
color:white;
padding:30px 20px;
}

.sidebar h1{
font-size:34px;
margin-bottom:5px;
}

.sidebar p{
margin-bottom:50px;
}

.sidebar ul{
list-style:none;
}

.sidebar ul li{
padding:14px 18px;
margin-bottom:18px;
border-radius:10px;
cursor:pointer;
font-size:18px;
}

.sidebar ul li.active{
background:#1d8b24;
}

.main-content{
flex:1;
padding:40px;
}

.main-content h1{
font-size:50px;
color:#083d14;
margin-bottom:10px;
}

.subtitle{
font-size:18px;
margin-bottom:30px;
color:#2d512f;
}

.stats-card{
width:220px;
background:white;
padding:20px;
border-radius:15px;
margin-bottom:25px;
box-shadow:0 2px 8px rgba(0,0,0,.1);
}

.stats-card h3{
color:#0d5c11;
margin-bottom:10px;
}

.stats-card h1{
font-size:45px;
margin:0;
}

.search-box{
background:white;
padding:20px;
border-radius:15px;
margin-bottom:25px;
}

.search-box input{
width:100%;
padding:14px;
border-radius:10px;
border:1px solid #ccc;
font-size:16px;
}

.table-container{
background:white;
padding:20px;
border-radius:15px;
overflow-x:auto;
}

table{
width:100%;
border-collapse:collapse;
}

th{
background:#d9e9da;
padding:15px;
text-align:left;
}

td{
padding:15px;
border-bottom:1px solid #ddd;
}

.reply-btn{
background:#0d5c11;
color:white;
border:none;
padding:8px 18px;
border-radius:8px;
cursor:pointer;
margin-right:10px;
}

.delete-btn{
background:#d9534f;
color:white;
border:none;
padding:8px 18px;
border-radius:8px;
cursor:pointer;
}

/* MODAL */

.modal-overlay{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,.45);
display:flex;
justify-content:center;
align-items:center;
z-index:1000;
}

.modal-box{
width:650px;
background:#eef2ee;
padding:30px;
border-radius:15px;
}

.modal-box h2{
margin-bottom:25px;
color:#0d5c11;
}

.review-details{
display:flex;
flex-direction:column;
gap:12px;
}

.review-details label{
font-weight:bold;
color:#0d5c11;
}

.review-details input,
.review-details textarea{
padding:12px;
border:1px solid #ccc;
border-radius:8px;
font-size:15px;
}

.review-text{
height:120px;
resize:none;
background:#fff;
}

.reply-text{
height:140px;
resize:none;
}

.button-group{
display:flex;
justify-content:flex-end;
gap:15px;
margin-top:25px;
}

.cancel-btn{
background:#d9d9d9;
border:none;
padding:10px 25px;
border-radius:8px;
cursor:pointer;
}

.save-btn{
background:#0d5c11;
color:white;
border:none;
padding:10px 25px;
border-radius:8px;
cursor:pointer;
}

.confirm-overlay{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,.45);
display:flex;
justify-content:center;
align-items:center;
z-index:1500;
}

.confirm-box{
width:420px;
background:white;
padding:30px;
border-radius:15px;
text-align:center;
}

.confirm-buttons{
display:flex;
justify-content:center;
gap:20px;
margin-top:25px;
}

.confirm-cancel{
background:#0d7a24;
color:white;
border:none;
padding:10px 25px;
border-radius:8px;
cursor:pointer;
}

.confirm-delete{
background:#d9534f;
color:white;
border:none;
padding:10px 25px;
border-radius:8px;
cursor:pointer;
}

`}

      </style>

<div className="manage-page">

<div className="sidebar">

<h1>Complaint Core</h1>

<p>Administration Panel</p>

<ul>

<li onClick={()=>navigate("/adminDash")}>
Dashboard
</li>

<li onClick={()=>navigate("/manageUser")}>
Manage Users
</li>

<li onClick={()=>navigate("/manageComplaint")}>
Manage Complaint
</li>

<li className="active">
Manage Review
</li>

<li onClick={() => navigate("/hotspot")}>
🗺️ Hotspot Map
</li>

<li>
Notification
</li>

<li>
Settings
</li>

<li onClick={() => {
  localStorage.removeItem("token");
  navigate("/");
}}>
Logout
</li>

</ul>

</div>

<div className="main-content">

<h1>

Manage

<br/>

Reviews

</h1>

<p className="subtitle">

Manage customer ratings and reviews.

</p>

<div className="stats-card">

<h3>Total Reviews</h3>

<h1>{reviews.length}</h1>

</div>



<div className="table-container">

<table>

<thead>

<tr>

<th>User</th>

<th>Rating</th>

<th>Review</th>

<th>Date</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{filteredReviews.map((review)=>(

<tr key={review.review_id}>

<td>

{review.full_name}

</td>

<td>

{"⭐".repeat(review.rating)}

</td>

<td>

{review.review_text}

</td>

<td>

{new Date(review.created_at).toLocaleDateString()}

</td>

<td>

<button

className="reply-btn"

onClick={()=>openReplyModal(review)}

>

Reply

</button>

<button

className="delete-btn"

onClick={()=>{

setSelectedReview(review);

setShowDeleteConfirm(true);

}}

>

Delete

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

{/* ===========================
      REPLY MODAL
=========================== */}

{showReplyModal && selectedReview && (

<div className="modal-overlay">

<div className="modal-box">

<h2>Reply to Review</h2>

<div className="review-details">

<label>User</label>

<input
type="text"
value={selectedReview.full_name}
readOnly
/>

<label>Rating</label>

<input
type="text"
value={"⭐".repeat(selectedReview.rating)}
readOnly
/>

<label>Review</label>

<textarea
className="review-text"
value={selectedReview.review_text}
readOnly
/>

<label>Admin Reply</label>

<textarea

className="reply-text"

placeholder="Write your reply..."

value={reply}

onChange={(e)=>setReply(e.target.value)}

/>

</div>

<div className="button-group">

<button

className="cancel-btn"

onClick={closeModal}

>

Cancel

</button>

<button

className="save-btn"

onClick={handleReply}

>

Send Reply

</button>

</div>

</div>

</div>

)}

{/* ===========================
      DELETE CONFIRM
=========================== */}

{showDeleteConfirm && (

<div className="confirm-overlay">

<div className="confirm-box">

<h3>

Are you sure you want to

delete this review?

</h3>

<div className="confirm-buttons">

<button

className="confirm-cancel"

onClick={()=>setShowDeleteConfirm(false)}

>

Cancel

</button>

<button

className="confirm-delete"

onClick={handleDelete}

>

Confirm

</button>

</div>

</div>

</div>

)}

</>

);

}