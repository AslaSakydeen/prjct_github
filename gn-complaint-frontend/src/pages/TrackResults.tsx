import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


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
}

.result-page {
  background: #eef3ef;
  min-height: 100vh;
  padding: 40px;
}

.details-card {
  max-width: 1000px;
  margin: auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.status-row h2 {
  color: #0d4b2a;
}

.status-badge {
  padding: 8px 20px;
  border-radius: 4px;
  color: white;
  font-weight: 600;
}

.status-badge.pending {
  background: #d97706;
}

.status-badge.inprogress {
  background: #0d4b2a;
}

.status-badge.resolved {
  background: #0d4b2a;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
}

textarea {
  resize: none;
  min-height: 90px;
}

.full-width {
  margin-top: 20px;
}

.image-row {
  display: flex;
  gap: 20px;
  margin-top: 25px;
}

.image-row > div {
  flex: 1;
}

.preview {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.update-box {
  margin-top: 25px;
}

.update-box textarea {
  min-height: 120px;
  background: #eef3ef;
}

.btn-area {
  text-align: right;
  margin-top: 20px;
}

.btn-area button {
  background: #0d4b2a;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}  

`;


//result page
interface Complaint {
  complaint_id: number;
  reference_no: string;
  title: string;
  description: string;
  category: string;
  status: string;
  complaint_date: string;
  image_url: string;
  resolution_proof: string | null;
  admin_response: string | null;
}

export default function TrackResult() {
  const { referenceNumber } = useParams();

  const navigate = useNavigate();

  const [complaint, setComplaint] = useState<Complaint | null>(null);

  
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/track/${referenceNumber}`
    )
      .then((res) => res.json())
      .then((data) => setComplaint(data))
      .catch((err) => console.log(err));
  }, [referenceNumber]);

  if (!complaint) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }
  return (
    <>
      <style>{styles}</style>

      

      
       <div className="result-page">

      <div className="details-card">

        <div className="status-row">
          <h2>Complaint Details</h2>

          <span
            className={`status-badge ${
              complaint.status.toLowerCase()
            }`}
          >
            {complaint.status}
          </span>
        </div>

        <div className="form-grid">

          <div>
            <label>Complaint ID</label>
            <input
              value={complaint.reference_no}
              readOnly
            />
          </div>

          <div>
            <label>Submitted Date</label>
            <input
              value={new Date(
                complaint.complaint_date
              ).toLocaleDateString()}
              readOnly
            />
          </div>

          <div>
            <label>Complaint Title</label>
            <input
              value={complaint.title}
              readOnly
            />
          </div>

          <div>
            <label>Category</label>
            <input
              value={complaint.category}
              readOnly
            />
          </div>

        </div>

        <div className="full-width">
          <label>Description</label>

          <textarea
            value={complaint.description}
            readOnly
          />
        </div>

        <div className="image-row">

          <div>
            <label>Uploaded Image</label>

           <img
  src={`${import.meta.env.VITE_API_URL}/uploads/${complaint.image_url}`}
  alt=""
  className="preview"
/>
          </div>

          {complaint.status === "Resolved" &&
            complaint.resolution_proof && (
              <div>
                <label>Resolution Proof</label>

                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${complaint.resolution_proof}`}
                  alt=""
                  className="preview"
                />
              </div>
            )}

        </div>

        <div className="update-box">
          <label>Latest Work Update</label>

          <textarea
            value={complaint.admin_response || ""}
            readOnly
          />
        </div>

        <div className="btn-area">
          <button
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>

      </div>

    </div>
  
    </>
  );
}
