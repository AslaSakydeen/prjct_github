import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function HowItWorks() {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const steps = [
    {
      number: "1",
      title: "Register",
      desc: "Create a secure account using your official credentials.",
      link: "Learn about security",
    },
    {
      number: "2",
      title: "Report Issue",
      desc: "Document concerns with photos and descriptions.",
      link: "Submission guide",
    },
    
    {
      number: "3",
      title: "Track Progress",
      desc: "Monitor updates through your dashboard.",
      link: "View tracking dashboard",
    },
    {
      number: "4",
      title: "Resolution Proof",
      desc: "Departments upload proof after issue resolution.",
      link: "Verification process",
    },
    {
      number: "5",
      title: "Leave a Review",
      desc: "Share your experience and help improve the system.",
      link: "Rate our services",
    },
  ];

  return (
    <>
      <style>{`
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
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial,sans-serif;
        }

        body{
          background:#f4f5ef;
        }

        .page{
          width:100%;
        }

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
  .nav-center li a:hover, .nav-center li span:hover { color:var(--white); background:var(--green-800); }
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

        /* HERO */

        .hero{
  text-align:center;
  padding-top:150px;
  padding-right:20px;
  padding-bottom:80px;
  padding-left:20px;
}

        .small-title{
          color:#0d5a2d;
          letter-spacing:2px;
          margin-bottom:10px;
        }

        .hero h1{
          font-size:60px;
          color:#0d5a2d;
          margin-bottom:20px;
        }

        .hero p{
          color:#555;
          font-size:18px;
        }

        /* STEPS */

        .steps-grid{
          width:94%;
          margin:auto;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:25px;
          
        }

        .card{
          background:white;
          padding:35px;
          border-radius:18px;
          border:6px solid #052e16;
        }

        .circle{
          width:55px;
          height:55px;
          border-radius:50%;
          background:#0d5a2d;
          color:white;
          display:flex;
          justify-content:center;
          align-items:center;
          font-weight:bold;
          margin-bottom:25px;
        }

        .card h2{
          color:#0d5a2d;
          margin-bottom:15px;
        }

        .card p{
          color:#555;
          line-height:1.7;
          margin-bottom:20px;
        }

        .card a{
          text-decoration:none;
          color:#0d5a2d;
          font-weight:bold;
        }

        /* CTA */

        .cta{
          width:94%;
          margin:80px auto;
          background:#0d5a2d;
          border-radius:25px;
          color:white;
          display:flex;
          justify-content:space-between;
          padding:60px;
          gap:40px;
        }

        .cta-left{
          flex:1;
        }

        .cta-left h2{
          font-size:42px;
          margin-bottom:20px;
        }

        .cta-left p{
          color:#d4d4d4;
          margin-bottom:30px;
          line-height:1.7;
        }

        .cta-left button{
          background:#06361a;
          color:white;
          border:none;
          padding:15px 28px;
          border-radius:12px;
          cursor:pointer;
        }

        .cta-right{
          flex:1;
          background:rgba(255,255,255,0.05);
          padding:40px;
          border-radius:20px;
        }

        .feature{
          margin-bottom:35px;
        }

        .feature h3{
          margin-bottom:10px;
        }

        /* FOOTER */

        .footer{
          background:#00240d;
          color:white;
          display:flex;
          justify-content:space-between;
          padding:60px;
          margin-top:100px;
        }

        .footer h4{
          margin-bottom:20px;
        }

        .footer p{
          color:#ccc;
          margin-bottom:12px;
        }

        .copyright{
          background:#00240d;
          color:#888;
          text-align:center;
          padding-bottom:30px;
        }

        /* RESPONSIVE */

        @media(max-width:900px){

          .steps-grid{
            grid-template-columns:1fr;
          }

          .cta{
            flex-direction:column;
          }

          .footer{
            flex-direction:column;
            gap:40px;
          }

          .navbar{
            flex-direction:column;
            gap:20px;
          }

          .nav-links{
            flex-wrap:wrap;
            justify-content:center;
          }

          .hero h1{
            font-size:40px;
          }
        }

      `}</style>

      <div className="page">

      {/* ── NAVBAR ── */}
      <div className={`nav-wrap${scrolled ? " scrolled" : ""}`}>
        <nav className="navbar">
          <div className="brand" onClick={() => navigate("/")}>
            <div className="brand-mark">CC</div>
            <span className="brand-name">Complaint<span>Core</span></span>
          </div>

          <ul className="nav-center">
            <li><span onClick={() => navigate("/home")}>Home</span></li>
            <li className="active"><a href="#">How it Works</a></li>
            <li><span onClick={() => navigate("/track")}>My Complaints</span></li>
            <li><span onClick={() => navigate("/reviews")}>Reviews</span></li>
            {/* <li><span onClick={() => navigate("/adminDash")}>Admin Dashboard</span></li> */}
          </ul>

          <div className="nav-right">
            {/* ── SUBMIT COMPLAINT BUTTON ── */}
            <button className="btn-nav-submit" onClick={() => navigate("/complaint")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Submit Complaint
            </button>
            <button className="nav-logout" onClick={() => navigate("/")}>Logout</button>
            <div className="avatar">JD</div>
          </div>

          <button className="hamburger" aria-label="Menu">
            <span /><span /><span />
          </button>
        </nav>
      </div>

        {/* HERO */}

        <section className="hero">

          <p className="small-title">
            PROCESS TRANSPARENCY
          </p>

          <h1>How it Works</h1>

          <p>
            Experience a streamlined approach to civic engagement.
          </p>

        </section>

        {/* STEPS */}

        <section className="steps-grid">

          {steps.map((step) => (

            <div className="card" key={step.number}>

              <div className="circle">
                {step.number}
              </div>

              <h2>{step.title}</h2>

              <p>{step.desc}</p>

              <a href="#">
                {step.link} →
              </a>

            </div>

          ))}

        </section>

        {/* CTA */}

        <section className="cta">

          <div className="cta-left">

            <h2>
              Ready to make a difference in your community?
            </h2>

            <p>
              Join thousands of citizens improving neighborhoods
              through ComplaintCore.
            </p>

            <button>
              Start Reporting Now
            </button>

          </div>

          <div className="cta-right">

            <div className="feature">
              <h3>Verified Results</h3>
              <p>Authentic resolution proof for every case.</p>
            </div>

            <div className="feature">
              <h3>Community Growth</h3>
              <p>Building stronger neighborhoods together.</p>
            </div>

            <div className="feature">
              <h3>Rapid Response</h3>
              <p>Faster routing to the correct teams.</p>
            </div>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="footer">

          <div>
            <h2>ComplaintCore</h2>
            <p>
              Dedicated to improving transparency between citizens
              and authorities.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <p>Home</p>
            <p>Track Status</p>
            <p>Resources</p>
          </div>

          <div>
            <h4>Legals</h4>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
            <p>Accessibility</p>
          </div>

          <div>
            <h4>Support</h4>
            <p>Contact Support</p>
            <p>FAQ Center</p>
          </div>

        </footer>

        <div className="copyright">
          © 2024 ComplaintCore Community System.
          All rights reserved.
        </div>

      </div>
    </>
  );
}