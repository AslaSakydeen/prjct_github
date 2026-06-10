import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  /* HERO */
  .hero-section { min-height:100vh; padding:120px 24px 80px; position:relative; overflow:hidden; }
  .hero-blob-1 { position:absolute; top:-100px; right:-100px; width:600px; height:600px; background:radial-gradient(circle,rgba(34,197,94,0.12),transparent 70%); border-radius:50%; pointer-events:none; }
  .hero-blob-2 { position:absolute; bottom:-50px; left:-80px; width:400px; height:400px; background:radial-gradient(circle,rgba(21,128,61,0.08),transparent 70%); border-radius:50%; pointer-events:none; }
  .hero-inner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; align-items:center; gap:60px; }
  .hero-left { animation:fadeUp 0.8s ease both; }
  .hero-pill {
    display:inline-flex; align-items:center; gap:8px;
    background:var(--green-100); border:1px solid rgba(21,128,61,0.2);
    border-radius:100px; padding:6px 14px 6px 8px;
    font-size:0.78rem; font-weight:600; color:var(--green-800);
    letter-spacing:0.04em; margin-bottom:24px;
  }
  .pill-dot {
    width:22px; height:22px; background:var(--green-700);
    border-radius:50%; display:flex; align-items:center; justify-content:center;
  }
  .hero-h1 {
    font-family:'Playfair Display',serif;
    font-size:clamp(2.8rem,5vw,4rem); font-weight:800;
    line-height:1.08; letter-spacing:-0.03em; color:var(--ink); margin-bottom:20px;
  }
  .hero-h1 em { font-style:italic; color:var(--green-700); }
  .hero-sub { font-size:1.05rem; color:var(--ink-muted); line-height:1.75; max-width:480px; font-weight:300; margin-bottom:36px; }
  .hero-btns { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
  .btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    padding:15px 30px;
    background:linear-gradient(135deg,var(--green-800),var(--green-600));
    color:white; font-family:inherit; font-size:0.95rem; font-weight:600;
    border:none; border-radius:14px; cursor:pointer; text-decoration:none;
    transition:all 0.3s; box-shadow:0 6px 20px rgba(21,128,61,0.3);
    position:relative; overflow:hidden;
  }
  .btn-primary::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.12),transparent); }
  .btn-primary:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(21,128,61,0.4); }
  .btn-outline {
    display:inline-flex; align-items:center; gap:8px;
    padding:15px 24px; background:transparent; color:var(--ink-soft);
    font-family:inherit; font-size:0.95rem; font-weight:500;
    border:1.5px solid rgba(0,0,0,0.15); border-radius:14px;
    cursor:pointer; text-decoration:none; transition:all 0.25s;
  }
  .btn-outline:hover { color:var(--green-700); border-color:var(--green-500); background:var(--green-50); }
  .trust-bar { display:flex; align-items:center; gap:28px; margin-top:48px; padding-top:32px; border-top:1px solid rgba(0,0,0,0.07); flex-wrap:wrap; }
  .trust-item { display:flex; align-items:center; gap:10px; }
  .trust-num { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:700; color:var(--green-800); letter-spacing:-0.03em; }
  .trust-label { font-size:0.78rem; color:var(--ink-muted); font-weight:500; line-height:1.3; }
  .trust-divider { width:1px; height:32px; background:rgba(0,0,0,0.1); }

  /* HERO RIGHT */
  .hero-right { animation:fadeUp 0.8s 0.15s ease both; position:relative; display:flex; justify-content:center; }
  .hero-map-card {
    background:white; border-radius:var(--radius-lg); padding:28px;
    box-shadow:var(--shadow-lg); border:1px solid rgba(21,128,61,0.1);
    width:100%; max-width:420px; position:relative;
  }
  .map-placeholder {
    width:100%; height:180px;
    background:linear-gradient(135deg,var(--green-50),var(--green-100));
    border-radius:16px; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:10px;
    margin-bottom:20px; position:relative; overflow:hidden;
  }
  .map-placeholder::before {
    content:''; position:absolute; inset:0;
    background-image:linear-gradient(rgba(21,128,61,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(21,128,61,0.07) 1px,transparent 1px);
    background-size:24px 24px;
  }
  .map-pin {
    position:relative; z-index:1; width:44px; height:44px;
    background:var(--green-700); border-radius:50% 50% 50% 0;
    transform:rotate(-45deg); box-shadow:0 4px 12px rgba(21,128,61,0.4);
    display:flex; align-items:center; justify-content:center;
  }
  .map-pin::before {
    content:''; position:absolute; width:60px; height:60px; border-radius:50%;
    border:2px solid rgba(34,197,94,0.3); animation:pulse-ring 1.8s ease-out infinite;
  }
  .map-pin-inner { transform:rotate(45deg); width:12px; height:12px; background:white; border-radius:50%; }
  .map-label { font-size:0.78rem; font-weight:600; color:var(--green-700); letter-spacing:0.05em; position:relative; z-index:1; }
  .mini-complaints { display:flex; flex-direction:column; gap:10px; }
  .mini-item { display:flex; align-items:center; gap:12px; padding:10px 12px; background:var(--green-50); border-radius:12px; cursor:pointer; transition:background 0.2s; }
  .mini-item:hover { background:var(--green-100); }
  .mini-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
  .dot-resolved { background:var(--green-500); }
  .dot-progress { background:var(--accent); }
  .dot-open     { background:#ef4444; }
  .mini-text { flex:1; font-size:0.8rem; font-weight:500; color:var(--ink); }
  .mini-badge { font-size:0.68rem; font-weight:600; padding:3px 8px; border-radius:6px; white-space:nowrap; }
  .badge-resolved { background:var(--green-100); color:var(--green-800); }
  .badge-progress { background:var(--accent-lt); color:#92400e; }
  .badge-open     { background:#fee2e2; color:#991b1b; }
  .notif-float {
    position:absolute; top:-18px; right:-18px; background:white;
    border-radius:14px; padding:12px 16px; box-shadow:var(--shadow-md);
    display:flex; align-items:center; gap:10px;
    border:1px solid rgba(21,128,61,0.12); animation:float 4s ease-in-out infinite;
  }
  .notif-icon { width:34px; height:34px; background:var(--green-100); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .notif-text { font-size:0.75rem; font-weight:600; color:var(--ink); line-height:1.3; }
  .notif-sub  { font-size:0.68rem; color:var(--ink-muted); font-weight:400; }

  /* HOW IT WORKS */
  .how-section { padding:90px 24px; background:var(--green-950); position:relative; overflow:hidden; }
  .how-section::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--green-700),transparent); }
  .how-inner { max-width:1200px; margin:0 auto; }
  .section-eyebrow { font-size:0.75rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--green-400); margin-bottom:12px; }
  .section-title { font-family:'Playfair Display',serif; font-size:clamp(1.9rem,3.5vw,2.6rem); font-weight:800; color:white; letter-spacing:-0.025em; line-height:1.1; margin-bottom:56px; max-width:500px; }
  .steps-row { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; position:relative; }
  .steps-row::before { content:''; position:absolute; top:36px; left:calc(16.6% + 20px); right:calc(16.6% + 20px); height:1px; background:linear-gradient(90deg,var(--green-700),var(--green-500),var(--green-700)); }
  .step-box { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-lg); padding:32px 28px; transition:all 0.3s; cursor:default; }
  .step-box:hover { background:rgba(255,255,255,0.07); border-color:rgba(34,197,94,0.3); transform:translateY(-4px); }
  .step-num-wrap { width:48px; height:48px; border-radius:14px; background:linear-gradient(135deg,var(--green-700),var(--green-500)); display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-size:1.3rem; font-weight:800; color:white; margin-bottom:20px; box-shadow:0 6px 16px rgba(34,197,94,0.3); }
  .step-heading { font-size:1rem; font-weight:600; color:white; margin-bottom:10px; letter-spacing:-0.01em; }
  .step-desc { font-size:0.875rem; color:rgba(255,255,255,0.5); line-height:1.7; font-weight:300; }

  /* FEATURES */
  .features-section { padding:90px 24px; background:var(--sand); }
  .features-inner { max-width:1200px; margin:0 auto; }
  .features-header { display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:end; margin-bottom:56px; }
  .section-eyebrow-green { font-size:0.75rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--green-700); margin-bottom:12px; }
  .section-title-dark { font-family:'Playfair Display',serif; font-size:clamp(1.9rem,3vw,2.5rem); font-weight:800; color:var(--ink); letter-spacing:-0.025em; line-height:1.1; }
  .section-sub { font-size:0.95rem; color:var(--ink-muted); line-height:1.75; font-weight:300; max-width:420px; align-self:end; }
  .features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .feat-card { background:white; border-radius:var(--radius-lg); padding:36px 32px; border:1px solid rgba(21,128,61,0.07); box-shadow:var(--shadow-sm); transition:all 0.3s; position:relative; overflow:hidden; }
  .feat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--green-600),var(--green-400)); transform:scaleX(0); transform-origin:left; transition:transform 0.3s; }
  .feat-card:hover { transform:translateY(-6px); box-shadow:var(--shadow-lg); border-color:rgba(21,128,61,0.15); }
  .feat-card:hover::before { transform:scaleX(1); }
  .feat-icon-wrap { width:52px; height:52px; background:var(--green-50); border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; transition:background 0.3s; }
  .feat-card:hover .feat-icon-wrap { background:var(--green-100); }
  .feat-title { font-size:1.05rem; font-weight:700; color:var(--ink); margin-bottom:10px; letter-spacing:-0.01em; }
  .feat-desc { font-size:0.875rem; color:var(--ink-muted); line-height:1.7; font-weight:300; }
  .feat-link { display:inline-flex; align-items:center; gap:6px; margin-top:20px; font-size:0.82rem; font-weight:600; color:var(--green-700); cursor:pointer; transition:gap 0.2s; }
  .feat-card:hover .feat-link { gap:10px; }

  /* STATS BAND */
  .stats-band { background:linear-gradient(135deg,var(--green-800),var(--green-700)); padding:60px 24px; }
  .stats-inner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:30px; }
  .stat-box { text-align:center; }
  .stat-big { font-family:'Playfair Display',serif; font-size:2.8rem; font-weight:800; color:white; letter-spacing:-0.04em; line-height:1; margin-bottom:6px; animation:countUp 0.6s ease both; }
  .stat-desc { font-size:0.82rem; color:rgba(255,255,255,0.6); font-weight:400; }

  /* TESTIMONIALS */
  .testi-section { padding:90px 24px; background:var(--sand); }
  .testi-inner { max-width:1200px; margin:0 auto; }
  .testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:48px; }
  .testi-card { background:white; border-radius:var(--radius-lg); padding:32px 28px; border:1px solid rgba(21,128,61,0.07); box-shadow:var(--shadow-sm); transition:all 0.3s; }
  .testi-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-md); }
  .testi-quote { font-family:'Playfair Display',serif; font-size:1.4rem; color:#bbf7d0; margin-bottom:12px; line-height:1; }
  .testi-text { font-size:0.875rem; color:var(--ink-soft); line-height:1.7; font-weight:300; margin-bottom:20px; }
  .testi-author { display:flex; align-items:center; gap:12px; }
  .testi-avatar { width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:white; flex-shrink:0; }
  .testi-name { font-size:0.85rem; font-weight:600; color:var(--ink); }
  .testi-role { font-size:0.75rem; color:var(--ink-muted); }

  /* CTA */
  .cta-section { padding:0 24px 90px; }
  .cta-inner { max-width:1200px; margin:0 auto; background:var(--green-950); border-radius:var(--radius-lg); padding:70px 80px; display:grid; grid-template-columns:1fr auto; align-items:center; gap:40px; position:relative; overflow:hidden; }
  .cta-inner::before { content:''; position:absolute; top:-80px; right:80px; width:300px; height:300px; background:radial-gradient(circle,rgba(34,197,94,0.2),transparent 70%); pointer-events:none; }
  .cta-eyebrow { font-size:0.72rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--green-400); margin-bottom:12px; }
  .cta-title { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,3vw,2.4rem); font-weight:800; color:white; letter-spacing:-0.025em; line-height:1.1; margin-bottom:12px; }
  .cta-sub { font-size:0.9rem; color:rgba(255,255,255,0.45); font-weight:300; }
  .btn-cta { display:inline-flex; align-items:center; gap:10px; padding:16px 32px; background:linear-gradient(135deg,var(--green-600),var(--green-500)); color:white; font-family:inherit; font-size:0.95rem; font-weight:700; border:none; border-radius:14px; cursor:pointer; white-space:nowrap; box-shadow:0 8px 24px rgba(34,197,94,0.3); transition:all 0.3s; }
  .btn-cta:hover { transform:translateY(-3px); box-shadow:0 14px 32px rgba(34,197,94,0.4); }

  /* FOOTER */
  .footer { background:var(--green-950); border-top:1px solid rgba(255,255,255,0.05); padding:60px 24px 30px; }
  .footer-inner { max-width:1200px; margin:0 auto; }
  .footer-top { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px; margin-bottom:48px; }
  .footer-brand-name { font-family:'DM Sans',sans-serif; font-weight:700; font-size:1.1rem; color:white; margin-bottom:12px; }
  .footer-brand-name span { color:var(--green-400); }
  .footer-tagline { font-size:0.85rem; color:rgba(255,255,255,0.45); line-height:1.65; font-weight:300; max-width:260px; }
  .footer-col-title { font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.5); margin-bottom:16px; }
  .footer-links { list-style:none; display:flex; flex-direction:column; gap:10px; }
  .footer-links a { font-size:0.85rem; color:rgba(255,255,255,0.45); text-decoration:none; transition:color 0.2s; font-weight:300; }
  .footer-links a:hover { color:var(--green-400); }
  .footer-bottom { padding-top:24px; border-top:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
  .footer-copy { font-size:0.78rem; color:rgba(255,255,255,0.3); }
  .footer-policy { display:flex; gap:20px; list-style:none; }
  .footer-policy a { font-size:0.78rem; color:rgba(255,255,255,0.3); text-decoration:none; transition:color 0.2s; }
  .footer-policy a:hover { color:var(--green-400); }

  /* RESPONSIVE */
  @media (max-width:1024px) {
    .hero-inner { grid-template-columns:1fr; }
    .hero-right { display:none; }
    .hero-section { padding:120px 24px 60px; }
    .steps-row { grid-template-columns:1fr; }
    .steps-row::before { display:none; }
    .features-header { grid-template-columns:1fr; gap:16px; }
    .features-grid { grid-template-columns:1fr 1fr; }
    .stats-inner { grid-template-columns:repeat(2,1fr); }
    .testi-grid { grid-template-columns:1fr 1fr; }
    .cta-inner { grid-template-columns:1fr; padding:48px 40px; }
    .footer-top { grid-template-columns:1fr 1fr; }
  }
  @media (max-width:768px) {
    .nav-center, .nav-right { display:none; }
    .hamburger { display:flex; }
    .features-grid { grid-template-columns:1fr; }
    .stats-inner { grid-template-columns:1fr 1fr; }
    .testi-grid { grid-template-columns:1fr; }
    .footer-top { grid-template-columns:1fr; }
  }
  @media (max-width:480px) {
    .stats-inner { grid-template-columns:1fr 1fr; gap:20px; }
    .hero-btns { flex-direction:column; }
    .btn-primary, .btn-outline { width:100%; justify-content:center; }
    .trust-bar { gap:14px; }
  }
`;

const miniIssues = [
  { id:"CV-1061", title:"Pothole on Main St causing vehicle damage",     status:"dot-open",     statusLabel:"Open"       },
  { id:"CV-1058", title:"Illegal dumping near Negombo lagoon",            status:"dot-progress", statusLabel:"In Progress" },
  { id:"CV-1042", title:"Water supply disruption in Zone 4",              status:"dot-resolved", statusLabel:"Resolved"   },
];

const features = [
  { icon:"📋", title:"Quick Reporting",       desc:"Submit a complaint in under 2 minutes. Attach photos, set the location, and choose the category — our smart form guides you every step."    },
  { icon:"📍", title:"Real-time Tracking",    desc:"Watch your complaint move through review, assignment, and resolution stages with live status updates and push notifications."                },
  { icon:"🤝", title:"Community Upvoting",    desc:"Support issues raised by your neighbours. The more upvotes, the faster the resolution — because collective voice matters."                  },
  { icon:"📊", title:"Transparent Reports",   desc:"Monthly public dashboards show which issues were resolved, how long they took, and which departments handled them."                         },
  { icon:"🔔", title:"Smart Notifications",   desc:"Get email and SMS alerts when your complaint status changes, with estimated resolution timelines from the council."                         },
  { icon:"⭐", title:"Rate the Resolution",   desc:"After an issue is closed, rate the quality of the fix. Your feedback shapes how authorities respond next time."                             },
];

const testimonials = [
  { text:"I reported a pothole that had been there for months. Within 48 hours it was assigned, and fixed by the end of the week. I was genuinely impressed.", name:"Priya S.",  role:"Resident, Negombo",    color:"#166534", initials:"PS" },
  { text:"CivicVoice gave our neighbourhood a real platform. We reported 12 issues in one week and 9 are already resolved. The community is more engaged than ever.", name:"Kamal F.", role:"Community Leader",      color:"#1d4e89", initials:"KF" },
  { text:"The transparency is what I love most. I can see exactly where my complaint stands, who it's assigned to, and when to expect a resolution.", name:"Amara N.", role:"Local Business Owner", color:"#92400e", initials:"AN" },
];

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* ── NAVBAR ── */}
      <div className={`nav-wrap${scrolled ? " scrolled" : ""}`}>
        <nav className="navbar">
          <div className="brand" onClick={() => navigate("/")}>
            <div className="brand-mark">CC</div>
            <span className="brand-name">Complaint<span>Core</span></span>
          </div>

          <ul className="nav-center">
            <li className="active"><a href="#">Home</a></li>
            <li><span onClick={() => navigate("/how")}>How it Works</span></li>
            <li><span onClick={() => navigate("/complaints")}>My Complaints</span></li>
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

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-blob-1" />
        <div className="hero-blob-2" />

        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-pill">
              <div className="pill-dot">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Trusted by 12,000+ residents
            </div>

            <h1 className="hero-h1">
              Your voice<br/>shapes a <em>better</em><br/>community.
            </h1>

            <p className="hero-sub">
              Report local issues instantly, track every complaint in real-time,
              and hold authorities accountable — all in one platform built for
              the people who call this community home.
            </p>

            <div className="hero-btns">
              <button className="btn-primary" onClick={() => navigate("/complaint")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Report an Issue
              </button>
              <a href="#how" className="btn-outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
                How it works
              </a>
            </div>

            <div className="trust-bar">
              <div className="trust-item">
                <div className="trust-num">2,841</div>
                <div className="trust-label">Issues<br/>resolved</div>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <div className="trust-num">94%</div>
                <div className="trust-label">Satisfaction<br/>rate</div>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <div className="trust-num">48h</div>
                <div className="trust-label">Avg. response<br/>time</div>
              </div>
            </div>
          </div>

          {/* Hero right card */}
          <div className="hero-right">
            <div style={{ position:"relative", width:"100%", maxWidth:"420px" }}>
             
              <div className="hero-map-card">
                <div className="map-placeholder">
                  <div className="map-pin"><div className="map-pin-inner" /></div>
                  <div className="map-label">12 Active Issues Nearby</div>
                </div>
                <div className="mini-complaints">
                  {miniIssues.map(issue => (
                    <div className="mini-item" key={issue.id}>
                      <div className={`mini-dot ${issue.status}`} />
                      <div className="mini-text">{issue.title.substring(0,38)}…</div>
                      <span className={`mini-badge ${
                        issue.status === "dot-resolved" ? "badge-resolved"
                        : issue.status === "dot-progress" ? "badge-progress"
                        : "badge-open"
                      }`}>{issue.statusLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section" id="how">
        <div className="how-inner">
          <p className="section-eyebrow">The process</p>
          <h2 className="section-title">Three steps to a resolved complaint</h2>
          <div className="steps-row">
            {[
              { num:"01", heading:"Submit your report",   desc:"Describe the issue with photos and pinpoint the location. Our smart form takes under 2 minutes to complete." },
              { num:"02", heading:"Council reviews it",   desc:"Your complaint is assigned to the relevant department within 24 hours and you receive an acknowledgement."    },
              { num:"03", heading:"Verified & closed",    desc:"Once fixed, verify the resolution and rate your experience. Your feedback directly improves future responses." },
            ].map(s => (
              <div className="step-box" key={s.num}>
                <div className="step-num-wrap">{s.num}</div>
                <div className="step-heading">{s.heading}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" id="features">
        <div className="features-inner">
          <div className="features-header">
            <div>
              <p className="section-eyebrow-green">Platform features</p>
              <h2 className="section-title-dark">Everything your community needs</h2>
            </div>
            <p className="section-sub">
              CommunityCare is more than a complaint box — it's a full civic engagement
              platform designed to make accountability effortless.
            </p>
          </div>
          <div className="features-grid" id="reviews">
            {features.map((f, i) => (
              <div className="feat-card" key={i}>
                <div className="feat-icon-wrap">
                  <span style={{ fontSize:"24px" }}>{f.icon}</span>
                </div>
                <div className="feat-title">{f.title}</div>
                <p className="feat-desc">{f.desc}</p>
                <div className="feat-link">
                  Learn more
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div className="stats-band">
        <div className="stats-inner">
          {[
            { num:"12,400+", label:"Registered citizens" },
            { num:"2,841",   label:"Issues resolved"     },
            { num:"94%",     label:"Satisfaction rate"   },
            { num:"48h",     label:"Avg. response time"  },
          ].map((s, i) => (
            <div className="stat-box" key={i}>
              <div className="stat-big">{s.num}</div>
              <div className="stat-desc">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section className="testi-section">
        <div className="testi-inner">
          <p className="section-eyebrow-green">Community voices</p>
          <h2 className="section-title-dark">What residents are saying</h2>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div className="testi-card" key={i}>
                <div className="testi-quote">"</div>
                <p className="testi-text">{t.text}</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background:t.color }}>{t.initials}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <div>
            <p className="cta-eyebrow">Take action today</p>
            <h2 className="cta-title">Spotted something<br/>in your neighbourhood?</h2>
            <p className="cta-sub">Don't wait — report it and help keep our community safe, clean, and thriving for everyone.</p>
          </div>
          <button className="btn-cta" onClick={() => navigate("/complaint")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Report an Issue
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand-name">Community<span>Care</span></div>
              <p className="footer-tagline">
                A civic platform empowering residents to report, track, and resolve
                community issues with full transparency and accountability.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Platform</div>
              <ul className="footer-links">
                <li><a href="#">Report an issue</a></li>
                <li><a href="#">My complaints</a></li>
                <li><a href="#">Community map</a></li>
                <li><a href="#">Statistics</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Resources</div>
              <ul className="footer-links">
                <li><a href="#">How it works</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Council contacts</a></li>
                <li><a href="#">Accessibility</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Legal</div>
              <ul className="footer-links">
                <li><a href="#">Privacy policy</a></li>
                <li><a href="#">Terms of use</a></li>
                <li><a href="#">Cookie policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2026 CommunityCare. All rights reserved.</p>
            <ul className="footer-policy">
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}