import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Track() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [reference, setReference] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTrack = () => {
  const referenceNumber = reference.trim();

  if (!referenceNumber) {
    alert("Please enter your reference number");
    return;
  }

  console.log("Navigating to:", referenceNumber); // DEBUG

  navigate(`/track/${encodeURIComponent(referenceNumber)}`);
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
}

// Other
.track-page {
  background: #ffffff;
  min-height: 100vh;
  font-family: "DM Sans", sans-serif;
}

.track-container {
  width: 90%;
  max-width: 1150px;
  margin: auto;
}

/* HERO */

.track-hero {
  background: #083b1f;
  padding: 140px 20px 90px;
  text-align: center;
}

.track-hero h1 {
  color: white;
  font-size: 52px;
  font-weight: 700;
  margin-bottom: 12px;
}

.track-hero p {
  color: #d6d6d6;
  max-width: 650px;
  margin: auto;
  line-height: 1.7;
}

.track-search {
  margin-top: 35px;
  display: flex;
  justify-content: center;
}

.track-search input {
  width: 500px;
  padding: 15px;
  border: none;
  outline: none;
  font-size: 15px;
}

.track-search button {
  background: #0f4f2b;
  color: white;
  border: none;
  padding: 0 28px;
  cursor: pointer;
  font-weight: 600;
}

.track-search button:hover {
  background: #146c3c;
}

.help-text {
  display: block;
  margin-top: 12px;
  color: #b8b8b8;
  font-size: 14px;
}

/* STEPS */

.steps-section {
  padding: 70px 0;
}

.steps-section h2 {
  font-size: 38px;
  margin-bottom: 40px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.step-card {
  background: #dfe9e2;
  padding: 25px;
}

.step-number {
  width: 35px;
  height: 35px;
  background: #083b1f;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border-radius: 5px;
  margin-bottom: 15px;
}

.step-card h3 {
  margin-bottom: 10px;
}

.step-card p {
  color: #555;
  line-height: 1.7;
}

/* STATUS */

.status-section {
  padding-bottom: 80px;
}

.status-section h2 {
  text-align: center;
  font-size: 38px;
}

.status-subtitle {
  text-align: center;
  margin: 15px auto 40px;
  max-width: 700px;
  color: #666;
}

.status-card {
  background: #edf1ee;
  padding: 18px 25px;
  margin-bottom: 15px;
}

.status-card h4 {
  margin-bottom: 8px;
}

/* CTA */

.cta-section {
  background: #dfe9e2;
  padding: 80px 20px;
}

.cta-box {
  max-width: 900px;
  margin: auto;
  background: #083b1f;
  color: white;
  text-align: center;
  padding: 60px;
}

.cta-box h2 {
  font-size: 40px;
  margin-bottom: 15px;
}

.cta-box p {
  color: #d8d8d8;
  margin-bottom: 25px;
}

.cta-box button {
  background: white;
  color: #083b1f;
  border: none;
  padding: 14px 30px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 5px;
}

.cta-box button:hover {
  transform: translateY(-2px);
}

/* MOBILE */

@media (max-width: 768px) {

  .track-hero h1 {
    font-size: 38px;
  }

  .track-search {
    flex-direction: column;
  }

  .track-search input {
    width: 100%;
  }

  .track-search button {
    padding: 15px;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }

  .cta-box {
    padding: 40px 20px;
  }
}

`;

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

      <div className="track-page">

      {/* HERO */}
      <section className="track-hero">
        <div className="track-container">
          <h1>Track Your Complaint</h1>

          <p>
            Stay informed about the progress of your civic reports.
            Enter your unique reference number below to see live updates.
          </p>

          <div className="track-search">
            <input
              type="text"
              placeholder="Enter your reference number"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />

            <button onClick={handleTrack}>
              Track Now ➜
            </button>
          </div>

          <span className="help-text">
            Lost your reference number? Check your confirmation SMS or Email.
          </span>
        </div>
      </section>

      {/* STEPS */}
      <section className="steps-section">
        <div className="track-container">
          <h2>Simple Steps to Track</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Find Reference</h3>

              <p>
                Check the SMS or Email confirmation you received when
                submitting your complaint.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Enter Details</h3>

              <p>
                Type your reference number into the search box above.
                Ensure all characters are entered correctly.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>View Progress</h3>

              <p>
                Instantly see the current status, assigned officer,
                and latest updates for your complaint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATUS */}
      <section className="status-section">
        <div className="track-container">

          <h2>Understanding Status Update</h2>

          <p className="status-subtitle">
            Our system uses standardized stages to keep you informed
            about where your request stands in the administrative process.
          </p>

          <div className="status-card">
            <h4>Pending</h4>
            <p>
              Your complaint has been successfully received and is
              currently in the queue for preliminary screening.
            </p>
          </div>

          <div className="status-card">
            <h4>In Progress</h4>
            <p>
              An officer has been assigned and is actively investigating
              your report.
            </p>
          </div>

          <div className="status-card">
            <h4>Resolved</h4>
            <p>
              Action has been taken and the issue is considered resolved.
              You may review the final resolution notes and provide feedback.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Haven't reported an issue yet?</h2>

          <p>
            Join thousands of citizens helping to improve our community.
            Reporting takes less than 2 minutes.
          </p>

          <button onClick={() => navigate("/complaint")}>
            Report New Complaint
          </button>
        </div>
      </section>

    </div>
    </>
  );
}