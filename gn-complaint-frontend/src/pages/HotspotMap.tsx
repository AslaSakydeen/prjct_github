import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ─── Fix default Leaflet icons ───────────────────────────────────────────────
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ─── Priority icon factory ────────────────────────────────────────────────────
const makeIcon = (color: string) =>
  new L.DivIcon({
    className: "",
    html: `<div style="
      width:28px; height:28px;
      background:${color};
      border:3px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 4px 14px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });

const ICONS: Record<string, L.DivIcon> = {
  High:   makeIcon("#ef4444"),
  Medium: makeIcon("#f59e0b"),
  Low:    makeIcon("#22c55e"),
  default:makeIcon("#6b7280"),
};

// ─── Haversine distance (metres) ─────────────────────────────────────────────
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ComplaintData {
  complaint_id: number;
  reference_no: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  complaint_date: string;
  location_name: string;
  latitude: number | string | null;
  longitude: number | string | null;
}

interface Hotspot {
  lat: number;
  lng: number;
  count: number;
}

// ─── Fly-to helper ────────────────────────────────────────────────────────────
function FlyToSriLanka() {
  const map = useMap();
  useEffect(() => {
    map.setView([7.8731, 80.7718], 8);
  }, [map]);
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HotspotMap() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [complaints, setComplaints] = useState<ComplaintData[]>([]);
  const [loading, setLoading] = useState(true);

  const [catFilter,  setCatFilter]  = useState("All");
  const [statFilter, setStatFilter] = useState("All");
  const [priFilter,  setPriFilter]  = useState("All");

  // scroll for nav
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // fetch
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/complaints`)
      .then((r) => {
        setComplaints(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // unique filter values
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(complaints.map((c) => c.category).filter(Boolean)))],
    [complaints]
  );
  const statuses = ["All", "Pending", "In progress", "Resolved"];
  const priorities = ["All", "High", "Medium", "Low"];

  // filtered
  const filtered = useMemo(
    () =>
      complaints.filter((c) => {
        if (catFilter  !== "All" && c.category !== catFilter)  return false;
        if (statFilter !== "All" && c.status   !== statFilter) return false;
        if (priFilter  !== "All" && c.priority !== priFilter)  return false;
        return true;
      }),
    [complaints, catFilter, statFilter, priFilter]
  );

  // only complaints with valid coordinates
  const mapped = useMemo(
    () =>
      filtered.filter(
        (c) =>
          c.latitude  != null && c.longitude != null &&
          !isNaN(Number(c.latitude)) && !isNaN(Number(c.longitude))
      ),
    [filtered]
  );

  // stats (based on ALL complaints, not filtered)
  const stats = useMemo(() => ({
    total:      complaints.length,
    pending:    complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In progress").length,
    resolved:   complaints.filter((c) => c.status === "Resolved").length,
    highPri:    complaints.filter((c) => c.priority === "High").length,
  }), [complaints]);

  // hotspots: cluster by 300 m
  const hotspots = useMemo<Hotspot[]>(() => {
    const visited = new Set<number>();
    const spots: Hotspot[] = [];
    for (let i = 0; i < mapped.length; i++) {
      if (visited.has(i)) continue;
      const la1 = Number(mapped[i].latitude);
      const lo1 = Number(mapped[i].longitude);
      const group = [i];
      for (let j = i + 1; j < mapped.length; j++) {
        if (visited.has(j)) continue;
        const dist = haversine(la1, lo1, Number(mapped[j].latitude), Number(mapped[j].longitude));
        if (dist <= 300) group.push(j);
      }
      if (group.length >= 3) {
        const avgLat = group.reduce((s, k) => s + Number(mapped[k].latitude),  0) / group.length;
        const avgLng = group.reduce((s, k) => s + Number(mapped[k].longitude), 0) / group.length;
        group.forEach((k) => visited.add(k));
        spots.push({ lat: avgLat, lng: avgLng, count: group.length });
      }
    }
    return spots;
  }, [mapped]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const priorityColor = (p: string) =>
    p === "High" ? "#ef4444" : p === "Medium" ? "#f59e0b" : p === "Low" ? "#22c55e" : "#6b7280";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --g800: #166534; --g700: #15803d; --g600: #16a34a;
          --g500: #22c55e; --g100: #dcfce7; --g50: #f0fdf4;
          --sand: #faf8f3; --ink: #0c1a0e; --ink-soft: #374151; --ink-muted: #6b7280;
          --shadow-sm: 0 2px 8px rgba(21,128,61,0.08);
          --shadow-md: 0 8px 32px rgba(21,128,61,0.14);
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: var(--sand); color: var(--ink); }

        /* NAV */
        .hm-nav-wrap { position:fixed; top:0; left:0; right:0; z-index:400; padding:12px 24px; }
        .hm-nav-wrap.scrolled .hm-navbar { box-shadow: var(--shadow-md); background: rgba(255,255,255,0.98); }
        .hm-navbar {
          max-width: 1300px; margin: 0 auto;
          background: rgba(255,255,255,0.92); backdrop-filter: blur(20px);
          border-radius: 18px; padding: 12px 26px;
          display: flex; align-items: center; justify-content: space-between;
          border: 1px solid rgba(21,128,61,0.1); transition: all 0.3s;
        }
        .hm-brand { display:flex; align-items:center; gap:10px; cursor:pointer; }
        .hm-brand-mark {
          width:40px; height:40px;
          background: linear-gradient(135deg, var(--g800), var(--g600));
          border-radius:12px; display:flex; align-items:center; justify-content:center;
          font-family:'Playfair Display',serif; font-weight:800; font-size:17px; color:white;
          box-shadow: 0 4px 12px rgba(21,128,61,0.32);
        }
        .hm-brand-name { font-weight:700; font-size:1.1rem; color:var(--ink); letter-spacing:-0.02em; }
        .hm-brand-name span { color: var(--g700); }
        .hm-nav-links { display:flex; align-items:center; gap:4px; list-style:none; }
        .hm-nav-links li span {
          display:block; padding:7px 15px; font-size:0.875rem; font-weight:500;
          color: var(--ink-soft); border-radius:9px; cursor:pointer; transition: all 0.2s;
        }
        .hm-nav-links li span:hover { color: var(--g700); background: var(--g50); }
        .hm-nav-links li.active span { background: var(--g800); color: white; font-weight:600; }
        .hm-nav-right { display:flex; align-items:center; gap:10px; }
        .hm-btn-submit {
          display:inline-flex; align-items:center; gap:6px;
          padding: 8px 18px;
          background: linear-gradient(135deg, var(--g800), var(--g600));
          color:white; font-size:0.875rem; font-weight:600;
          border:none; border-radius:10px; cursor:pointer;
          box-shadow: 0 4px 12px rgba(21,128,61,0.28); transition: all 0.25s;
        }
        .hm-btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(21,128,61,0.36); }
        .hm-btn-logout {
          padding:7px 16px; font-size:0.875rem; font-weight:500;
          color:var(--ink-soft); background:none;
          border:1.5px solid rgba(0,0,0,0.12); border-radius:9px; cursor:pointer;
          transition: all 0.2s; font-family: inherit;
        }
        .hm-btn-logout:hover { border-color: var(--g600); color: var(--g700); background: var(--g50); }

        /* PAGE */
        .hm-page {
          min-height:100vh; padding: 100px 24px 60px;
          background: linear-gradient(180deg, #f0fdf4 0%, #faf8f3 100%);
        }
        .hm-inner { max-width: 1300px; margin: 0 auto; }

        /* HERO */
        .hm-hero { text-align:center; margin-bottom:40px; animation: fadeUp 0.6s ease; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: none; } }
        .hm-hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          padding: 6px 16px; border-radius:20px;
          background: var(--g50); border:1px solid var(--g100);
          font-size:0.8rem; font-weight:600; color: var(--g700);
          margin-bottom:16px; letter-spacing:0.04em;
        }
        .hm-hero h1 {
          font-family:'Playfair Display',serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: var(--ink); line-height:1.15; margin-bottom:14px;
        }
        .hm-hero h1 span { color: var(--g700); }
        .hm-hero p { font-size:1.05rem; color: var(--ink-soft); max-width:580px; margin:0 auto; }

        /* STATS */
        .hm-stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap:16px; margin-bottom:28px;
          animation: fadeUp 0.7s ease;
        }
        .hm-stat {
          background:white; border-radius:18px; padding:20px 16px;
          box-shadow: var(--shadow-sm); border:1px solid rgba(21,128,61,0.08);
          text-align:center; transition: transform 0.2s, box-shadow 0.2s;
          position:relative; overflow:hidden;
        }
        .hm-stat::before {
          content:''; position:absolute; top:0; left:0; right:0; height:3px;
          background: var(--stat-color, var(--g600));
        }
        .hm-stat:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .hm-stat-icon { font-size:1.5rem; margin-bottom:6px; }
        .hm-stat-num { font-size:2.2rem; font-weight:800; color:var(--stat-color, var(--ink)); line-height:1; }
        .hm-stat-label { font-size:0.78rem; color: var(--ink-muted); font-weight:600; letter-spacing:0.05em; margin-top:4px; text-transform:uppercase; }

        /* FILTERS */
        .hm-controls {
          background:white; border-radius:18px; padding:20px 24px;
          box-shadow: var(--shadow-sm); border:1px solid rgba(21,128,61,0.08);
          display:flex; gap:16px; align-items:center; flex-wrap:wrap;
          margin-bottom:24px; animation: fadeUp 0.8s ease;
        }
        .hm-controls label { font-size:0.85rem; font-weight:600; color:var(--ink-soft); display:flex; flex-direction:column; gap:5px; flex:1; min-width:150px; }
        .hm-controls select {
          padding:9px 12px; border-radius:10px;
          border:1.5px solid #e2e8f0; font-family:inherit; font-size:0.9rem;
          color:var(--ink); background:white; cursor:pointer;
          transition:border-color 0.2s;
        }
        .hm-controls select:focus { outline:none; border-color: var(--g500); }
        .hm-clear-btn {
          padding:10px 20px; border-radius:10px; border:none;
          background: var(--g50); color: var(--g800); font-weight:600; font-size:0.875rem;
          cursor:pointer; transition:all 0.2s; align-self:flex-end;
        }
        .hm-clear-btn:hover { background: var(--g100); }

        /* LEGEND */
        .hm-legend {
          display:flex; gap:20px; flex-wrap:wrap; align-items:center;
          margin-bottom:16px;
        }
        .hm-legend-item { display:flex; align-items:center; gap:7px; font-size:0.85rem; font-weight:500; color:var(--ink-soft); }
        .hm-legend-dot { width:14px; height:14px; border-radius:50%; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.2); flex-shrink:0; }
        .hm-legend-count { font-size:0.8rem; color:var(--ink-muted); }

        /* MAP WRAPPER */
        .hm-map-wrapper {
          border-radius:22px; overflow:hidden;
          box-shadow: 0 12px 48px rgba(21,128,61,0.16);
          border:1px solid rgba(21,128,61,0.12);
          animation: fadeUp 0.9s ease;
        }
        .hm-map-info {
          background:rgba(255,255,255,0.95); backdrop-filter:blur(12px);
          padding:12px 20px; font-size:0.875rem; color:var(--ink-soft);
          border-bottom:1px solid var(--g100);
          display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;
        }
        .hm-showing { font-weight:600; color:var(--g800); }
        .hm-hotspot-note { display:flex; align-items:center; gap:6px; color:#dc2626; font-weight:500; }

        /* POPUP */
        .hm-popup { min-width:220px; }
        .hm-popup-title { font-size:0.95rem; font-weight:700; color:var(--ink); margin-bottom:10px; line-height:1.3; }
        .hm-popup-row { display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px solid #f1f5f9; font-size:0.82rem; }
        .hm-popup-row:last-child { border-bottom:none; }
        .hm-popup-key { color:var(--ink-muted); font-weight:500; }
        .hm-popup-val { font-weight:600; color:var(--ink); text-align:right; max-width:130px; }
        .hm-popup-badge {
          display:inline-block; padding:2px 9px; border-radius:20px;
          font-size:0.75rem; font-weight:700; color:white;
        }

        /* LOADING */
        .hm-loading {
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          min-height:400px; gap:14px;
        }
        .hm-spinner {
          width:48px; height:48px; border:4px solid var(--g100);
          border-top-color: var(--g600); border-radius:50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* RESPONSIVE */
        @media (max-width:900px) {
          .hm-stats { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width:600px) {
          .hm-stats { grid-template-columns: 1fr 1fr; }
          .hm-controls { flex-direction:column; }
          .hm-nav-links { display:none; }
        }
      `}</style>

      {/* ── NAV ── */}
      <div className={`hm-nav-wrap ${scrolled ? "scrolled" : ""}`}>
        <nav className="hm-navbar">
          <div className="hm-brand" onClick={() => navigate("/home")}>
            <div className="hm-brand-mark">CC</div>
            <span className="hm-brand-name">Complaint<span>Core</span></span>
          </div>

          <ul className="hm-nav-links">
            <li><span onClick={() => navigate("/home")}>Home</span></li>
            <li><span onClick={() => navigate("/how")}>How it Works</span></li>
            <li><span onClick={() => navigate("/track")}>Track Complaint</span></li>
            <li className="active"><span>Hotspot Map</span></li>
            <li><span onClick={() => navigate("/reviews")}>Reviews</span></li>
          </ul>

          <div className="hm-nav-right">
            <button className="hm-btn-submit" onClick={() => navigate("/complaint")}>
              + Submit Complaint
            </button>
            <button className="hm-btn-logout" onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}>Logout</button>
          </div>
        </nav>
      </div>

      {/* ── PAGE ── */}
      <div className="hm-page">
        <div className="hm-inner">

          {/* HERO */}
          <div className="hm-hero">
            <div className="hm-hero-badge">🗺️ Live Intelligence</div>
            <h1>Complaint <span>Hotspot</span> Map</h1>
            <p>
              Visualise community issues across your region in real-time.
              Discover patterns, monitor hotspots, and track resolution progress.
            </p>
          </div>

          {/* STATS */}
          <div className="hm-stats">
            <div className="hm-stat" style={{ "--stat-color": "#15803d" } as React.CSSProperties}>
              <div className="hm-stat-icon">📋</div>
              <div className="hm-stat-num">{stats.total}</div>
              <div className="hm-stat-label">Total Complaints</div>
            </div>
            <div className="hm-stat" style={{ "--stat-color": "#f59e0b" } as React.CSSProperties}>
              <div className="hm-stat-icon">⏳</div>
              <div className="hm-stat-num">{stats.pending}</div>
              <div className="hm-stat-label">Pending</div>
            </div>
            <div className="hm-stat" style={{ "--stat-color": "#3b82f6" } as React.CSSProperties}>
              <div className="hm-stat-icon">🔧</div>
              <div className="hm-stat-num">{stats.inProgress}</div>
              <div className="hm-stat-label">In Progress</div>
            </div>
            <div className="hm-stat" style={{ "--stat-color": "#10b981" } as React.CSSProperties}>
              <div className="hm-stat-icon">✅</div>
              <div className="hm-stat-num">{stats.resolved}</div>
              <div className="hm-stat-label">Resolved</div>
            </div>
            <div className="hm-stat" style={{ "--stat-color": "#ef4444" } as React.CSSProperties}>
              <div className="hm-stat-icon">🔴</div>
              <div className="hm-stat-num">{stats.highPri}</div>
              <div className="hm-stat-label">High Priority</div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="hm-controls">
            <label>
              Category
              <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              Status
              <select value={statFilter} onChange={(e) => setStatFilter(e.target.value)}>
                {statuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>
              Priority
              <select value={priFilter} onChange={(e) => setPriFilter(e.target.value)}>
                {priorities.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <button className="hm-clear-btn" onClick={() => { setCatFilter("All"); setStatFilter("All"); setPriFilter("All"); }}>
              Clear Filters
            </button>
          </div>

          {/* LEGEND */}
          <div className="hm-legend">
            {[
              { label: "High Priority", color: "#ef4444" },
              { label: "Medium Priority", color: "#f59e0b" },
              { label: "Low Priority", color: "#22c55e" },
              { label: "Unassigned", color: "#6b7280" },
            ].map((l) => (
              <div key={l.label} className="hm-legend-item">
                <div className="hm-legend-dot" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
            <div className="hm-legend-item">
              <div className="hm-legend-dot" style={{ background: "#ef4444", opacity: 0.25, width:18, height:18 }} />
              Hotspot Area (3+ complaints within 300 m)
            </div>
            <span className="hm-legend-count">{mapped.length} complaint{mapped.length !== 1 ? "s" : ""} on map</span>
          </div>

          {/* MAP */}
          <div className="hm-map-wrapper">
            <div className="hm-map-info">
              <span>
                Showing <span className="hm-showing">{mapped.length}</span> of {filtered.length} filtered complaints
                {hotspots.length > 0 && (
                  <> · <span className="hm-hotspot-note">⚠️ {hotspots.length} hotspot area{hotspots.length !== 1 ? "s" : ""} detected</span></>
                )}
              </span>
              <span style={{ fontSize:"0.8rem", color:"#94a3b8" }}>
                Click any marker for details
              </span>
            </div>

            {loading ? (
              <div className="hm-loading" style={{ height:520, background:"white" }}>
                <div className="hm-spinner" />
                <p style={{ color:"#94a3b8", fontSize:"0.9rem" }}>Loading complaint data…</p>
              </div>
            ) : (
              <MapContainer
                center={[7.8731, 80.7718]}
                zoom={8}
                style={{ height: "560px", width: "100%" }}
                zoomControl={true}
              >
                <FlyToSriLanka />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Hotspot circles */}
                {hotspots.map((hs, i) => (
                  <Circle
                    key={`hs-${i}`}
                    center={[hs.lat, hs.lng]}
                    radius={300}
                    pathOptions={{
                      color: "#ef4444",
                      fillColor: "#ef4444",
                      fillOpacity: 0.12,
                      weight: 2,
                      dashArray: "6 4",
                    }}
                  >
                    <Popup>
                      <div style={{ textAlign:"center", padding:"4px 0" }}>
                        <div style={{ fontSize:"1.4rem", marginBottom:"4px" }}>⚠️</div>
                        <div style={{ fontWeight:700, color:"#dc2626", fontSize:"0.95rem", marginBottom:"4px" }}>
                          Hotspot Area
                        </div>
                        <div style={{ fontSize:"0.85rem", color:"#374151" }}>
                          <strong>{hs.count}</strong> complaints reported<br />within a 300m radius
                        </div>
                      </div>
                    </Popup>
                  </Circle>
                ))}

                {/* Complaint markers */}
                {mapped.map((c) => {
                  const icon = ICONS[c.priority] ?? ICONS.default;
                  const statusColor =
                    c.status === "Resolved"    ? "#10b981" :
                    c.status === "In progress" ? "#3b82f6" : "#f59e0b";

                  return (
                    <Marker
                      key={c.complaint_id}
                      position={[Number(c.latitude), Number(c.longitude)]}
                      icon={icon}
                    >
                      <Popup minWidth={240}>
                        <div className="hm-popup">
                          <div className="hm-popup-title">{c.title}</div>
                          <div className="hm-popup-row">
                            <span className="hm-popup-key">Ref</span>
                            <span className="hm-popup-val">{c.reference_no}</span>
                          </div>
                          <div className="hm-popup-row">
                            <span className="hm-popup-key">Category</span>
                            <span className="hm-popup-val">{c.category}</span>
                          </div>
                          <div className="hm-popup-row">
                            <span className="hm-popup-key">Status</span>
                            <span className="hm-popup-badge" style={{ background: statusColor }}>
                              {c.status}
                            </span>
                          </div>
                          <div className="hm-popup-row">
                            <span className="hm-popup-key">Priority</span>
                            <span className="hm-popup-badge" style={{ background: priorityColor(c.priority) }}>
                              {c.priority || "Not Assigned"}
                            </span>
                          </div>
                          <div className="hm-popup-row">
                            <span className="hm-popup-key">Date</span>
                            <span className="hm-popup-val">{formatDate(c.complaint_date)}</span>
                          </div>
                          {c.location_name && (
                            <div className="hm-popup-row">
                              <span className="hm-popup-key">Location</span>
                              <span className="hm-popup-val" style={{ fontSize:"0.78rem" }}>{c.location_name}</span>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            )}
          </div>

          {/* No results */}
          {!loading && mapped.length === 0 && filtered.length > 0 && (
            <div style={{ textAlign:"center", padding:"32px", color:"#94a3b8", fontSize:"0.95rem", marginTop:"16px" }}>
              ⚠️ {filtered.length} complaint{filtered.length !== 1 ? "s" : ""} matched your filters but none have GPS coordinates yet.
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"32px", color:"#94a3b8", fontSize:"0.95rem", marginTop:"16px" }}>
              No complaints match your selected filters. Try clearing the filters.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
