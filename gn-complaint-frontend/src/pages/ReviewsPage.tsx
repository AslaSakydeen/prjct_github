import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

 


interface Review {
  review_id: number;
  full_name: string;
  rating: number;
  review_text: string;
  admin_reply: string | null;
  created_at: string;
}

export default function Reviews() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  
  const [review_text, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    loadReviews();
    checkCanReview();
  }, []);

  const loadReviews = async () => {
  try {
    const res = await fetch("https://prjctgithub-production.up.railway.app/api/review");

    console.log("Status:", res.status);
    console.log("Type:", res.headers.get("content-type"));

    const data = await res.json();

    setReviews(data);

  } catch (error) {
    console.error("Loading reviews failed:", error);
  }
};
  const checkCanReview = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://prjctgithub-production.up.railway.app/api/review/can-review",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    setCanReview(data.canReview);

  } catch (err) {

    console.error(err);

  }

};
  const submitReview = async () => {

  if (review_text === "") {
    alert("Enter review");
    return;
  }

  const token = localStorage.getItem("token");

  const res = await fetch(
    "https://prjctgithub-production.up.railway.app/api/review",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        rating,
        review_text
      })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  alert("Review submitted successfully.");

  setReviewText("");
  setRating(5);

  loadReviews();

};
  const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green-950: #052e16;
    --green-900: #14532d;
    --green-800: #166534;
    --green-700: #15803d;
    --green-600: #16a34a;
    --green-500: #22c55e;
    --green-400: #4ade80;
    --green-100: #dcfce7;
    --green-50:  #f0fdf4;
    --sand:      #faf8f3;
    --ink:       #0c1a0e;
    --ink-soft:  #374151;
    --ink-muted: #6b7280;
    --white:     #ffffff;
    --accent:    #f59e0b;
    --accent-lt: #fef3c7;
    --radius:    16px;
    --radius-lg: 28px;
    --shadow-sm: 0 2px 8px rgba(21,128,61,0.08);
    --shadow-md: 0 8px 32px rgba(21,128,61,0.12);
    --shadow-lg: 0 24px 60px rgba(21,128,61,0.16);
  }

  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: var(--sand); color: var(--ink); overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--green-50); }
  ::-webkit-scrollbar-thumb { background: var(--green-500); border-radius: 6px; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
  @keyframes pulse-ring { 0% { transform:scale(1); opacity:0.6; } 100% { transform:scale(1.6); opacity:0; } }
  @keyframes countUp { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }

  /* NAV */
  .nav-wrap { position:fixed; top:0; left:0; right:0; z-index:200; padding:14px 24px; transition:all 0.3s; }
  .nav-wrap.scrolled .navbar { box-shadow:var(--shadow-md); background:rgba(255,255,255,0.97); }
  .navbar {
    max-width:1200px; margin:0 auto;
    background:rgba(255,255,255,0.92); backdrop-filter:blur(20px);
    border-radius:20px; padding:14px 28px;
    display:flex; align-items:center; justify-content:space-between;
    border:1px solid rgba(21,128,61,0.1); transition:all 0.3s;
  }
  .brand { display:flex; align-items:center; gap:12px; text-decoration:none; cursor:pointer; }
  .brand-mark {
    width:44px; height:44px;
    background:linear-gradient(135deg,var(--green-800),var(--green-600));
    border-radius:13px; display:flex; align-items:center; justify-content:center;
    font-family:'Playfair Display',serif; font-weight:800; font-size:18px; color:white;
    box-shadow:0 4px 14px rgba(21,128,61,0.35); position:relative; overflow:hidden;
  }
  .brand-mark::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent); }
  .brand-name { font-family:'DM Sans',sans-serif; font-weight:700; font-size:1.15rem; color:var(--ink); letter-spacing:-0.02em; }
  .brand-name span { color:var(--green-700); }
  .nav-center { display:flex; align-items:center; gap:4px; list-style:none; }
  .nav-center li a, .nav-center li span {
    display:block; padding:8px 16px; font-size:0.875rem; font-weight:500;
    color:var(--ink-soft); text-decoration:none; border-radius:10px;
    cursor:pointer; transition:all 0.2s; white-space:nowrap;
  }
  .nav-center li a:hover, .nav-center li span:hover { color:var(--green-700); background:var(--green-50); }
  .nav-center li.active a { background:var(--green-800); color:white; font-weight:600; }
  .nav-right { display:flex; align-items:center; gap:10px; }
  .btn-nav-submit {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 20px;
    background:linear-gradient(135deg,var(--green-800),var(--green-600));
    color:white; font-family:inherit; font-size:0.875rem; font-weight:600;
    border:none; border-radius:10px; cursor:pointer;
    box-shadow:0 4px 14px rgba(21,128,61,0.28); transition:all 0.25s;
  }
  .btn-nav-submit:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(21,128,61,0.36); }
  .btn-nav-submit svg { width:15px; height:15px; }
  .nav-logout {
    padding:8px 18px; font-size:0.875rem; font-weight:500;
    color:var(--ink-soft); background:none;
    border:1.5px solid rgba(0,0,0,0.12); border-radius:10px;
    cursor:pointer; transition:all 0.2s; font-family:inherit;
  }
  .nav-logout:hover { border-color:var(--green-600); color:var(--green-700); background:var(--green-50); }
  .avatar {
    width:40px; height:40px;
    background:linear-gradient(135deg,var(--green-100),#bbf7d0);
    border:2px solid #bbf7d0; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:border-color 0.2s; font-size:0.75rem;
    font-weight:700; color:var(--green-800);
  }
  .avatar:hover { border-color:var(--green-500); }
  .hamburger { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:4px; }
  .hamburger span { display:block; width:22px; height:2px; background:var(--ink); border-radius:2px; transition:all 0.3s; }

  /* ===========================
   REVIEW PAGE
=========================== */

.review-page{
  max-width:1100px;
  margin:140px auto 60px;
  padding:20px;
}

.review-page h1{
  text-align:center;
  font-family:'Playfair Display',serif;
  font-size:2.5rem;
  color:var(--green-900);
  margin-bottom:35px;
}

/* ===========================
   REVIEW FORM
=========================== */

.review-form{
  background:rgba(255,255,255,0.92);
  backdrop-filter:blur(20px);
  border:1px solid rgba(21,128,61,0.12);
  border-radius:22px;
  padding:30px;
  box-shadow:var(--shadow-md);

  display:flex;
  flex-direction:column;
  gap:18px;

  animation:fadeUp .6s ease;
}

.review-form input,
.review-form select,
.review-form textarea{
  width:100%;
  padding:14px 16px;
  border:1px solid #d1d5db;
  border-radius:12px;
  font-family:'DM Sans',sans-serif;
  font-size:15px;
  background:#fff;
  transition:.3s;
  outline:none;
}

.review-form textarea{
  min-height:140px;
  resize:vertical;
}

.review-form input:focus,
.review-form select:focus,
.review-form textarea:focus{
  border-color:var(--green-500);
  box-shadow:0 0 0 4px rgba(34,197,94,.15);
}

.review-form button{
  align-self:flex-start;
  padding:13px 28px;
  border:none;
  border-radius:12px;
  cursor:pointer;
  font-size:15px;
  font-weight:600;
  color:#fff;
  background:linear-gradient(135deg,var(--green-800),var(--green-600));
  box-shadow:0 6px 18px rgba(21,128,61,.25);
  transition:.3s;
}

.review-form button:hover{
  transform:translateY(-3px);
  box-shadow:0 12px 25px rgba(21,128,61,.35);
}

/* ===========================
   REVIEW LIST
=========================== */

.review-list{
  margin-top:45px;

  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
  gap:25px;
}

.review-card{
  background:rgba(255,255,255,.94);
  backdrop-filter:blur(18px);
  border:1px solid rgba(21,128,61,.12);
  border-radius:20px;
  padding:24px;
  box-shadow:var(--shadow-sm);
  transition:.3s;
  animation:fadeUp .5s ease;
}

.review-card:hover{
  transform:translateY(-6px);
  box-shadow:var(--shadow-lg);
}

.review-card h3{
  font-size:1.15rem;
  color:var(--green-900);
  margin-bottom:8px;
}

.review-card .stars{
  font-size:1.1rem;
  margin-bottom:12px;
  color:var(--accent);
}

.review-card p{
  color:var(--ink-soft);
  line-height:1.7;
  font-size:15px;
}

.review-card span{
  display:block;
  margin-top:18px;
  font-size:.85rem;
  color:var(--ink-muted);
}

/* ===========================
   RESPONSIVE
=========================== */

@media (max-width:768px){

.review-page{
  margin-top:120px;
  padding:15px;
}

.review-page h1{
  font-size:2rem;
}

.review-form{
  padding:22px;
}

.review-list{
  grid-template-columns:1fr;
}

.review-form button{
  width:100%;
}
.admin-reply{

margin-top:25px;

padding:15px;

background:#eef9ef;

border-left:5px solid #0d5c11;

border-radius:10px;

}

.admin-reply h4{

color:#0d5c11;

margin-bottom:8px;

font-size:16px;

}

.admin-reply p{

margin:0;

color:#444;

line-height:1.6;

}
.review-card > p:first-of-type{
  margin-bottom:20px;
}
  .user-review{
  margin-bottom:20px;
}

}`;

  return (
    <>
      <style>{styles}</style>

      <div className={`nav-wrap ${scrolled ? "scrolled" : ""}`}>
        <nav className="navbar">
          
          {/* BRAND */}
          <div className="brand" onClick={() => navigate("/")}>
            <div className="brand-mark">CC</div>
            <span className="brand-name">
              Complaint<span>Core</span>
            </span>
          </div>

          {/* MENU */}
          <ul className="nav-center">
            <li className="active"><a href="#">Home</a></li>

            <li>
              <span onClick={() => navigate("/how")}>How it Works</span>
            </li>

            <li>
              <span onClick={() => navigate("/complaints")}>
                My Complaints
              </span>
            </li>

            <li>
              <span onClick={() => navigate("/reviews")}>Reviews</span>
            </li>
          </ul>

          {/* RIGHT */}
          <div className="nav-right">
            <button
              className="btn-nav-submit"
              onClick={() => navigate("/complaint")}
            >
              + Submit Complaint
            </button>

            <button className="nav-logout" onClick={() => navigate("/")}>
              Logout
            </button>

            <div className="avatar">JD</div>
          </div>

          {/* MOBILE */}
          <button className="hamburger">
            <span />
            <span />
            <span />
          </button>

        </nav>
      </div>

<div className="review-page">

<h1>⭐ Customer Reviews</h1>

{canReview ? (

<div className="review-form">

<select
value={rating}
onChange={(e)=>setRating(Number(e.target.value))}
>

<option value={5}>★★★★★</option>
<option value={4}>★★★★☆</option>
<option value={3}>★★★☆☆</option>
<option value={2}>★★☆☆☆</option>
<option value={1}>★☆☆☆☆</option>

</select>

<textarea
placeholder="Write your review..."
value={review_text}
onChange={(e)=>setReviewText(e.target.value)}
/>

<button onClick={submitReview}>
Submit Review
</button>

</div>

) : (

<div className="review-form">

<h3 style={{ color: "#166534" }}>
Review Not Available
</h3>

<p style={{ lineHeight: "1.7" }}>
You can submit a review only after one of your complaints has been marked as <strong>Resolved</strong> by the administrator.
</p>

</div>

)}

<div className="review-list">

{reviews.map((review)=>(

<div
key={review.review_id}
className="review-card"
>

<h3>{review.full_name || "Anonymous"}</h3>

<p className="stars">

{"⭐".repeat(review.rating)}

</p>

<p className="user-review">
  {review.review_text}
</p>

{review.admin_reply && (

<div className="admin-reply">

<h4>Admin Reply</h4>

<p>{review.admin_reply}</p>

</div>

)}

<span>

{new Date(review.created_at).toLocaleDateString()}

</span>

</div>

))}

</div>

</div>

  

    </>
  );
}
