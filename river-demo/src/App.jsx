import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, X, Droplets, Camera, Layers, Users, Play, Leaf, MessageSquare, Waves } from "lucide-react";

const C = {
  bg: "#F2F5EF",
  bgPanel: "#E8EDE4",
  bgPanelMid: "#EFF3EB",
  river: "#1A6FA8",
  riverMid: "#2E9FDD",
  riverLight: "#72C4F0",
  riverFaint: "#D8EEF9",
  riverGlow: "#1A6FA830",
  sage: "#3A7A3A",
  sageDark: "#2D5C2D",
  sageMid: "#4A9C4A",
  sageLight: "#5AB850",
  sageFaint: "#D8EDD8",
  ochre: "#9A6A10",
  ochreFaint: "#F5E8CC",
  stone: "#5A6A55",
  stoneLight: "#C8D4C0",
  stoneMid: "#8A9885",
  terra: "#804020",
  terraFaint: "#F0E0D5",
  text: "#1A2E18",
  textMid: "#3A5038",
  textLight: "#6A8065",
  textFaint: "#9AAA95",
  canopyDark: "#1A3A1A",
  canopyMid: "#2A5A28",
  canopyBright: "#3A7836",
  canopyLight: "#4A9444",
  canopyHighlight: "#5AB850",
  trunkDark: "#2E1E0E",
  trunkMid: "#3E2A14",
  trunkLight: "#4E361A",
};

const NODES = [
  {
    id: 1, label: "Water Drainage Point", file: "water_drainage_point.jpg",
    desc: "An opening tube that drains runoff into the river. Critical location for contaminant analysis given its direct discharge into the waterway.",
    tag: "Drainage", color: "#1A6FA8", x: 300, y: 102,
    notes: "Pipe visible with active drainage outlet. Priority location for water sampling team.",
  },
  {
    id: 2, label: "River Access Stairs", file: "river_access_stairs.jpg",
    desc: "Stairway providing direct access to the riverbank. High litter accumulation observed in surrounding area, indicating ongoing neglect.",
    tag: "Access Point", color: "#9A6A10", x: 360, y: 192,
    notes: "Used by community members for informal river access. Litter cleanup and signage are recommended next steps.",
  },
  {
    id: 3, label: "Bridge Vantage Point", file: "bridge_vantage_point.jpg",
    desc: "Elevated bridge crossing with a clear view of the river corridor. High foot traffic from pedestrians and families.",
    tag: "Vantage", color: "#3A7A3A", x: 375, y: 302,
    notes: "Good location for public-facing engagement and educational signage. River visibility is strong from this point.",
  },
  {
    id: 4, label: "Industrial Corridor", file: "industrial_corridor.jpg",
    desc: "Riverbank section bordered by warehouses and active construction. Visible signs of industrial activity adjacent to the waterway.",
    tag: "Industrial", color: "#5A6A55", x: 308, y: 395,
    notes: "Multiple active sites in proximity. Recommended for inclusion in water sampling plan due to industrial adjacency.",
  },
  {
    id: 5, label: "Debris Accumulation Site", file: "debris_accumulation_site.jpg",
    desc: "Unmaintained area with significant debris and evidence of illegal dumping. Large discarded items visible along the riverbank.",
    tag: "Debris", color: "#804020", x: 248, y: 480,
    notes: "Illegal dumping observed. Coordination with municipal DPW recommended for cleanup and access restriction.",
  },
];

const PROJECTS = [
  { id: "p1", label: "Project 1", color: "#1A6FA8", teams: ["Community Engagement", "Data Organization", "Data Visualization"] },
  { id: "p2", label: "Project 2", color: "#3A7A3A", teams: ["Water Sampling", "Water Testing", "SASD"] },
  { id: "misc", label: "Misc", color: "#5A6A55", teams: [] },
];

const RIVER_D = "M 296 0 C 282 55, 338 95, 355 158 C 372 222, 325 258, 344 325 C 363 392, 308 428, 280 492 C 262 535, 245 555, 228 580";
const LAYER_TAGS = ["All", "Drainage", "Access Point", "Vantage", "Industrial", "Debris"];

function Tree({ x, y, scale = 1, variant = 0 }) {
  const h = (80 + variant * 12) * scale;
  const tw = (10 + variant * 2) * scale;
  const canopyR = (28 + variant * 6) * scale;
  const colors = [
    { dark: "#1A3A18", mid: "#245C22", bright: "#2E7A2C", light: "#3A9438", highlight: "#48BA46", trunk: "#2A1A08" },
    { dark: "#153318", mid: "#1E5228", bright: "#286E36", light: "#329044", highlight: "#3CB452", trunk: "#221208" },
    { dark: "#1A3E10", mid: "#28621A", bright: "#348026", light: "#42A030", highlight: "#50C43C", trunk: "#1E1606" },
  ][variant % 3];

  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx={tw * 0.3} cy={2 * scale} rx={tw * 0.9} ry={3 * scale} fill="rgba(0,0,0,0.18)" />
      <path
        d={`M ${-tw / 2} 0 C ${-tw * 0.6} ${-h * 0.3} ${-tw * 0.5} ${-h * 0.6} ${-tw * 0.2} ${-h * 0.75} C ${tw * 0.15} ${-h * 0.9} ${tw * 0.5} ${-h * 0.72} ${tw / 2} 0 Z`}
        fill={colors.trunk}
      />
      <path
        d={`M ${-tw * 0.1} 0 C ${-tw * 0.15} ${-h * 0.3} ${-tw * 0.12} ${-h * 0.6} ${-tw * 0.05} ${-h * 0.72}`}
        fill="rgba(255,255,255,0.06)" strokeWidth="0" />
      <ellipse cx={canopyR * 0.12} cy={-h * 0.62} rx={canopyR * 0.7} ry={canopyR * 0.55} fill={colors.dark} />
      <ellipse cx={-canopyR * 0.38} cy={-h * 0.72} rx={canopyR * 0.58} ry={canopyR * 0.48} fill={colors.mid} />
      <ellipse cx={canopyR * 0.32} cy={-h * 0.78} rx={canopyR * 0.62} ry={canopyR * 0.5} fill={colors.mid} />
      <ellipse cx={0} cy={-h * 0.88} rx={canopyR * 0.72} ry={canopyR * 0.6} fill={colors.bright} />
      <ellipse cx={-canopyR * 0.22} cy={-h * 0.95} rx={canopyR * 0.52} ry={canopyR * 0.42} fill={colors.light} />
      <ellipse cx={canopyR * 0.18} cy={-h * 0.98} rx={canopyR * 0.44} ry={canopyR * 0.36} fill={colors.light} />
      <ellipse cx={-canopyR * 0.08} cy={-h * 1.02} rx={canopyR * 0.28} ry={canopyR * 0.22} fill={colors.highlight} />
      <ellipse cx={-canopyR * 0.12} cy={-h * 1.04} rx={canopyR * 0.12} ry={canopyR * 0.09} fill="rgba(255,255,255,0.1)" />
    </g>
  );
}

function Shrub({ x, y, scale = 1, variant = 0 }) {
  const r = (12 + variant * 4) * scale;
  const cols = ["#1E4A1C", "#265C24", "#2E7030", "#3A8838"][variant % 4];
  const colsLight = ["#2A6228", "#347A32", "#3E903E", "#4AAA4A"][variant % 4];
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx={0} cy={2} rx={r * 1.1} ry={r * 0.35} fill="rgba(0,0,0,0.2)" />
      <ellipse cx={-r * 0.4} cy={-r * 0.3} rx={r * 0.7} ry={r * 0.55} fill={cols} />
      <ellipse cx={r * 0.35} cy={-r * 0.2} rx={r * 0.65} ry={r * 0.5} fill={cols} />
      <ellipse cx={0} cy={-r * 0.6} rx={r * 0.75} ry={r * 0.6} fill={colsLight} />
      <ellipse cx={-r * 0.15} cy={-r * 0.9} rx={r * 0.38} ry={r * 0.3} fill="#4AB248" />
    </g>
  );
}

function NodeBubble({ node, isHovered, onClick, onEnter, onLeave }) {
  const SIZE = isHovered ? 72 : 56;
  const HALF = SIZE / 2;
  const TAIL = 12;
  return (
    <g transform={`translate(${node.x},${node.y})`} onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ cursor: "pointer" }}>
      {isHovered && (
        <>
          <circle r={HALF + 26} fill={node.color + "10"} stroke={node.color + "30"} strokeWidth="1.5"
            style={{ animation: "pinRing 2s ease-in-out infinite" }} />
          <circle r={HALF + 14} fill={node.color + "14"} />
        </>
      )}
      <ellipse cx="1" cy={HALF + TAIL + 5} rx={HALF * 0.6} ry={4} fill="rgba(0,0,0,0.22)" />
      <foreignObject x={-HALF} y={-HALF} width={SIZE} height={SIZE} style={{ overflow: "visible" }}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{
          width: SIZE, height: SIZE,
          borderRadius: isHovered ? 16 : 13,
          overflow: "hidden",
          border: `2.5px solid ${node.color}`,
          boxShadow: isHovered
            ? `0 0 0 1px ${node.color}66, 0 8px 30px ${node.color}55, 0 2px 10px rgba(0,0,0,0.3)`
            : `0 4px 14px rgba(0,0,0,0.2), 0 0 0 1px ${node.color}44`,
          transition: "all 0.3s cubic-bezier(0.34,1.42,0.64,1)",
          background: node.color + "22",
        }}>
          <img src={`/${node.file}`} alt={node.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }} />
        </div>
      </foreignObject>
      <polygon points={`-6,${HALF} 6,${HALF} 0,${HALF + TAIL + 3}`} fill={node.color} />
      <polygon points={`-4,${HALF - 1} 4,${HALF - 1} 0,${HALF + TAIL - 1}`} fill="rgba(0,0,0,0.25)" />
      {isHovered && (
        <g transform={`translate(${HALF + 10}, ${-HALF + 14})`}>
          <rect x="-4" y="-14" width={node.label.length * 5.8 + 16} height="22" rx="7"
            fill="white" stroke={node.color + "66"} strokeWidth="1"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15))" }} />
          <text x="4" y="3" fontSize="9.5" fill={node.color} fontFamily="'Lora',Georgia,serif" fontStyle="italic">{node.label}</text>
        </g>
      )}
    </g>
  );
}

function PlaceholderSection({ icon: Icon, label, accentColor }) {
  return (
    <div style={{
      borderRadius: 10, border: `1px dashed ${accentColor}55`,
      background: `linear-gradient(135deg, ${accentColor}0C 0%, transparent 100%)`,
      padding: "14px 16px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "50%", background: accentColor + "08", transform: "translate(30px,-30px)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: accentColor + "18", border: `1px solid ${accentColor}44`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={12} color={accentColor} />
        </div>
        <span style={{ fontSize: 10, color: accentColor, fontFamily: "'Courier New',Courier,monospace", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
          {label}
        </span>
        <span style={{ marginLeft: "auto", fontSize: 9, padding: "2px 8px", borderRadius: 10, background: accentColor + "14", color: accentColor, border: `1px solid ${accentColor}33`, fontFamily: "'Courier New',Courier,monospace" }}>
          Pending
        </span>
      </div>
      <div style={{
        borderRadius: 8, background: "rgba(0,0,0,0.04)",
        border: `1px solid rgba(0,0,0,0.07)`,
        padding: "12px 14px", textAlign: "center",
      }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 9 }}>
          {[48, 62, 38, 55, 44].map((w, i) => (
            <div key={i} style={{ height: 6, width: w, borderRadius: 3, background: accentColor + "22" }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 9 }}>
          {[38, 52, 44, 36].map((w, i) => (
            <div key={i} style={{ height: 6, width: w, borderRadius: 3, background: accentColor + "16" }} />
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 11, color: C.textLight, fontFamily: "'Lora',Georgia,serif", fontStyle: "italic" }}>
          Content coming soon — field notes being compiled
        </p>
      </div>
    </div>
  );
}

export default function RiverDashboard() {
  const [open, setOpen] = useState({ p1: true, p2: false, misc: false });
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [activeLayer, setActiveLayer] = useState("All");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  const openAbout = () => { setAboutOpen(true); setTimeout(() => setAboutVisible(true), 12); };
  const closeAbout = () => { setAboutVisible(false); setTimeout(() => setAboutOpen(false), 380); };

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") { closeModal(); closeAbout(); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const handleMouseMove = (e) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 12,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 8,
    });
  };

  const openModal = (node) => { setSelected(node); setTimeout(() => setModalVisible(true), 12); };
  const closeModal = () => { setModalVisible(false); setTimeout(() => setSelected(null), 420); };
  const toggle = (id) => setOpen(p => ({ ...p, [id]: !p[id] }));

  const serif = "'Playfair Display','Book Antiqua',Palatino,Georgia,serif";
  const body = "'Lora',Palatino,Georgia,serif";
  const mono = "'Courier New',Courier,monospace";

  const trees = [
    { x: 68, y: 140, scale: 1.1, variant: 0 }, { x: 92, y: 115, scale: 0.9, variant: 1 }, { x: 52, y: 160, scale: 0.8, variant: 2 },
    { x: 110, y: 130, scale: 1.0, variant: 0 }, { x: 78, y: 175, scale: 0.85, variant: 1 }, { x: 46, y: 128, scale: 1.2, variant: 2 },
    { x: 498, y: 182, scale: 1.0, variant: 1 }, { x: 520, y: 165, scale: 0.9, variant: 0 }, { x: 476, y: 195, scale: 1.1, variant: 2 },
    { x: 514, y: 200, scale: 0.8, variant: 1 }, { x: 540, y: 178, scale: 0.95, variant: 0 },
    { x: 72, y: 445, scale: 1.0, variant: 2 }, { x: 94, y: 425, scale: 0.88, variant: 0 }, { x: 56, y: 462, scale: 1.1, variant: 1 },
    { x: 110, y: 448, scale: 0.92, variant: 2 }, { x: 44, y: 438, scale: 0.8, variant: 0 },
    { x: 500, y: 440, scale: 0.9, variant: 1 }, { x: 522, y: 420, scale: 1.05, variant: 0 }, { x: 480, y: 455, scale: 0.85, variant: 2 },
    { x: 538, y: 445, scale: 1.0, variant: 1 },
    { x: 165, y: 10, scale: 0.8, variant: 0 }, { x: 188, y: 22, scale: 1.0, variant: 1 }, { x: 145, y: 18, scale: 0.9, variant: 2 },
    { x: 420, y: 255, scale: 0.7, variant: 0 }, { x: 440, y: 270, scale: 0.85, variant: 1 },
    { x: 85, y: 295, scale: 0.75, variant: 2 }, { x: 65, y: 310, scale: 0.8, variant: 0 },
  ];

  const shrubs = [
    { x: 120, y: 145, scale: 0.9, variant: 0 }, { x: 135, y: 162, scale: 0.7, variant: 2 },
    { x: 38, y: 200, scale: 0.8, variant: 1 }, { x: 455, y: 170, scale: 0.85, variant: 0 },
    { x: 462, y: 210, scale: 0.7, variant: 3 }, { x: 558, y: 200, scale: 0.8, variant: 1 },
    { x: 118, y: 470, scale: 0.85, variant: 2 }, { x: 38, y: 480, scale: 0.7, variant: 0 },
    { x: 558, y: 465, scale: 0.8, variant: 1 }, { x: 472, y: 475, scale: 0.9, variant: 3 },
    { x: 200, y: 14, scale: 0.6, variant: 2 }, { x: 140, y: 30, scale: 0.7, variant: 0 },
    { x: 78, y: 330, scale: 0.65, variant: 1 }, { x: 56, y: 285, scale: 0.6, variant: 2 },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      fontFamily: serif, color: C.text,
      display: "flex", flexDirection: "column",
      opacity: loaded ? 1 : 0,
      transform: loaded ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 1.2s ease, transform 1.2s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
        @keyframes pinRing { 0%,100%{opacity:0.5} 50%{opacity:0.1} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rippleFlow { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-60} }
        @keyframes vrPulse { 0%,100%{box-shadow:0 0 0 0 rgba(26,111,168,0.5),0 4px 24px rgba(26,111,168,0.3)} 50%{box-shadow:0 0 0 8px rgba(26,111,168,0),0 4px 24px rgba(26,111,168,0.4)} }
        @keyframes shimmer { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-120} }
        @keyframes vrScanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes vrGlitch { 0%,95%,100%{transform:none;opacity:1} 96%{transform:translateX(-2px);opacity:0.9} 98%{transform:translateX(2px);opacity:0.95} }
        @keyframes vrZoom { 0%{transform:scale(1.08)} 100%{transform:scale(1.14)} }
        @keyframes vrFadeIn { 0%{opacity:0;transform:scale(1.15) translateY(10px)} 100%{opacity:1;transform:scale(1.08) translateY(0)} }
        @keyframes vrText { 0%{opacity:0;letter-spacing:0.3em} 100%{opacity:1;letter-spacing:0.06em} }
        @keyframes pulseRing { 0%{transform:scale(0.9);opacity:0.8} 100%{transform:scale(1.6);opacity:0} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#C8D4C0;border-radius:4px}
        .node-row{transition:all 0.2s ease;border-radius:9px;}
        .node-row:hover{background:rgba(58,80,56,0.08)!important;}
        .layer-btn{transition:all 0.18s ease;border-radius:6px;cursor:pointer;border:none;font-family:'Courier New',Courier,monospace;}
        .vr-btn:hover{transform:translateY(-1px);filter:brightness(1.05);}
        .modal-tab{transition:all 0.18s ease;cursor:pointer;border:none;background:transparent;}
      `}</style>

      {/* HEADER */}
      <header style={{
        padding: "12px 22px 11px",
        background: "rgba(242,245,239,0.97)",
        borderBottom: `1px solid ${C.stoneLight}`,
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", gap: 14,
        zIndex: 50, position: "relative",
        boxShadow: "0 1px 8px rgba(26,46,24,0.08)",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: `1.5px solid ${C.riverMid}55`, background: C.riverFaint,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Droplets size={18} color={C.river} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.text, fontFamily: serif, letterSpacing: "0.015em" }}>
            Second River Environmental Survey
          </h1>
          <p style={{ margin: 0, fontSize: 10.5, color: C.textLight, fontFamily: body, fontStyle: "italic" }}>
            Life on The River Project · Field Node Documentation · 2026
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
          <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: C.sageFaint, color: C.sage, border: `1px solid ${C.stoneLight}`, fontFamily: mono }}>
            5 Active Nodes
          </span>

          <a
            href="https://youtu.be/ot36tM5fNHQ"
            target="_blank"
            rel="noopener noreferrer"
            className="vr-btn"
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 15px", borderRadius: 22,
              background: `linear-gradient(135deg, ${C.river} 0%, #0E5A8C 100%)`,
              color: "white",
              border: `1px solid ${C.riverMid}44`,
              cursor: "pointer",
              fontFamily: mono, fontSize: 10.5,
              letterSpacing: "0.04em",
              textDecoration: "none",
              animation: "vrPulse 2.8s ease-in-out infinite",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Play size={9} color="white" fill="white" />
            </div>
            Watch VR Field Demo
          </a>

          <button
            onClick={openAbout}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 13px", borderRadius: 20,
              background: C.sageFaint, color: C.sage,
              border: `1px solid ${C.stoneLight}`, cursor: "pointer",
              fontFamily: mono, fontSize: 10.5,
              transition: "all 0.18s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#C8E8C4"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.sageFaint; }}
          >
            <Users size={11} />
            About
          </button>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* SIDEBAR */}
        <aside style={{
          width: 258, flexShrink: 0,
          background: C.bgPanel,
          borderRight: `1px solid ${C.stoneLight}`,
          overflowY: "auto", padding: "16px 0 28px",
        }}>
          <p style={{ margin: "0 0 10px 18px", fontSize: 9, color: C.textFaint, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: mono }}>
            Team Structure
          </p>
          {PROJECTS.map((proj) => (
            <div key={proj.id}>
              <button onClick={() => toggle(proj.id)} style={{
                width: "100%", padding: "9px 18px",
                display: "flex", alignItems: "center", gap: 9,
                background: open[proj.id] ? "rgba(58,122,58,0.07)" : "transparent",
                border: "none",
                borderLeft: `3px solid ${open[proj.id] ? proj.color : "transparent"}`,
                cursor: "pointer", textAlign: "left",
                transition: "all 0.22s ease",
              }}>
                {open[proj.id]
                  ? <ChevronDown size={12} color={proj.color} />
                  : <ChevronRight size={12} color={C.textLight} />}
                <span style={{ fontSize: 12.5, fontWeight: 600, color: open[proj.id] ? proj.color : C.textMid, fontFamily: serif, transition: "color 0.2s" }}>
                  {proj.label}
                </span>
                {proj.teams.length > 0 && (
                  <span style={{ marginLeft: "auto", fontSize: 9, background: proj.color + "18", color: proj.color, borderRadius: 10, padding: "1px 6px", fontFamily: mono }}>
                    {proj.teams.length}
                  </span>
                )}
              </button>
              {open[proj.id] && (
                <div style={{ padding: "3px 0 8px 48px", animation: "slideDown 0.22s ease" }}>
                  {proj.teams.length > 0
                    ? proj.teams.map((t) => (
                      <div key={t} style={{ padding: "4px 0 4px 12px", borderLeft: `2px solid ${proj.color}44`, marginBottom: 2 }}>
                        <span style={{ fontSize: 12, color: C.textMid, fontFamily: body }}>{t}</span>
                      </div>
                    ))
                    : <span style={{ fontSize: 11.5, color: C.textLight, fontStyle: "italic", fontFamily: body }}>General items</span>
                  }
                </div>
              )}
              <div style={{ height: 1, background: C.stoneLight, margin: "1px 14px" }} />
            </div>
          ))}

          {/* Node list */}
          <div style={{ marginTop: 18, padding: "0 12px" }}>
            <p style={{ margin: "0 0 8px 4px", fontSize: 9, color: C.textFaint, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: mono }}>
              Survey Nodes
            </p>
            {NODES.map((node) => {
              const isHov = hovered === node.id;
              return (
                <div key={node.id} className="node-row"
                  onClick={() => openModal(node)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "6px 8px", cursor: "pointer", marginBottom: 3,
                    border: `1px solid ${isHov ? C.stoneLight : "transparent"}`,
                  }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 7, overflow: "hidden", flexShrink: 0,
                    border: `1.5px solid ${node.color}55`, background: node.color + "14",
                  }}>
                    <img src={`/${node.file}`} alt={node.label}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, color: isHov ? C.text : C.textMid, fontFamily: body, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "color 0.18s" }}>
                      {node.label}
                    </div>
                    <div style={{ fontSize: 9, color: node.color, fontFamily: mono, letterSpacing: "0.04em", marginTop: 1 }}>
                      {node.tag}
                    </div>
                  </div>
                  <ChevronRight size={10} color={isHov ? C.river : C.stoneLight} />
                </div>
              );
            })}
          </div>
        </aside>

        {/* MAP */}
        <main
          ref={mapRef}
          onMouseMove={handleMouseMove}
          style={{
            flex: 1, position: "relative", overflow: "hidden",
            background: "#D8E8D0",
          }}
        >
          {/* Atmospheric background */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 75% 60% at 48% 42%, #C8DCC0 0%, #BED4B5 100%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 60% 40% at 52% 38%, rgba(120,190,120,0.15) 0%, transparent 70%)",
          }} />
          {/* Subtle vignette */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5,
            background: "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 50%, rgba(120,160,100,0.2) 100%)",
          }} />

          {/* Parallax container */}
          <div style={{
            position: "absolute", inset: 0,
            transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
            transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}>
            {/* Layer filter */}
            <div style={{
              position: "absolute", top: 14, left: 16, zIndex: 10,
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(242,245,239,0.94)",
              borderRadius: 10, padding: "5px 8px",
              border: `1px solid ${C.stoneLight}`,
              backdropFilter: "blur(6px)",
              boxShadow: "0 2px 12px rgba(26,46,24,0.1)",
            }}>
              <Layers size={10} color={C.textLight} style={{ flexShrink: 0, marginRight: 2 }} />
              {LAYER_TAGS.map((tag) => (
                <button key={tag} className="layer-btn"
                  onClick={() => setActiveLayer(tag)}
                  style={{
                    fontSize: 9.5, padding: "3px 9px", letterSpacing: "0.04em",
                    background: activeLayer === tag ? C.river : "transparent",
                    color: activeLayer === tag ? "white" : C.textMid,
                    border: activeLayer === tag ? "none" : `1px solid ${C.stoneLight}`,
                  }}>
                  {tag}
                </button>
              ))}
            </div>

            <svg viewBox="0 0 580 570" style={{ width: "100%", height: "100%", display: "block" }}>
              <defs>
                <filter id="glow" x="-60%" y="-30%" width="220%" height="160%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glowSoft" x="-40%" y="-20%" width="180%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="softDrop">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(26,46,24,0.2)" />
                </filter>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8DCC0" />
                  <stop offset="100%" stopColor="#BED4B5" />
                </linearGradient>
                <pattern id="ripple" x="0" y="0" width="36" height="9" patternUnits="userSpaceOnUse">
                  <path d="M 0 4.5 Q 9 2, 18 4.5 Q 27 7, 36 4.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.9" />
                </pattern>
                <pattern id="ripple2" x="0" y="0" width="28" height="7" patternUnits="userSpaceOnUse">
                  <path d="M 0 3.5 Q 7 1.5, 14 3.5 Q 21 5.5, 28 3.5" fill="none" stroke="rgba(46,159,221,0.3)" strokeWidth="0.7" />
                </pattern>
                <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8DCC0" />
                  <stop offset="100%" stopColor="#B8D0AE" />
                </linearGradient>
              </defs>

              {/* Ground fill */}
              <rect x="0" y="0" width="580" height="570" fill="url(#groundGrad)" />

              {/* Ground texture patches */}
              {[[50,200,120,80],[430,180,100,70],[60,390,130,85],[440,400,110,75],[250,510,160,45]].map(([cx,cy,rx,ry],i) => (
                <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
                  fill={i % 2 === 0 ? "#C0D8B8" : "#C4DCC0"} />
              ))}

              {/* Roads */}
              <path d="M 0 295 Q 180 280 300 295 Q 420 310 580 295" fill="none" stroke="#A8B8A0" strokeWidth="8" strokeLinecap="round" />
              <path d="M 0 295 Q 180 280 300 295 Q 420 310 580 295" fill="none" stroke="#B4C4AC" strokeWidth="5" strokeLinecap="round" strokeDasharray="24 8" />
              <path d="M 148 0 Q 155 190 148 395 Q 145 480 152 570" fill="none" stroke="#A8B8A0" strokeWidth="7" strokeLinecap="round" />
              <path d="M 148 0 Q 155 190 148 395 Q 145 480 152 570" fill="none" stroke="#B4C4AC" strokeWidth="4" strokeLinecap="round" strokeDasharray="20 7" />
              <text x="42" y="289" fontSize="7" fill="#7A9075" fontFamily="monospace" opacity="0.8">BROADWAY</text>
              <g transform="translate(152,35) rotate(90)">
                <text fontSize="7" fill="#7A9075" fontFamily="monospace" opacity="0.8">BELLEVILLE AVE</text>
              </g>

              {/* Industrial zone */}
              <rect x="438" y="340" width="110" height="72" rx="4"
                fill="#B8C8B0" stroke="#90A888" strokeWidth="1" strokeDasharray="5 3" />
              {[[448,360],[500,360],[552,360],[448,380],[500,380],[552,380],[448,400],[500,400]].map(([bx,by],i) => (
                <rect key={i} x={bx} y={by} width={i%3===0?18:14} height={10} rx="1" fill="#A8B8A0" stroke="#98A890" strokeWidth="0.5" />
              ))}
              <text x="493" y="378" textAnchor="middle" fontSize="6.5" fill="#6A7A65" fontFamily="monospace">INDUSTRIAL ZONE</text>

              {/* TREES */}
              {[...trees].sort((a, b) => a.y - b.y).map((t, i) => (
                <Tree key={`tree-${i}`} {...t} />
              ))}

              {/* SHRUBS */}
              {shrubs.map((s, i) => (
                <Shrub key={`shrub-${i}`} {...s} />
              ))}

              {/* River layers */}
              <path d={RIVER_D} fill="none" stroke="rgba(10,60,100,0.15)" strokeWidth="58" strokeLinecap="round" />
              <path d={RIVER_D} fill="none" stroke="rgba(20,90,150,0.55)" strokeWidth="48" strokeLinecap="round" />
              <path d={RIVER_D} fill="none" stroke="rgba(26,111,168,0.75)" strokeWidth="34" strokeLinecap="round" />
              <path d={RIVER_D} fill="none" stroke="rgba(46,159,221,0.5)" strokeWidth="20" strokeLinecap="round" />
              {/* Shimmer */}
              <path d={RIVER_D} fill="none" stroke="url(#ripple)" strokeWidth="44" strokeLinecap="round" />
              <path d={RIVER_D} fill="none" stroke="url(#ripple2)" strokeWidth="28" strokeLinecap="round"
                style={{ animation: "shimmer 4s linear infinite" }} />
              {/* Highlight */}
              <path d={RIVER_D} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" strokeDasharray="30 18"
                style={{ animation: "rippleFlow 3s linear infinite" }} />
              <path d={RIVER_D} fill="none" stroke="rgba(114,196,240,0.5)" strokeWidth="1.5" strokeLinecap="round" />

              {/* Mossy bank edge */}
              <path d={RIVER_D} fill="none" stroke="#2A5A28" strokeWidth="56" strokeLinecap="round" opacity="0.12" filter="url(#glowSoft)" />

              {/* Flow arrows */}
              {[[296,78,12],[355,158,18],[347,305,-8],[283,468,-18]].map(([x,y,rot],i) => (
                <g key={i} transform={`translate(${x},${y}) rotate(${rot + 90})`} opacity="0.6">
                  <polygon points="0,-6 4,2.5 -4,2.5" fill="rgba(255,255,255,0.7)" />
                </g>
              ))}

              {/* River label */}
              <g transform="translate(402,248) rotate(34)">
                <text fontSize="10.5" fill="rgba(255,255,255,0.7)" fontFamily="'Playfair Display','Book Antiqua',Georgia,serif" fontStyle="italic"
                  style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}>
                  Second River
                </text>
              </g>

              {/* Extra bank trees */}
              {[
                { x: 200, y: 90, scale: 0.72, variant: 0 },
                { x: 222, y: 80, scale: 0.65, variant: 2 },
                { x: 415, y: 140, scale: 0.68, variant: 1 },
                { x: 394, y: 155, scale: 0.6, variant: 0 },
                { x: 160, y: 340, scale: 0.7, variant: 2 },
                { x: 178, y: 328, scale: 0.58, variant: 1 },
                { x: 388, y: 380, scale: 0.66, variant: 0 },
                { x: 408, y: 368, scale: 0.58, variant: 2 },
                { x: 172, y: 510, scale: 0.62, variant: 1 },
                { x: 192, y: 498, scale: 0.55, variant: 0 },
              ].map((t, i) => <Tree key={`bt-${i}`} {...t} />)}

              {/* Nodes */}
              {NODES.map((node) => {
                const visible = activeLayer === "All" || node.tag === activeLayer;
                return (
                  <g key={node.id} style={{ opacity: visible ? 1 : 0.15, transition: "opacity 0.3s ease" }}>
                    <NodeBubble
                      node={node}
                      isHovered={hovered === node.id}
                      onClick={() => openModal(node)}
                      onEnter={() => setHovered(node.id)}
                      onLeave={() => setHovered(null)}
                    />
                  </g>
                );
              })}

              {/* Compass */}
              <g transform="translate(535, 48)" filter="url(#softDrop)">
                <circle r="22" fill="rgba(242,245,239,0.95)" stroke={C.stoneLight} strokeWidth="1" />
                <circle r="19" fill="transparent" stroke={C.stoneLight} strokeWidth="0.5" />
                <polygon points="0,-15 3,-4 -3,-4" fill={C.river} />
                <polygon points="0,15 3,4 -3,4" fill={C.stoneMid} opacity="0.5" />
                <polygon points="-15,0 -4,3 -4,-3" fill={C.stoneMid} opacity="0.5" />
                <polygon points="15,0 4,3 4,-3" fill={C.stoneMid} opacity="0.5" />
                <circle r="3" fill="white" stroke={C.river} strokeWidth="1.2" />
                <text x="0" y="-19" textAnchor="middle" fontSize="8" fontWeight="bold" fill={C.river} fontFamily="serif">N</text>
              </g>

              {/* Scale bar */}
              <g transform="translate(28, 538)">
                <rect x="0" y="-3" width="70" height="6" rx="3" fill={C.stoneLight} />
                <rect x="0" y="-3" width="35" height="6" rx="2" fill={C.stoneMid} opacity="0.5" />
                <text x="35" y="-9" textAnchor="middle" fontSize="7.5" fill={C.textMid} fontFamily="monospace">500 m</text>
              </g>
            </svg>
          </div>

          <p style={{ position: "absolute", bottom: 14, right: 18, fontSize: 10, color: C.textLight, fontFamily: body, fontStyle: "italic", margin: 0, zIndex: 10 }}>
            Click a node to view field data →
          </p>
        </main>
      </div>

      {/* VR-STYLE NODE MODAL */}
      {selected && (
        <div onClick={closeModal} style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: modalVisible ? "rgba(4,12,6,0.88)" : "rgba(4,12,6,0)",
          backdropFilter: modalVisible ? "blur(8px) saturate(0.5)" : "none",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
          overflowY: "auto",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: 680, maxWidth: "96vw",
            background: "white",
            borderRadius: 8,
            border: `1px solid ${selected.color}33`,
            boxShadow: `0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px ${selected.color}22, 0 0 80px ${selected.color}22`,
            position: "relative", overflow: "hidden",
            transform: modalVisible ? "scale(1) translateY(0)" : "scale(0.86) translateY(48px)",
            opacity: modalVisible ? 1 : 0,
            transition: "all 0.55s cubic-bezier(0.34, 1.42, 0.64, 1)",
            maxHeight: "92vh", overflowY: "auto",
          }}>

            {/* VR HERO IMAGE — full-width cinematic */}
            <div style={{
              position: "relative", width: "100%", height: 320, overflow: "hidden",
              background: `linear-gradient(135deg, ${selected.color}33 0%, #0A1A0F 100%)`,
            }}>
              <img
                src={`/${selected.file}`}
                alt={selected.label}
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  display: "block",
                  animation: modalVisible ? "vrZoom 12s ease-in-out infinite alternate" : "none",
                  transformOrigin: "center center",
                  filter: "saturate(1.15) contrast(1.05)",
                }}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />

              {/* Gradient overlays for cinematic feel */}
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.72) 100%)`,
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(to right, ${selected.color}22 0%, transparent 40%)`,
                pointerEvents: "none",
              }} />

              {/* VR scan line effect */}
              <div style={{
                position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
                opacity: 0.25,
              }}>
                <div style={{
                  position: "absolute", left: 0, right: 0, height: "2px",
                  background: `linear-gradient(to right, transparent, ${selected.color}88, transparent)`,
                  animation: "vrScanline 3s linear infinite",
                }} />
              </div>

              {/* Corner bracket — VR UI feel */}
              {[
                { top: 12, left: 12, borderTop: `2px solid ${selected.color}`, borderLeft: `2px solid ${selected.color}` },
                { top: 12, right: 12, borderTop: `2px solid ${selected.color}`, borderRight: `2px solid ${selected.color}` },
                { bottom: 12, left: 12, borderBottom: `2px solid ${selected.color}`, borderLeft: `2px solid ${selected.color}` },
                { bottom: 12, right: 12, borderBottom: `2px solid ${selected.color}`, borderRight: `2px solid ${selected.color}` },
              ].map((style, i) => (
                <div key={i} style={{
                  position: "absolute", width: 22, height: 22,
                  opacity: modalVisible ? 0.85 : 0,
                  transition: `opacity 0.3s ease ${0.3 + i * 0.06}s`,
                  ...style,
                }} />
              ))}

              {/* VR status badge */}
              <div style={{
                position: "absolute", top: 14, left: 14,
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 11px", borderRadius: 20,
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(6px)",
                border: `1px solid ${selected.color}55`,
                opacity: modalVisible ? 1 : 0,
                transition: "opacity 0.4s ease 0.4s",
              }}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: selected.color,
                  boxShadow: `0 0 6px ${selected.color}`,
                  animation: "vrPulse 1.8s ease-in-out infinite",
                }} />
                <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.9)", fontFamily: mono, letterSpacing: "0.1em" }}>
                  FIELD NODE
                </span>
              </div>

              {/* Node info overlay (bottom of hero) */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "20px 22px 18px",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "3px 11px", borderRadius: 20,
                  background: selected.color + "33",
                  backdropFilter: "blur(4px)",
                  border: `1px solid ${selected.color}66`,
                  marginBottom: 8,
                }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.9)", fontFamily: mono, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {selected.tag}
                  </span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: mono }}>
                    · Node #{String(selected.id).padStart(2, "0")}
                  </span>
                </div>
                <h2 style={{
                  margin: 0, fontSize: 22, fontWeight: 700, color: "white",
                  fontFamily: serif, lineHeight: 1.2,
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                  animation: modalVisible ? "vrText 0.6s ease 0.2s both" : "none",
                }}>
                  {selected.label}
                </h2>
              </div>

              {/* Close */}
              <button onClick={closeModal} style={{
                position: "absolute", top: 11, right: 11, zIndex: 10,
                background: "rgba(0,0,0,0.45)", border: `1px solid rgba(255,255,255,0.2)`,
                borderRadius: "50%", width: 30, height: 30,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "background 0.18s",
                backdropFilter: "blur(4px)",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.65)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}>
                <X size={13} color="white" />
              </button>
            </div>

            {/* Color accent bar */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${selected.color} 0%, ${selected.color}44 60%, transparent 100%)` }} />

            {/* Description */}
            <div style={{ padding: "18px 22px 14px" }}>
              <p style={{ margin: 0, fontSize: 13.5, color: C.textMid, fontFamily: body, fontStyle: "italic", lineHeight: 1.78 }}>
                {selected.desc}
              </p>
            </div>

            {/* Field notes */}
            <div style={{ padding: "13px 22px", borderTop: `1px solid ${C.stoneLight}`, background: C.bg }}>
              <p style={{ margin: "0 0 6px", fontSize: 9, color: C.textFaint, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.14em" }}>Field Notes</p>
              <p style={{ margin: 0, fontSize: 13, color: C.text, fontFamily: body, lineHeight: 1.78 }}>{selected.notes}</p>
            </div>

            {/* Placeholder sections */}
            <div style={{ padding: "14px 22px 20px", borderTop: `1px solid ${C.stoneLight}`, display: "flex", flexDirection: "column", gap: 12 }}>
              <PlaceholderSection
                icon={MessageSquare}
                label="Community Engagement"
                accentColor={C.sage}
              />
              <PlaceholderSection
                icon={Waves}
                label="Water Quality"
                accentColor={C.river}
              />
              <PlaceholderSection
                icon={Leaf}
                label="Biochar Applications"
                accentColor={C.ochre}
              />
            </div>

            {/* Footer */}
            <div style={{
              borderTop: `1px solid ${C.stoneLight}`,
              padding: "8px 22px",
              background: C.bgPanel,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Camera size={10} color={C.textLight} opacity={0.6} />
              <code style={{ fontSize: 10.5, fontFamily: mono, color: selected.color, fontWeight: 600, letterSpacing: "0.04em" }}>
                {selected.file}
              </code>
              <span style={{ marginLeft: "auto", fontSize: 9, color: C.textLight, fontFamily: mono }}>
                Data Org · Second River Survey · 2026
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT MODAL */}
      {aboutOpen && (
        <div onClick={closeAbout} style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: aboutVisible ? "rgba(4,12,6,0.72)" : "rgba(4,12,6,0)",
          backdropFilter: aboutVisible ? "blur(6px) saturate(0.6)" : "none",
          transition: "background 0.35s ease, backdrop-filter 0.35s ease",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: 570, maxWidth: "94vw",
            background: "white", borderRadius: 8,
            border: `1px solid ${C.stoneLight}`,
            boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
            position: "relative", overflow: "hidden",
            transform: aboutVisible ? "scale(1) translateY(0)" : "scale(0.88) translateY(30px)",
            opacity: aboutVisible ? 1 : 0,
            transition: "all 0.45s cubic-bezier(0.34, 1.42, 0.64, 1)",
          }}>
            <div style={{ height: 3, background: `linear-gradient(90deg, ${C.river} 0%, ${C.sage} 50%, transparent 100%)` }} />
            <button onClick={closeAbout} style={{
              position: "absolute", top: 11, right: 11, zIndex: 10,
              background: "rgba(58,80,56,0.06)", border: `1px solid ${C.stoneLight}`,
              borderRadius: "50%", width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "background 0.18s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(58,80,56,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(58,80,56,0.06)"}>
              <X size={13} color={C.textMid} />
            </button>

            {/* Header */}
            <div style={{
              padding: "20px 24px 18px",
              background: `linear-gradient(135deg, ${C.riverFaint} 0%, ${C.sageFaint} 100%)`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, borderRadius: "50%", border: `1.5px solid ${C.river}18` }} />
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: C.riverFaint, border: `1.5px solid ${C.river}44`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Droplets size={20} color={C.river} />
                </div>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 9, color: C.textLight, fontFamily: mono, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Project 1 · ENGR493 / STS403
                  </p>
                  <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: C.text, fontFamily: serif, lineHeight: 1.2 }}>
                    The Virtual River
                  </h2>
                  <p style={{ margin: 0, fontSize: 12, color: C.textMid, fontFamily: body, fontStyle: "italic" }}>
                    Digital Storytelling and VR Exploration
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: "18px 24px 22px" }}>
              <div style={{
                padding: "10px 14px", borderRadius: 8, marginBottom: 18,
                background: C.riverFaint, border: `1px solid ${C.river}33`,
              }}>
                <p style={{ margin: "0 0 2px", fontSize: 11.5, fontWeight: 600, color: C.river, fontFamily: serif }}>Albert Dorman Honors College</p>
                <p style={{ margin: 0, fontSize: 11, color: C.textMid, fontFamily: body }}>New Jersey Institute of Technology</p>
              </div>

              <div style={{ marginBottom: 18 }}>
                <p style={{ margin: "0 0 8px", fontSize: 9, color: C.textFaint, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.14em" }}>Faculty Advisors</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Dr. Ashish Borgaonkar", "Dr. Emily Tancredi-Brice Agbenyega"].map((name) => (
                    <div key={name} style={{
                      flex: 1, padding: "9px 12px", borderRadius: 8,
                      background: C.bg, border: `1px solid ${C.stoneLight}`,
                    }}>
                      <p style={{ margin: "0 0 1px", fontSize: 9, color: C.textFaint, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.08em" }}>Advisor</p>
                      <p style={{ margin: 0, fontSize: 11.5, color: C.text, fontFamily: body, fontWeight: 500 }}>{name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ margin: "0 0 10px", fontSize: 9, color: C.textFaint, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.14em" }}>Project Members</p>
                {[
                  { role: "Data & VR Team", color: C.river, members: ["Jane Kalla", "Lakshita Madhavan", "Pooja Datir", "Rohit Datir"] },
                  { role: "Community Engagement", color: C.sage, members: ["Julia Navarro"] },
                  { role: "Legal Studies", color: C.stone, members: ["Anastasiia Volynska", "Haripriya Kemisetti"] },
                ].map(({ role, color, members }) => (
                  <div key={role} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 10.5, color: C.textMid, fontFamily: mono, letterSpacing: "0.06em" }}>{role}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 14 }}>
                      {members.map((name) => (
                        <span key={name} style={{
                          fontSize: 12, padding: "4px 12px", borderRadius: 20,
                          background: color + "14", color: C.text,
                          border: `1px solid ${color}30`, fontFamily: body,
                        }}>{name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              borderTop: `1px solid ${C.stoneLight}`, padding: "8px 24px",
              background: C.bgPanel, display: "flex", alignItems: "center",
            }}>
              <span style={{ fontSize: 9.5, color: C.textLight, fontFamily: mono }}>Second River Environmental Survey · 2026</span>
              <span style={{ marginLeft: "auto", fontSize: 9.5, color: C.textLight, fontFamily: mono }}>NJIT · ADHC</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}