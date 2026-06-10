import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

 const handleRegister = async () => {

  // validations
  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  if (!email.includes("@")) {
    alert("Enter valid email");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters");
    return;
  }

  try {

    await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name,
        email,
        password,
      }
    );

    alert("Registered successfully");

    navigate("/");

  } catch (err: any) {

    console.log(err);

    if (err.response) {
      alert(err.response.data.message);
    } else {
      alert("Registration failed");
    }
  }
};
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          background: #f7faf7;
        }

        /* ── LEFT PANEL ── */
        .reg-left {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          order: 1;
        }
        .reg-card {
          width: 100%;
          max-width: 440px;
        }
        .reg-card-header {
          margin-bottom: 32px;
        }
        .reg-card-header h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 30px;
          color: #0f1f0f;
          letter-spacing: -0.4px;
          margin-bottom: 6px;
        }
        .reg-card-header p {
          font-size: 14px;
          color: #7a8a7a;
          line-height: 1.5;
        }

        /* steps indicator */
        .steps {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 32px;
        }
        .step {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .step-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .step-dot.done   { background: #1a6b3c; color: #fff; }
        .step-dot.active { background: #1a6b3c; color: #fff; box-shadow: 0 0 0 4px rgba(26,107,60,0.15); }
        .step-dot.idle   { background: #e8f0e8; color: #8fa08f; }
        .step-label {
          font-size: 12px;
          font-weight: 600;
          color: #7a8a7a;
        }
        .step-label.active { color: #1a6b3c; }
        .step-line {
          flex: 1;
          height: 1.5px;
          background: #d4e0d4;
          margin: 0 10px;
        }

        /* form */
        .form-group {
          margin-bottom: 18px;
          position: relative;
        }
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #2d3a2d;
          margin-bottom: 7px;
          letter-spacing: 0.01em;
        }
        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: #b0c0b0;
          display: flex;
          align-items: center;
          pointer-events: none;
          transition: color 0.18s;
        }
        .form-input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          border: 1.5px solid #d4e0d4;
          border-radius: 8px;
          font-size: 14.5px;
          font-family: 'DM Sans', sans-serif;
          color: #0f1f0f;
          background: #ffffff;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .form-input::placeholder { color: #b0c0b0; }
        .form-input:focus {
          border-color: #1a6b3c;
          box-shadow: 0 0 0 3.5px rgba(26,107,60,0.11);
        }
        .form-input:focus + .input-icon,
        .input-wrap:focus-within .input-icon {
          color: #1a6b3c;
        }

        /* password strength */
        .pwd-strength {
          margin-top: 8px;
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .pwd-bar {
          height: 3px;
          flex: 1;
          border-radius: 4px;
          background: #e0ece0;
          transition: background 0.3s;
        }
        .pwd-bar.weak   { background: #dc2626; }
        .pwd-bar.medium { background: #d97706; }
        .pwd-bar.strong { background: #1a6b3c; }
        .pwd-label {
          font-size: 11px;
          font-weight: 600;
          margin-left: 6px;
          min-width: 42px;
          text-align: right;
        }
        .pwd-label.weak   { color: #dc2626; }
        .pwd-label.medium { color: #d97706; }
        .pwd-label.strong { color: #1a6b3c; }

        /* terms row */
        .terms-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 22px;
          cursor: pointer;
        }
        .terms-row input[type="checkbox"] {
          width: 16px; height: 16px;
          accent-color: #1a6b3c;
          margin-top: 2px;
          flex-shrink: 0;
          cursor: pointer;
        }
        .terms-row span {
          font-size: 13px;
          color: #7a8a7a;
          line-height: 1.5;
        }
        .terms-row a {
          color: #1a6b3c;
          font-weight: 600;
          text-decoration: none;
        }
        .terms-row a:hover { text-decoration: underline; }

        /* button */
        .btn-register {
          width: 100%;
          padding: 13px 20px;
          background: #1a6b3c;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
          box-shadow: 0 3px 12px rgba(26,107,60,0.28);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-register:hover {
          background: #155732;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(26,107,60,0.34);
        }
        .btn-register:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(26,107,60,0.22);
        }

        /* divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 24px 0;
          color: #b0c0b0;
          font-size: 12px;
          font-weight: 500;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e0ece0;
        }

        /* login link */
        .login-link {
          text-align: center;
          font-size: 14px;
          color: #7a8a7a;
        }
        .login-link span {
          color: #1a6b3c;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.15s;
        }
        .login-link span:hover { color: #155732; text-decoration: underline; }

        /* ── RIGHT BRANDING PANEL ── */
        .reg-right {
          background: linear-gradient(145deg, #0f1f0f 0%, #1a3d1a 50%, #0f2d1a 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 52px;
          position: relative;
          overflow: hidden;
          order: 2;
        }
        .reg-right::before {
          content: '';
          position: absolute;
          top: -80px; left: -80px;
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(76,175,125,0.14) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
        }
        .reg-right::after {
          content: '';
          position: absolute;
          bottom: -60px; right: -60px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(76,175,125,0.10) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        .brand-icon {
          width: 42px; height: 42px;
          background: #1a6b3c;
          border-radius: 12px;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 16px rgba(26,107,60,0.4);
          flex-shrink: 0;
        }
        .brand-icon svg { width: 22px; height: 22px; fill: #fff; }
        .brand-name {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .right-body {
          position: relative;
          z-index: 1;
        }
        .right-body h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 36px;
          color: #ffffff;
          letter-spacing: -0.5px;
          line-height: 1.2;
          margin-bottom: 14px;
        }
        .right-body h2 span { color: #4caf7d; }
        .right-body p {
          font-size: 15px;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
          max-width: 340px;
          margin-bottom: 32px;
        }

        /* feature list */
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .feature-check {
          width: 22px; height: 22px;
          background: rgba(76,175,125,0.18);
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .feature-check svg { width: 12px; height: 12px; fill: #4caf7d; }
        .feature-text {
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          line-height: 1.5;
        }
        .feature-text strong {
          color: rgba(255,255,255,0.9);
          font-weight: 600;
          display: block;
          margin-bottom: 1px;
        }

        .right-footer {
          position: relative;
          z-index: 1;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          line-height: 1.6;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .reg-root { grid-template-columns: 1fr; }
          .reg-right { display: none; }
          .reg-left { padding: 36px 24px; align-items: flex-start; padding-top: 60px; order: 1; }
          .reg-card { max-width: 100%; }
        }
      `}</style>

      <div className="reg-root">

        {/* ── LEFT: FORM PANEL ── */}
        <div className="reg-left">
          <div className="reg-card">

            <div className="reg-card-header">
              <h2>Create your account</h2>
              <p>Join ComplaintCore to report and track<br/>community issues in your area</p>
            </div>

            {/* Step indicator */}
            <div className="steps">
              <div className="step">
                <div className="step-dot active">1</div>
                <span className="step-label active">Account</span>
              </div>
              <div className="step-line" />
              <div className="step">
                <div className="step-dot idle">2</div>
                <span className="step-label">Verify</span>
              </div>
              <div className="step-line" />
              <div className="step">
                <div className="step-dot idle">3</div>
                <span className="step-label">Done</span>
              </div>
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrap">
                <input
                  className="form-input"
                  placeholder="Jane Smith"
                  onChange={(e) => setName(e.target.value)}
                />
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <input
                  className="form-input"
                  placeholder="you@example.com"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <input
                  className="form-input"
                  placeholder="Minimum 8 characters"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z"/>
                  </svg>
                </span>
              </div>
              
            </div>

            {/* Terms checkbox (visual only) */}
            <label className="terms-row">
              <input type="checkbox" defaultChecked />
              <span>
                I agree to the <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a> of ComplaintCore
              </span>
            </label>

            <button className="btn-register" onClick={handleRegister}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z"/>
              </svg>
              Create Account
            </button>

            <div className="divider">or</div>

            <div className="login-link">
              Already have an account?{" "}
              <span onClick={() => navigate("/")}>
                Already have account?
              </span>
            </div>

          </div>
        </div>

        {/* ── RIGHT: BRANDING PANEL ── */}
        <div className="reg-right">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </div>
            <span className="brand-name">ComplaintCore</span>
          </div>

          <div className="right-body">
            <h2>Join thousands<br/>making their<br/><span>community better</span></h2>
            <p>ComplaintCore connects citizens and authorities to resolve local issues faster and more transparently than ever.</p>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-check">
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <div className="feature-text">
                  <strong>Real-time Tracking</strong>
                  Follow your complaint from submission to resolution with live status updates.
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-check">
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <div className="feature-text">
                  <strong>Instant Notifications</strong>
                  Get email and SMS alerts the moment your complaint status changes.
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-check">
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <div className="feature-text">
                  <strong>Full Transparency</strong>
                  Resolution proof is uploaded by authorities for every closed complaint.
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-check">
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <div className="feature-text">
                  <strong>Free Forever</strong>
                  No fees, no subscriptions — ComplaintCore is a public community service.
                </div>
              </div>
            </div>
          </div>

          <div className="right-footer">
            © 2024 ComplaintCore · Community Complaint Management System<br/>
            Serving 1,200+ citizens · 248 issues resolved
          </div>
        </div>

      </div>
    </>
  );
}