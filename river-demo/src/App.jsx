import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, X, Droplets, Camera, Layers, Users } from "lucide-react";

const C = {
  bg: "#F3EDE0",
  bgPanel: "#EDE5D4",
  river: "#2A5A82",
  riverMid: "#4A84B8",
  riverLight: "#B8D4EC",
  riverFaint: "#DFF0FF",
  sage: "#6B9C6A",
  sageDark: "#3D6B3C",
  sageLight: "#C8DFC5",
  ochre: "#C48A20",
  stone: "#8A8278",
  stoneLight: "#D8D2C8",
  terra: "#B05838",
  text: "#2A2520",
  textMid: "#5C5650",
  textLight: "#9A948C",
};

// Only confirmed, observed data — no fabricated metrics
const NODES = [
  {
    id: 1,
    label: "Water Drainage Point",
    file: "water_drainage_point.jpg",
    desc: "An opening tube that drains runoff into the river. Critical location for contaminant analysis given its direct discharge into the waterway.",
    tag: "Drainage",
    color: C.river,
    x: 300, y: 102,
    notes: "Pipe visible with active drainage outlet. Priority location for water sampling team.",
  },
  {
    id: 2,
    label: "River Access Stairs",
    file: "river_access_stairs.jpg",
    desc: "Stairway providing direct access to the riverbank. High litter accumulation observed in surrounding area, indicating ongoing neglect.",
    tag: "Access Point",
    color: C.ochre,
    x: 360, y: 192,
    notes: "Used by community members for informal river access. Litter cleanup and signage are recommended next steps.",
  },
  {
    id: 3,
    label: "Bridge Vantage Point",
    file: "bridge_vantage_point.jpg",
    desc: "Elevated bridge crossing with a clear view of the river corridor. High foot traffic from pedestrians and families.",
    tag: "Vantage",
    color: C.sage,
    x: 375, y: 302,
    notes: "Good location for public-facing engagement and educational signage. River visibility is strong from this point.",
  },
  {
    id: 4,
    label: "Industrial Corridor",
    file: "industrial_corridor.jpg",
    desc: "Riverbank section bordered by warehouses and active construction. Visible signs of industrial activity adjacent to the waterway.",
    tag: "Industrial",
    color: C.stone,
    x: 308, y: 395,
    notes: "Multiple active sites in proximity. Recommended for inclusion in water sampling plan due to industrial adjacency.",
  },
  {
    id: 5,
    label: "Debris Accumulation Site",
    file: "debris_accumulation_site.jpg",
    desc: "Unmaintained area with significant debris and evidence of illegal dumping. Large discarded items visible along the riverbank.",
    tag: "Debris",
    color: C.terra,
    x: 248, y: 480,
    notes: "Illegal dumping observed. Coordination with municipal DPW recommended for cleanup and access restriction.",
  },
];

const PROJECTS = [
  { id: "p1", label: "Project 1", color: C.river, teams: ["Community Engagement", "Data Organization", "Data Visualization"] },
  { id: "p2", label: "Project 2", color: C.sage, teams: ["Water Sampling", "Water Testing", "SASD"] },
  { id: "misc", label: "Misc", color: C.stone, teams: [] },
];

const RIVER_D = "M 296 0 C 282 55, 338 95, 355 158 C 372 222, 325 258, 344 325 C 363 392, 308 428, 280 492 C 262 535, 245 555, 228 580";

const LAYER_TAGS = ["All", "Drainage", "Access Point", "Vantage", "Industrial", "Debris"];

function NodeBubble({ node, isHovered, onClick, onEnter, onLeave }) {
  const SIZE = isHovered ? 54 : 40;
  const HALF = SIZE / 2;
  const TAIL = 9;

  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ cursor: "pointer" }}
    >
      {isHovered && (
        <>
          <circle r={HALF + 16} fill={node.color + "10"} stroke={node.color + "38"} strokeWidth="1"
            style={{ animation: "pinRing 1.6s ease-in-out infinite" }} />
          <circle r={HALF + 8} fill={node.color + "12"} />
        </>
      )}

      <ellipse cx="1" cy={HALF + TAIL + 4} rx={HALF * 0.65} ry={3.5} fill="rgba(0,0,0,0.18)" />

      <foreignObject x={-HALF} y={-HALF} width={SIZE} height={SIZE} style={{ overflow: "visible" }}>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            width: SIZE, height: SIZE,
            borderRadius: isHovered ? 13 : 10,
            overflow: "hidden",
            border: `2.5px solid ${node.color}`,
            boxShadow: isHovered
              ? `0 6px 24px ${node.color}55, 0 2px 8px rgba(0,0,0,0.2)`
              : `0 3px 10px rgba(0,0,0,0.22)`,
            transition: "all 0.28s cubic-bezier(0.34,1.42,0.64,1)",
            background: node.color + "18",
          }}
        >
          <img
            src={`/${node.file}`}
            alt={node.label}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
      </foreignObject>

      {/* Tail */}
      <polygon points={`-5,${HALF} 5,${HALF} 0,${HALF + TAIL + 2}`} fill={node.color} />
      <polygon points={`-3.5,${HALF - 1} 3.5,${HALF - 1} 0,${HALF + TAIL - 1}`} fill="white" />
      <polygon points={`-2.5,${HALF - 1} 2.5,${HALF - 1} 0,${HALF + TAIL - 2}`} fill={node.color} />

      {isHovered && (
        <g transform={`translate(${HALF + 7}, ${-HALF + 10})`}>
          <rect
            x="-4" y="-12"
            width={node.label.length * 5.5 + 14}
            height="18" rx="5"
            fill="white" stroke={node.color + "44"} strokeWidth="1"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.10))" }}
          />
          <text x="3" y="2" fontSize="9" fill={C.textMid}
            fontFamily="'Lora',Georgia,serif" fontStyle="italic">
            {node.label}
          </text>
        </g>
      )}
    </g>
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

  const openAbout = () => { setAboutOpen(true); setTimeout(() => setAboutVisible(true), 12); };
  const closeAbout = () => { setAboutVisible(false); setTimeout(() => setAboutOpen(false), 380); };

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") { closeModal(); closeAbout(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const openModal = (node) => { setSelected(node); setTimeout(() => setModalVisible(true), 12); };
  const closeModal = () => { setModalVisible(false); setTimeout(() => setSelected(null), 400); };
  const toggle = (id) => setOpen(p => ({ ...p, [id]: !p[id] }));

  const serif = "'Playfair Display','Book Antiqua',Palatino,Georgia,serif";
  const body = "'Lora',Palatino,Georgia,serif";
  const mono = "'Courier New',Courier,monospace";

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      fontFamily: serif, color: C.text,
      display: "flex", flexDirection: "column",
      opacity: loaded ? 1 : 0,
      transform: loaded ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 1s ease, transform 1s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
        @keyframes pinRing { 0%,100%{r:62;opacity:0.28} 50%{r:78;opacity:0.07} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rippleFlow { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-60} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${C.stoneLight};border-radius:4px}
        .node-row { transition:all 0.18s ease; border-radius:8px; }
        .node-row:hover { background:rgba(255,255,255,0.62) !important; }
        .layer-btn { transition:all 0.18s ease; border-radius:6px; cursor:pointer; border:none; font-family:${mono}; }
      `}</style>

      {/* HEADER */}
      <header style={{
        padding: "14px 24px 12px",
        background: "rgba(255,255,255,0.68)",
        borderBottom: `1px solid ${C.stoneLight}`,
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          border: `2px solid ${C.riverMid}`, background: C.riverFaint,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Droplets size={19} color={C.river} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.river, fontFamily: serif, letterSpacing: "0.015em" }}>
            Second River Environmental Survey
          </h1>
          <p style={{ margin: 0, fontSize: 11, color: C.textMid, fontFamily: body, fontStyle: "italic" }}>
            Life on The River Project· Field Node Documentation · 2026
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
          <span style={{ fontSize: 10.5, padding: "3px 11px", borderRadius: 20, background: C.sageLight, color: C.sageDark, border: `1px solid ${C.sage}88`, fontFamily: mono }}>
            5 Active Nodes
          </span>
          <span style={{ fontSize: 10.5, padding: "3px 11px", borderRadius: 20, background: C.riverFaint, color: C.river, border: `1px solid ${C.riverLight}`, fontFamily: mono }}>
            Second River
          </span>
          <button
            onClick={openAbout}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 13px", borderRadius: 20,
              background: C.river, color: "white",
              border: "none", cursor: "pointer",
              fontFamily: mono, fontSize: 10.5,
              letterSpacing: "0.04em",
              boxShadow: `0 2px 10px ${C.river}44`,
              transition: "all 0.18s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.riverMid}
            onMouseLeave={e => e.currentTarget.style.background = C.river}
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
          width: 262, flexShrink: 0,
          background: C.bgPanel,
          borderRight: `1px solid ${C.stoneLight}`,
          overflowY: "auto",
          padding: "16px 0 28px",
        }}>
          <p style={{ margin: "0 0 10px 18px", fontSize: 9, color: C.textLight, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: mono }}>
            Team Structure
          </p>

          {PROJECTS.map((proj) => (
            <div key={proj.id}>
              <button onClick={() => toggle(proj.id)} style={{
                width: "100%", padding: "9px 18px",
                display: "flex", alignItems: "center", gap: 9,
                background: open[proj.id] ? "rgba(42,90,130,0.07)" : "transparent",
                border: "none",
                borderLeft: `3px solid ${open[proj.id] ? proj.color : "transparent"}`,
                cursor: "pointer", textAlign: "left",
                transition: "all 0.22s ease",
              }}>
                {open[proj.id]
                  ? <ChevronDown size={12} color={proj.color} />
                  : <ChevronRight size={12} color={C.stone} />}
                <span style={{ fontSize: 12.5, fontWeight: 600, color: open[proj.id] ? proj.color : C.text, fontFamily: serif, transition: "color 0.2s" }}>
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
              <div style={{ height: 1, background: C.stoneLight, margin: "1px 16px" }} />
            </div>
          ))}

          {/* Node list */}
          <div style={{ marginTop: 18, padding: "0 12px" }}>
            <p style={{ margin: "0 0 8px 4px", fontSize: 9, color: C.textLight, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: mono }}>
              Survey Nodes
            </p>
            {NODES.map((node) => {
              const isHov = hovered === node.id;
              return (
                <div
                  key={node.id}
                  className="node-row"
                  onClick={() => openModal(node)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "6px 8px", cursor: "pointer", marginBottom: 3,
                    border: `1px solid ${isHov ? C.stoneLight : "transparent"}`,
                    background: isHov ? "rgba(255,255,255,0.62)" : "transparent",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 7, overflow: "hidden", flexShrink: 0,
                    border: `1.5px solid ${node.color}55`, background: node.color + "12",
                  }}>
                    <img
                      src={`/${node.file}`}
                      alt={node.label}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
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
        <main style={{
          flex: 1, position: "relative", overflow: "hidden",
          background: `radial-gradient(ellipse 80% 70% at 55% 44%, #EBF5EE 0%, ${C.bg} 100%)`,
        }}>
          {/* Layer filter */}
          <div style={{
            position: "absolute", top: 14, left: 16, zIndex: 10,
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.84)",
            borderRadius: 10, padding: "5px 8px",
            border: `1px solid ${C.stoneLight}`,
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}>
            <Layers size={10} color={C.textLight} style={{ flexShrink: 0, marginRight: 2 }} />
            {LAYER_TAGS.map((tag) => (
              <button
                key={tag}
                className="layer-btn"
                onClick={() => setActiveLayer(tag)}
                style={{
                  fontSize: 9.5, padding: "3px 9px", letterSpacing: "0.04em",
                  background: activeLayer === tag ? C.river : "transparent",
                  color: activeLayer === tag ? "white" : C.textMid,
                  border: activeLayer === tag ? "none" : `1px solid ${C.stoneLight}`,
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Topo rings */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.065, pointerEvents: "none" }}>
            {[1.0, 1.55, 2.1, 2.65, 3.2].map((s, i) => (
              <ellipse key={i} cx="52%" cy="46%" rx={`${18 * s}%`} ry={`${11 * s}%`}
                fill="none" stroke={C.sage} strokeWidth="1.2" />
            ))}
          </svg>

          <svg viewBox="0 0 580 570" style={{ width: "100%", height: "100%", display: "block" }}>
            <defs>
              <filter id="glow" x="-50%" y="-20%" width="200%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="softDrop" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
              </filter>
              <linearGradient id="vegGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={C.sageLight} stopOpacity="0.65" />
                <stop offset="100%" stopColor={C.sageLight} stopOpacity="0.2" />
              </linearGradient>
              <pattern id="ripple" x="0" y="0" width="32" height="8" patternUnits="userSpaceOnUse">
                <path d="M 0 4 Q 8 1.5, 16 4 Q 24 6.5, 32 4"
                  fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.9" />
              </pattern>
            </defs>

            {/* Vegetation */}
            {[[76,125,62,42],[502,175,54,36],[78,435,55,36],[508,425,50,34],[300,522,70,26]].map(([cx,cy,rx,ry],i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#vegGrad)" />
            ))}
            {[[60,108],[80,126],[70,150],[100,118],[55,138],[490,162],[510,180],[496,200],[525,170],[480,186],[62,418],[88,445],[72,460],[100,430],[496,413],[518,435],[504,448],[530,420]].map(([x,y],i) => (
              <g key={i} transform={`translate(${x},${y})`} opacity="0.52">
                <circle r="7" fill={C.sageLight} stroke={C.sage} strokeWidth="0.5" />
                <circle r="4.5" cx="-3" cy="-3" fill={C.sage} opacity="0.45" />
              </g>
            ))}

            {/* Roads */}
            <path d="M 0 295 Q 180 280 300 295 Q 420 310 580 295" fill="none" stroke={C.stoneLight} strokeWidth="6" strokeLinecap="round" />
            <path d="M 148 0 Q 155 190 148 395 Q 145 480 152 570" fill="none" stroke={C.stoneLight} strokeWidth="5" strokeLinecap="round" />
            <text x="42" y="290" fontSize="7.5" fill={C.stone} fontFamily="monospace" opacity="0.5">BROADWAY</text>
            <g transform="translate(154,35) rotate(90)">
              <text fontSize="7.5" fill={C.stone} fontFamily="monospace" opacity="0.5">BELLEVILLE AVE</text>
            </g>

            {/* Industrial zone */}
            <rect x="438" y="340" width="108" height="70" rx="3"
              fill={C.stoneLight} fillOpacity="0.35" stroke={C.stone} strokeWidth="0.8" strokeDasharray="5 3" />
            <text x="492" y="380" textAnchor="middle" fontSize="7.5" fill={C.stone} fontFamily="monospace" opacity="0.6">INDUSTRIAL ZONE</text>

            {/* River */}
            <path d={RIVER_D} fill="none" stroke={C.riverFaint} strokeWidth="52" strokeLinecap="round" />
            <path d={RIVER_D} fill="none" stroke={C.riverLight} strokeWidth="30" strokeLinecap="round" opacity="0.72" />
            <path d={RIVER_D} fill="none" stroke={C.river} strokeWidth="14" strokeLinecap="round" filter="url(#glow)" />
            <path d={RIVER_D} fill="none" stroke="url(#ripple)" strokeWidth="12" strokeLinecap="round" />
            <path d={RIVER_D} fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="22 14"
              style={{ animation: "rippleFlow 3.5s linear infinite" }} />

            {/* Flow arrows */}
            {[[296,78,12],[355,158,18],[347,305,-8],[283,468,-18]].map(([x,y,rot],i) => (
              <g key={i} transform={`translate(${x},${y}) rotate(${rot+90})`} opacity="0.46">
                <polygon points="0,-5.5 3.8,2.2 -3.8,2.2" fill={C.riverMid} />
              </g>
            ))}
            <g transform="translate(400,250) rotate(34)">
              <text fontSize="11" fill={C.riverMid} fontFamily="'Playfair Display','Book Antiqua',Georgia,serif" fontStyle="italic" opacity="0.72">
                Second River
              </text>
            </g>

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
            <g transform="translate(536, 46)" filter="url(#softDrop)">
              <circle r="21" fill="rgba(255,255,255,0.82)" stroke={C.stoneLight} strokeWidth="1" />
              <polygon points="0,-15 2.8,-4 -2.8,-4" fill={C.river} />
              <polygon points="0,15 2.8,4 -2.8,4" fill={C.stone} opacity="0.45" />
              <polygon points="-15,0 -4,2.8 -4,-2.8" fill={C.stone} opacity="0.45" />
              <polygon points="15,0 4,2.8 4,-2.8" fill={C.stone} opacity="0.45" />
              <circle r="2.8" fill="white" stroke={C.river} strokeWidth="1.2" />
              <text x="0" y="-18" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill={C.river} fontFamily="serif">N</text>
            </g>

            {/* Scale bar */}
            <g transform="translate(28, 536)">
              <rect x="0" y="-3" width="70" height="6" rx="3" fill={C.stone} opacity="0.18" />
              <rect x="0" y="-3" width="35" height="6" rx="2" fill={C.stone} opacity="0.16" />
              <text x="35" y="-8" textAnchor="middle" fontSize="8" fill={C.textMid} fontFamily="monospace">500 m</text>
            </g>
          </svg>

          <p style={{ position: "absolute", bottom: 14, right: 18, fontSize: 10, color: C.textLight, fontFamily: body, fontStyle: "italic", margin: 0 }}>
            Click a node to view field data →
          </p>
        </main>
      </div>

      {/* MODAL */}
      {selected && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: modalVisible ? "rgba(40,34,26,0.52)" : "rgba(40,34,26,0)",
            backdropFilter: modalVisible ? "blur(3px) saturate(0.88)" : "none",
            transition: "background 0.38s ease, backdrop-filter 0.38s ease",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 580, maxWidth: "94vw",
              background: "white",
              borderRadius: 4,
              boxShadow: "0 24px 80px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.1)",
              position: "relative", overflow: "hidden",
              transform: modalVisible ? "scale(1) translateY(0) rotate(-0.4deg)" : "scale(0.86) translateY(36px) rotate(-3deg)",
              opacity: modalVisible ? 1 : 0,
              transition: "all 0.5s cubic-bezier(0.34, 1.42, 0.64, 1)",
            }}
          >
            {/* Close */}
            <button onClick={closeModal} style={{
              position: "absolute", top: 11, right: 11, zIndex: 10,
              background: "rgba(0,0,0,0.07)", border: "none", borderRadius: "50%",
              width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "background 0.18s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.07)"}
            >
              <X size={13} color={C.stone} />
            </button>

            {/* Photo + header row */}
            <div style={{ display: "flex" }}>
              {/* Polaroid */}
              <div style={{ width: 188, flexShrink: 0, padding: "12px 10px 14px 12px", background: "#F8F6F2" }}>
                <div style={{ width: "100%", paddingBottom: "100%", position: "relative", overflow: "hidden", background: `linear-gradient(145deg, #DEDAD4, #C8C3BB)` }}>
                  <img
                    src={`/${selected.file}`}
                    alt={selected.label}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  {[{top:6,left:6},{top:6,right:6},{bottom:6,left:6},{bottom:6,right:6}].map((pos,i) => (
                    <div key={i} style={{
                      position: "absolute", width: 11, height: 11,
                      borderTop: i < 2 ? `1.5px solid ${C.stone}55` : "none",
                      borderBottom: i >= 2 ? `1.5px solid ${C.stone}55` : "none",
                      borderLeft: (i===0||i===2) ? `1.5px solid ${C.stone}55` : "none",
                      borderRight: (i===1||i===3) ? `1.5px solid ${C.stone}55` : "none",
                      ...pos,
                    }} />
                  ))}
                </div>
                <code style={{ fontSize: 8.5, fontFamily: mono, color: selected.color, display: "block", marginTop: 7, wordBreak: "break-all", lineHeight: 1.5 }}>
                  {selected.file}
                </code>
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: "18px 20px 14px", borderLeft: `1px solid ${C.stoneLight}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                  <span style={{
                    fontSize: 10, padding: "2px 10px", borderRadius: 12,
                    background: selected.color + "18", color: selected.color,
                    border: `1px solid ${selected.color}44`,
                    fontFamily: mono, letterSpacing: "0.06em",
                  }}>
                    {selected.tag}
                  </span>
                  <span style={{ fontSize: 10, color: C.textLight, fontFamily: mono }}>
                    Node #{String(selected.id).padStart(2, "0")}
                  </span>
                </div>

                <h2 style={{ margin: "0 0 10px", fontSize: 19, fontWeight: 700, color: C.text, fontFamily: serif, lineHeight: 1.2 }}>
                  {selected.label}
                </h2>

                <p style={{ margin: 0, fontSize: 13, color: C.textMid, fontFamily: body, fontStyle: "italic", lineHeight: 1.75 }}>
                  {selected.desc}
                </p>
              </div>
            </div>

            {/* Field notes */}
            <div style={{ padding: "14px 18px 16px", borderTop: `1px solid ${C.stoneLight}` }}>
              <p style={{ margin: "0 0 6px", fontSize: 9, color: C.textLight, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.14em" }}>
                Field Notes
              </p>
              <p style={{ margin: 0, fontSize: 13, color: C.text, fontFamily: body, lineHeight: 1.78 }}>
                {selected.notes}
              </p>
            </div>

            {/* Footer */}
            <div style={{
              borderTop: `1px dashed ${C.stoneLight}`,
              padding: "8px 18px",
              background: "#FAFAF8",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Camera size={10} color={C.stone} opacity={0.5} />
              <code style={{ fontSize: 11, fontFamily: mono, color: selected.color, fontWeight: 600, letterSpacing: "0.04em" }}>
                {selected.file}
              </code>
              <span style={{ marginLeft: "auto", fontSize: 9.5, color: C.textLight, fontFamily: mono }}>
                Data Org · Second River Survey · 2026
              </span>
            </div>
          </div>
        </div>
      )}
      {/* ABOUT MODAL */}
      {aboutOpen && (
        <div
          onClick={closeAbout}
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: aboutVisible ? "rgba(40,34,26,0.52)" : "rgba(40,34,26,0)",
            backdropFilter: aboutVisible ? "blur(3px) saturate(0.88)" : "none",
            transition: "background 0.35s ease, backdrop-filter 0.35s ease",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 560, maxWidth: "94vw",
              background: "white",
              borderRadius: 4,
              boxShadow: "0 24px 80px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.1)",
              position: "relative", overflow: "hidden",
              transform: aboutVisible ? "scale(1) translateY(0)" : "scale(0.88) translateY(30px)",
              opacity: aboutVisible ? 1 : 0,
              transition: "all 0.45s cubic-bezier(0.34, 1.42, 0.64, 1)",
            }}
          >
            {/* Close */}
            <button onClick={closeAbout} style={{
              position: "absolute", top: 11, right: 11, zIndex: 10,
              background: "rgba(0,0,0,0.07)", border: "none", borderRadius: "50%",
              width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "background 0.18s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.07)"}
            >
              <X size={13} color={C.stone} />
            </button>

            {/* Header band */}
            <div style={{
              padding: "22px 24px 18px",
              background: `linear-gradient(135deg, ${C.river} 0%, ${C.riverMid} 100%)`,
              position: "relative", overflow: "hidden",
            }}>
              {/* Decorative ripple circles */}
              <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.12)" }} />
              <div style={{ position: "absolute", right: -10, top: -10, width: 100, height: 100, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.10)" }} />

              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, position: "relative" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  border: "1.5px solid rgba(255,255,255,0.30)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Droplets size={20} color="white" />
                </div>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 9.5, color: "rgba(255,255,255,0.65)", fontFamily: mono, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Project 1 · ENGR493 / STS403
                  </p>
                  <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "white", fontFamily: serif, lineHeight: 1.2 }}>
                    The Virtual River
                  </h2>
                  <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.78)", fontFamily: body, fontStyle: "italic" }}>
                    Digital Storytelling and VR Exploration
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "18px 24px 22px" }}>

              {/* Institution */}
              <div style={{
                padding: "10px 14px", borderRadius: 8, marginBottom: 18,
                background: C.riverFaint, border: `1px solid ${C.riverLight}`,
              }}>
                <p style={{ margin: "0 0 2px", fontSize: 11.5, fontWeight: 600, color: C.river, fontFamily: serif }}>
                  Albert Dorman Honors College
                </p>
                <p style={{ margin: 0, fontSize: 11, color: C.textMid, fontFamily: body }}>
                  New Jersey Institute of Technology
                </p>
              </div>

              {/* Advisors */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ margin: "0 0 8px", fontSize: 9, color: C.textLight, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.14em" }}>
                  Faculty Advisors
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Dr. Ashish Borgaonkar", "Dr. Emily Tancredi-Brice Agbenyega"].map((name) => (
                    <div key={name} style={{
                      flex: 1, padding: "9px 12px", borderRadius: 8,
                      background: C.bg, border: `1px solid ${C.stoneLight}`,
                    }}>
                      <p style={{ margin: "0 0 1px", fontSize: 9, color: C.textLight, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.08em" }}>Advisor</p>
                      <p style={{ margin: 0, fontSize: 12, color: C.text, fontFamily: body, fontWeight: 500 }}>{name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team members by role */}
              <div>
                <p style={{ margin: "0 0 10px", fontSize: 9, color: C.textLight, fontFamily: mono, textTransform: "uppercase", letterSpacing: "0.14em" }}>
                  Project Members
                </p>

                {[
                  {
                    role: "Data & VR Team",
                    color: C.river,
                    members: ["Jane Kalla", "Lakshita Madhavan", "Pooja Datir", "Rohit Datir"],
                  },
                  {
                    role: "Community Engagement",
                    color: C.sage,
                    members: ["Julia Navarro"],
                  },
                  {
                    role: "Legal Studies",
                    color: C.stone,
                    members: ["Anastasiia Volynska", "Haripriya Kemisetti"],
                  },
                ].map(({ role, color, members }) => (
                  <div key={role} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 10.5, color: C.textMid, fontFamily: mono, letterSpacing: "0.06em" }}>{role}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 15 }}>
                      {members.map((name) => (
                        <span key={name} style={{
                          fontSize: 12, padding: "4px 12px", borderRadius: 20,
                          background: color + "12", color: C.text,
                          border: `1px solid ${color}30`,
                          fontFamily: body,
                        }}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              borderTop: `1px dashed ${C.stoneLight}`,
              padding: "8px 24px",
              background: "#FAFAF8",
              display: "flex", alignItems: "center",
            }}>
              <span style={{ fontSize: 9.5, color: C.textLight, fontFamily: mono }}>
                Second River Environmental Survey · 2026
              </span>
              <span style={{ marginLeft: "auto", fontSize: 9.5, color: C.textLight, fontFamily: mono }}>
                NJIT · ADHC
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}