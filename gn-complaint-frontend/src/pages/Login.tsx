import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    // Save token
    localStorage.setItem("token", res.data.token);

    // Save role
    localStorage.setItem("role", res.data.role);

    alert("Login success");

    // Redirect based on role
    if (res.data.role === "admin") {
      navigate("/adminDash");
    } else {
      navigate("/home");
    }

  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          background: #f7faf7;
        }

        /* ── LEFT BRANDING PANEL ── */
        .login-left {
          background: linear-gradient(145deg, #0f1f0f 0%, #1a3d1a 55%, #0f2d1a 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 52px;
          position: relative;
          overflow: hidden;
        }

        /* decorative glows */
        .login-left::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(76,175,125,0.13) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
        }
        .login-left::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(76,175,125,0.09) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
        }

        /* decorative grid pattern overlay */
        .login-left-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(76,175,125,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(76,175,125,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* brand */
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
          box-shadow: 0 4px 18px rgba(26,107,60,0.45);
          flex-shrink: 0;
        }
        .brand-icon svg { width: 22px; height: 22px; fill: #fff; }
        .brand-name {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        /* centre body */
        .left-body {
          position: relative;
          z-index: 1;
        }
        .left-body h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 40px;
          color: #ffffff;
          letter-spacing: -0.7px;
          line-height: 1.18;
          margin-bottom: 20px;
        }
        .left-body h2 span { color: #4caf7d; }
        .left-body p {
          font-size: 15px;
          color: rgba(255,255,255,0.52);
          line-height: 1.75;
          max-width: 320px;
          margin-bottom: 36px;
        }

        /* feature pills */
        .feature-pills {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .feature-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(76,175,125,0.18);
          border-radius: 10px;
          padding: 12px 16px;
          backdrop-filter: blur(4px);
        }
        .pill-icon {
          width: 32px; height: 32px;
          background: rgba(76,175,125,0.15);
          border-radius: 8px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .pill-icon svg { width: 16px; height: 16px; fill: #4caf7d; }
        .pill-text strong {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.88);
          margin-bottom: 2px;
        }
        .pill-text span {
          font-size: 12px;
          color: rgba(255,255,255,0.42);
          line-height: 1.4;
        }

        /* bottom footer text */
        .left-footer {
          position: relative;
          z-index: 1;
          font-size: 12px;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.02em;
        }

        /* ── RIGHT FORM PANEL ── */
        .login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: #f7faf7;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
        }

        /* card header */
        .login-card-header {
          margin-bottom: 36px;
        }
        .login-card-header h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 30px;
          color: #0f1f0f;
          letter-spacing: -0.4px;
          margin-bottom: 6px;
        }
        .login-card-header p {
          font-size: 14px;
          color: #7a8a7a;
          line-height: 1.5;
        }

        /* form groups */
        .form-group { margin-bottom: 20px; }
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #2d3a2d;
          margin-bottom: 7px;
          letter-spacing: 0.01em;
        }

        /* input with icon */
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
        .input-wrap:focus-within .input-icon { color: #1a6b3c; }

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

        /* forgot password */
        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -12px;
          margin-bottom: 22px;
        }
        .forgot-link {
          font-size: 12.5px;
          font-weight: 600;
          color: #1a6b3c;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.15s;
        }
        .forgot-link:hover { color: #155732; text-decoration: underline; }

        /* button */
        .btn-login {
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
        .btn-login:hover {
          background: #155732;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(26,107,60,0.34);
        }
        .btn-login:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(26,107,60,0.22);
        }

        /* divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 26px 0;
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

        /* register link */
        .register-link {
          text-align: center;
          font-size: 14px;
          color: #7a8a7a;
        }
        .register-link span {
          color: #1a6b3c;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.15s;
        }
        .register-link span:hover { color: #155732; text-decoration: underline; }

        /* footer note */
        .login-footer-note {
          margin-top: 28px;
          text-align: center;
          font-size: 12px;
          color: #b0c0b0;
          line-height: 1.7;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .login-left { padding: 40px 36px; }
          .left-body h2 { font-size: 34px; }
        }

        @media (max-width: 768px) {
          .login-root { grid-template-columns: 1fr; }
          .login-left { display: none; }
          .login-right {
            padding: 0 24px;
            align-items: flex-start;
            min-height: 100vh;
          }
          .login-card {
            max-width: 100%;
            padding-top: 64px;
            padding-bottom: 48px;
          }
        }

        @media (max-width: 400px) {
          .login-right { padding: 0 18px; }
          .login-card-header h2 { font-size: 26px; }
        }
      `}</style>

      <div className="login-root">

        {/* ── LEFT BRANDING PANEL ── */}
        <div className="login-left">
          <div className="login-left-grid" />

          {/* Brand */}
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </div>
            <span className="brand-name">ComplaintCore</span>
          </div>

          {/* Centre body */}
          <div className="left-body">
            <h2>Your voice<br/>makes the<br/><span>community better</span></h2>
            <p>Report issues, track progress, and hold your community accountable — transparently and efficiently.</p>

            <div className="feature-pills">
              <div className="feature-pill">
                <div className="pill-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                </div>
                <div className="pill-text">
                  <strong>Submit Local Issues</strong>
                  <span>Report problems in your area with photos and location</span>
                </div>
              </div>
              <div className="feature-pill">
                <div className="pill-icon">
                  <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
                </div>
                <div className="pill-text">
                  <strong>Track in Real-Time</strong>
                  <span>Follow your complaint from pending to resolved</span>
                </div>
              </div>
              <div className="feature-pill">
                <div className="pill-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                </div>
                <div className="pill-text">
                  <strong>Get Notified Instantly</strong>
                  <span>Receive updates every time your complaint status changes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="left-footer">
            © 2024 ComplaintCore · Community Complaint Management
          </div>
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div className="login-right">
          <div className="login-card">

            <div className="login-card-header">
              <h2>Welcome back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </span>
                <input
                  className="form-input"
                  placeholder="you@example.com"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z"/>
                  </svg>
                </span>
                <input
                  className="form-input"
                  placeholder="Enter your password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="forgot-row">
              <a className="forgot-link">Forgot password?</a>
            </div>

            <button className="btn-login" onClick={handleLogin}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
              </svg>
              Sign In
            </button>

            <div className="divider">or</div>

            <div className="register-link">
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")}>
                Create account
              </span>
            </div>

            <p className="login-footer-note">
              By signing in, you agree to our Terms of Service<br/>and Privacy Policy.
            </p>

          </div>
        </div>

      </div>
    </>
  );
}