


export default function HowItWorks() {
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

        /* NAVBAR */

        .navbar{
          width:90%;
          margin:20px auto;
          background:white;
          border-radius:50px;
          padding:18px 30px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .logo{
          color:#0d5a2d;
        }

        .nav-links{
          display:flex;
          gap:25px;
        }

        .nav-links a{
          text-decoration:none;
          color:#333;
        }

        .active{
          color:#0d5a2d;
          font-weight:bold;
        }

        .submit-btn{
          background:#0d5a2d;
          color:white;
          border:none;
          padding:12px 22px;
          border-radius:30px;
          cursor:pointer;
        }

        /* HERO */

        .hero{
          text-align:center;
          padding:80px 20px;
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

        {/* NAVBAR */}

        <nav className="navbar">

          <h2 className="logo">ComplaintCore</h2>

          <div className="nav-links">
            <a href="/home">Home</a>
            <a href="#" className="active">How It Works</a>
            <a href="#">My Complaints</a>
            <a href="/reviews">Review</a>
            <a href="#">Contact</a>
          </div>

          <button className="submit-btn">
            Submit Complaint
          </button>

        </nav>

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