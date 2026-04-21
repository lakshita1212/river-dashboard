import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Camera, X, Droplets } from "lucide-react";

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

const NODES = [
  {
    id: 1, label: "Water Drainage Point", file: "water_drainage_point.jpg",
    desc: "An opening tube that drains runoff into the river; critical for contaminant analysis.",
    color: C.river, tagBg: "#D0E6F8", tagText: "#1A3D60", tag: "Water Quality",
    x: 300, y: 102,
  },
  {
    id: 2, label: "River Access Stairs", file: "river_access_stairs.jpg",
    desc: "An area near the stairs with high litter accumulation, highlighting local neglect.",
    color: C.ochre, tagBg: "#F2E4C0", tagText: "#6B480A", tag: "Litter Risk",
    x: 360, y: 192,
  },
  {
    id: 3, label: "Bridge Vantage Point", file: "bridge_vantage_point.jpg",
    desc: "A high-traffic scenic spot for families and pedestrians to view the river.",
    color: C.sage, tagBg: "#CCE4CA", tagText: "#2C5C2A", tag: "Scenic",
    x: 375, y: 302,
  },
  {
    id: 4, label: "Industrial Corridor", file: "industrial_corridor.jpg",
    desc: "Surrounded by warehouses and construction, showing the industrial impact on the waterway.",
    color: C.stone, tagBg: "#DCD8CE", tagText: "#48443E", tag: "Industrial",
    x: 308, y: 395,
  },
  {
    id: 5, label: "Debris Accumulation Site", file: "debris_accumulation_site.jpg",
    desc: "An unmaintained area suffering from illegal dumping and debris buildup.",
    color: C.terra, tagBg: "#F0D8CC", tagText: "#601C08", tag: "Hazard",
    x: 248, y: 480,
  },
];

const PROJECTS = [
  { id: "p1", label: "Project 1", teams: ["Community Engagement", "Data Organization", "Data Visualization"] },
  { id: "p2", label: "Project 2", teams: ["Water Sampling", "Water Testing", "SASD"] },
  { id: "misc", label: "Misc", teams: [] },
];

const RIVER_D = "M 296 0 C 282 55, 338 95, 355 158 C 372 222, 325 258, 344 325 C 363 392, 308 428, 280 492 C 262 535, 245 555, 228 580";

function NodePin({ node, isHovered, onClick, onEnter, onLeave }) {
  const s = isHovered ? 1.22 : 1;
  const pd = (v) => v * s;
  return (
    <g transform={`translate(${node.x},${node.y})`}
      onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{ cursor: "pointer" }}>
      {isHovered && (
        <>
          <circle r="26" fill={node.color + "12"} stroke={node.color} strokeWidth="1" opacity="0.45"
            style={{ animation: "pinRing 1.4s ease-in-out infinite" }} />
          <circle r="19" fill={node.color + "18"} />
        </>
      )}
      <ellipse cx="1" cy={pd(19) + 2} rx={pd(5)} ry={pd(2.5)} fill="rgba(0,0,0,0.18)" />
      <path
        d={`M 0 ${pd(18)} C ${pd(-3)} ${pd(12)}, ${pd(-11)} ${pd(5)}, ${pd(-11)} ${pd(-3)} C ${pd(-11)} ${pd(-11)}, ${pd(-6)} ${pd(-16)}, 0 ${pd(-16)} C ${pd(6)} ${pd(-16)}, ${pd(11)} ${pd(-11)}, ${pd(11)} ${pd(-3)} C ${pd(11)} ${pd(5)}, ${pd(3)} ${pd(12)}, 0 ${pd(18)} Z`}
        fill={node.color} stroke="white" strokeWidth={isHovered ? 2 : 1.5}
        style={{
          filter: isHovered
            ? `drop-shadow(0 4px 10px ${node.color}88)`
            : "drop-shadow(0 2px 4px rgba(0,0,0,0.22))",
          transition: "filter 0.28s ease",
        }}
      />
      <circle cx="0" cy={pd(-3)} r={pd(isHovered ? 5.5 : 4.5)} fill="white" opacity="0.88" />
      {isHovered && (
        <g transform="translate(16,-24)">
          <rect x="-2" y="-11" width={node.label.length * 5.8 + 14} height="17"
            rx="5" fill="white" stroke={node.color + "44"} strokeWidth="1"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.12))" }} />
          <text x="5" y="1.5" fontSize="9.5" fill={C.textMid}
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

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const openModal = (node) => { setSelected(node); setTimeout(() => setModalVisible(true), 12); };
  const closeModal = () => { setModalVisible(false); setTimeout(() => setSelected(null), 400); };
  const toggle = (id) => setOpen(p => ({ ...p, [id]: !p[id] }));

  const serif = "'Playfair Display','Book Antiqua',Palatino,Georgia,serif";
  const body = "'Lora',Palatino,Georgia,serif";

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
        @keyframes pinRing { 0%,100%{r:22;opacity:0.38} 50%{r:30;opacity:0.12} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rippleFlow { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:-60} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${C.stoneLight};border-radius:4px}
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        padding: "18px 28px 15px",
        background: "rgba(255,255,255,0.62)",
        borderBottom: `1px solid ${C.stoneLight}`,
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          border: `2px solid ${C.riverMid}`,
          background: C.riverFaint,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Droplets size={20} color={C.river} />
        </div>
        <div>
          <h1 style={{
            margin: 0, fontSize: 20, fontWeight: 700,
            color: C.river, fontFamily: serif, letterSpacing: "0.015em",
          }}>
            Second River Environmental Survey
          </h1>
          <p style={{
            margin: 0, fontSize: 12, color: C.textMid,
            fontFamily: body, fontStyle: "italic", letterSpacing: "0.03em",
          }}>
            Newark Watershed · Field Node Documentation · 2026
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexShrink: 0 }}>
          {[
            { label: "5 Active Nodes", bg: C.sageLight, color: C.sageDark, border: C.sage + "88" },
            { label: "NJ Watershed", bg: C.riverFaint, color: C.river, border: C.riverLight },
          ].map(({ label, bg, color, border }) => (
            <span key={label} style={{
              fontSize: 11, padding: "4px 12px", borderRadius: 20,
              background: bg, color, border: `1px solid ${border}`,
              fontFamily: "monospace", letterSpacing: "0.04em",
            }}>{label}</span>
          ))}
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* LEFT: Accordion Legend */}
        <aside style={{
          width: 265, flexShrink: 0,
          background: C.bgPanel,
          borderRight: `1px solid ${C.stoneLight}`,
          overflowY: "auto",
          padding: "18px 0 24px",
        }}>

          <p style={{
            margin: "0 0 12px 18px", fontSize: 9.5, color: C.textLight,
            letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace",
          }}>
            Team Structure
          </p>

          {PROJECTS.map((proj) => (
            <div key={proj.id}>
              <button
                onClick={() => toggle(proj.id)}
                style={{
                  width: "100%", padding: "10px 18px",
                  display: "flex", alignItems: "center", gap: 9,
                  background: open[proj.id] ? "rgba(42,90,130,0.07)" : "transparent",
                  border: "none",
                  borderLeft: `3px solid ${open[proj.id] ? C.river : "transparent"}`,
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.22s ease",
                }}
              >
                {open[proj.id]
                  ? <ChevronDown size={13} color={C.river} />
                  : <ChevronRight size={13} color={C.stone} />
                }
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: open[proj.id] ? C.river : C.text,
                  fontFamily: serif, transition: "color 0.2s",
                }}>
                  {proj.label}
                </span>
              </button>

              {open[proj.id] && (
                <div style={{ padding: "4px 0 10px 50px", animation: "slideDown 0.22s ease" }}>
                  {proj.teams.length > 0
                    ? proj.teams.map((t) => (
                      <div key={t} style={{
                        padding: "5px 0 5px 12px",
                        borderLeft: `2px solid ${C.riverLight}`, marginBottom: 3,
                      }}>
                        <span style={{ fontSize: 12.5, color: C.textMid, fontFamily: body }}>{t}</span>
                      </div>
                    ))
                    : <span style={{ fontSize: 12, color: C.textLight, fontStyle: "italic", fontFamily: body }}>
                        General items
                      </span>
                  }
                </div>
              )}

              <div style={{ height: 1, background: C.stoneLight, margin: "1px 18px" }} />
            </div>
          ))}

          {/* Node quick-nav */}
          <div style={{ marginTop: 20, padding: "0 14px" }}>
            <p style={{
              margin: "0 0 10px 4px", fontSize: 9.5, color: C.textLight,
              letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "monospace",
            }}>
              Survey Nodes
            </p>
            {NODES.map((node) => {
              const isHov = hovered === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => openModal(node)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "7px 10px", borderRadius: 8,
                    cursor: "pointer", marginBottom: 3,
                    background: isHov ? "rgba(255,255,255,0.62)" : "transparent",
                    border: `1px solid ${isHov ? C.stoneLight : "transparent"}`,
                    transition: "all 0.18s ease",
                  }}
                >
                  <svg width="9" height="14" viewBox="0 0 18 24" fill="none">
                    <path d="M 9 22 C 5 16, 0 11, 0 7 C 0 3, 4 0, 9 0 C 14 0, 18 3, 18 7 C 18 11, 13 16, 9 22 Z"
                      fill={node.color} />
                    <circle cx="9" cy="7" r="3.5" fill="white" opacity="0.88" />
                  </svg>
                  <span style={{
                    fontSize: 12, color: isHov ? C.text : C.textMid,
                    fontFamily: body, flex: 1, transition: "color 0.18s",
                  }}>{node.label}</span>
                  <ChevronRight size={10} color={isHov ? C.river : C.stoneLight} />
                </div>
              );
            })}
          </div>

          {/* Classification legend */}
          <div style={{
            margin: "16px 14px 0", padding: "12px 14px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.45)",
            border: `1px solid ${C.stoneLight}`,
          }}>
            <p style={{
              margin: "0 0 9px", fontSize: 9.5, color: C.textLight,
              letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "monospace",
            }}>
              Classification
            </p>
            {[
              [C.river, "Water quality"],
              [C.ochre, "Litter / neglect"],
              [C.sage, "Public access"],
              [C.stone, "Industrial"],
              [C.terra, "Hazard zone"],
            ].map(([color, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <svg width="7" height="11" viewBox="0 0 14 20" fill="none">
                  <path d="M 7 19 C 3 14, 0 10, 0 6 C 0 2.5, 3 0, 7 0 C 11 0, 14 2.5, 14 6 C 14 10, 11 14, 7 19 Z"
                    fill={color} />
                </svg>
                <span style={{ fontSize: 11, color: C.textMid, fontFamily: body }}>{label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT: Scenic Map */}
        <main style={{
          flex: 1, position: "relative", overflow: "hidden",
          background: `radial-gradient(ellipse 80% 70% at 55% 44%, #EBF5EE 0%, ${C.bg} 100%)`,
        }}>
          {/* Topographic rings */}
          <svg style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            opacity: 0.065, pointerEvents: "none",
          }}>
            {[1.0, 1.55, 2.1, 2.65, 3.2].map((s, i) => (
              <ellipse key={i} cx="52%" cy="46%" rx={`${18 * s}%`} ry={`${11 * s}%`}
                fill="none" stroke={C.sage} strokeWidth="1.2" />
            ))}
          </svg>

          {/* Main map SVG */}
          <svg viewBox="0 0 580 570" style={{ width: "100%", height: "100%", display: "block" }}>
            <defs>
              <filter id="glow" x="-50%" y="-20%" width="200%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
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

            {/* Vegetation blobs */}
            {[
              [76, 125, 62, 42], [502, 175, 54, 36], [78, 435, 55, 36],
              [508, 425, 50, 34], [300, 522, 70, 26],
            ].map(([cx, cy, rx, ry], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#vegGrad)" />
            ))}

            {/* Tree symbols */}
            {[
              [60,108],[80,126],[70,150],[100,118],[55,138],
              [490,162],[510,180],[496,200],[525,170],[480,186],
              [62,418],[88,445],[72,460],[100,430],
              [496,413],[518,435],[504,448],[530,420],
            ].map(([x, y], i) => (
              <g key={i} transform={`translate(${x},${y})`} opacity="0.52">
                <circle r="7" fill={C.sageLight} stroke={C.sage} strokeWidth="0.5" />
                <circle r="4.5" cx="-3" cy="-3" fill={C.sage} opacity="0.45" />
              </g>
            ))}

            {/* Infrastructure */}
            <path d="M 0 295 Q 180 280 300 295 Q 420 310 580 295"
              fill="none" stroke={C.stoneLight} strokeWidth="6" strokeLinecap="round" />
            <path d="M 148 0 Q 155 190 148 395 Q 145 480 152 570"
              fill="none" stroke={C.stoneLight} strokeWidth="5" strokeLinecap="round" />
            <text x="42" y="290" fontSize="7.5" fill={C.stone} fontFamily="monospace" opacity="0.5">BROADWAY</text>
            <g transform="translate(154,35) rotate(90)">
              <text fontSize="7.5" fill={C.stone} fontFamily="monospace" opacity="0.5">BELLEVILLE AVE</text>
            </g>

            {/* Industrial zone */}
            <rect x="438" y="340" width="108" height="70" rx="3"
              fill={C.stoneLight} fillOpacity="0.35"
              stroke={C.stone} strokeWidth="0.8" strokeDasharray="5 3" />
            <text x="492" y="380" textAnchor="middle" fontSize="7.5"
              fill={C.stone} fontFamily="monospace" opacity="0.6">INDUSTRIAL ZONE</text>

            {/* ── RIVER ── */}
            {/* Wide halo */}
            <path d={RIVER_D} fill="none" stroke={C.riverFaint}
              strokeWidth="52" strokeLinecap="round" />
            {/* Soft bank */}
            <path d={RIVER_D} fill="none" stroke={C.riverLight}
              strokeWidth="30" strokeLinecap="round" opacity="0.72" />
            {/* River body + glow */}
            <path d={RIVER_D} fill="none" stroke={C.river}
              strokeWidth="14" strokeLinecap="round"
              filter="url(#glow)" />
            {/* Ripple texture */}
            <path d={RIVER_D} fill="none" stroke="url(#ripple)"
              strokeWidth="12" strokeLinecap="round" />
            {/* Animated shimmer */}
            <path d={RIVER_D} fill="none"
              stroke="rgba(255,255,255,0.38)"
              strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray="22 14"
              style={{ animation: "rippleFlow 3.5s linear infinite" }} />

            {/* Flow arrows */}
            {[[296,78,12],[355,158,18],[347,305,-8],[283,468,-18]].map(([x, y, rot], i) => (
              <g key={i} transform={`translate(${x},${y}) rotate(${rot + 90})`} opacity="0.48">
                <polygon points="0,-5.5 3.8,2.2 -3.8,2.2" fill={C.riverMid} />
              </g>
            ))}

            {/* River label */}
            <g transform="translate(400,250) rotate(34)">
              <text fontSize="11" fill={C.riverMid}
                fontFamily="'Playfair Display','Book Antiqua',Georgia,serif"
                fontStyle="italic" opacity="0.72">
                Second River
              </text>
            </g>

            {/* NODE PINS */}
            {NODES.map((node) => (
              <NodePin
                key={node.id} node={node}
                isHovered={hovered === node.id}
                onClick={() => openModal(node)}
                onEnter={() => setHovered(node.id)}
                onLeave={() => setHovered(null)}
              />
            ))}

            {/* Compass rose */}
            <g transform="translate(536, 46)" filter="url(#softDrop)">
              <circle r="21" fill="rgba(255,255,255,0.82)" stroke={C.stoneLight} strokeWidth="1" />
              <polygon points="0,-15 2.8,-4 -2.8,-4" fill={C.river} />
              <polygon points="0,15 2.8,4 -2.8,4" fill={C.stone} opacity="0.45" />
              <polygon points="-15,0 -4,2.8 -4,-2.8" fill={C.stone} opacity="0.45" />
              <polygon points="15,0 4,2.8 4,-2.8" fill={C.stone} opacity="0.45" />
              <circle r="2.8" fill="white" stroke={C.river} strokeWidth="1.2" />
              <text x="0" y="-18" textAnchor="middle" fontSize="8.5"
                fontWeight="bold" fill={C.river} fontFamily="serif">N</text>
            </g>

            {/* Scale bar */}
            <g transform="translate(28, 536)">
              <rect x="0" y="-3" width="70" height="6" rx="3" fill={C.stone} opacity="0.18" />
              <rect x="0" y="-3" width="35" height="6" rx="2" fill={C.stone} opacity="0.16" />
              <text x="35" y="-8" textAnchor="middle" fontSize="8"
                fill={C.textMid} fontFamily="monospace">500 m</text>
            </g>
          </svg>

          <p style={{
            position: "absolute", bottom: 14, right: 18,
            fontSize: 10.5, color: C.textLight,
            fontFamily: body, fontStyle: "italic", margin: 0,
          }}>
            Select a node to view field data →
          </p>
        </main>
      </div>

      {/* ── MODAL (Polaroid / Gallery card) ── */}
      {selected && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: modalVisible ? "rgba(40,34,26,0.52)" : "rgba(40,34,26,0)",
            backdropFilter: modalVisible ? "blur(3px) saturate(0.88)" : "none",
            transition: "background 0.38s ease, backdrop-filter 0.38s ease",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 598, maxWidth: "94vw",
              background: "white",
              borderRadius: 3,
              padding: "14px 14px 30px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.04)",
              position: "relative",
              transform: modalVisible
                ? "scale(1) translateY(0) rotate(-0.4deg)"
                : "scale(0.86) translateY(36px) rotate(-3deg)",
              opacity: modalVisible ? 1 : 0,
              transition: "all 0.5s cubic-bezier(0.34, 1.42, 0.64, 1)",
            }}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute", top: 11, right: 11,
                background: "rgba(0,0,0,0.07)", border: "none",
                borderRadius: "50%", width: 28, height: 28,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "background 0.18s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.07)"}
            >
              <X size={13} color={C.stone} />
            </button>

            {/* Polaroid photo */}
            <div style={{
              width: "100%", height: 235,
              background: `linear-gradient(145deg, #DEDAD4 0%, #D4CFC8 55%, #C8C3BB 100%)`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 8, position: "relative", overflow: "hidden",
            }}>
              {/* Corner crop marks */}
              {[
                { top: 10, left: 10 }, { top: 10, right: 10 },
                { bottom: 10, left: 10 }, { bottom: 10, right: 10 },
              ].map((pos, i) => (
                <div key={i} style={{
                  position: "absolute", width: 16, height: 16,
                  borderTop: i < 2 ? `1.5px solid ${C.stone}55` : "none",
                  borderBottom: i >= 2 ? `1.5px solid ${C.stone}55` : "none",
                  borderLeft: (i === 0 || i === 2) ? `1.5px solid ${C.stone}55` : "none",
                  borderRight: (i === 1 || i === 3) ? `1.5px solid ${C.stone}55` : "none",
                  ...pos,
                }} />
              ))}
              {/* Light leak accent */}
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: 90, height: 90,
                background: `radial-gradient(circle at top right, ${selected.color}1A 0%, transparent 70%)`,
              }} />
              <Camera size={38} color={C.stone} opacity={0.28} />
              <p style={{
                margin: 0, fontSize: 12, color: C.textLight,
                fontFamily: body, fontStyle: "italic",
              }}>
                Field photograph
              </p>
            </div>

            {/* Info row */}
            <div style={{
              display: "flex", gap: 20,
              padding: "15px 6px 0",
              alignItems: "flex-start",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 10.5, padding: "2px 9px", borderRadius: 12,
                    background: selected.tagBg, color: selected.tagText,
                    fontFamily: "monospace", letterSpacing: "0.06em",
                  }}>
                    {selected.tag}
                  </span>
                  <span style={{ fontSize: 10.5, color: C.textLight, fontFamily: "monospace" }}>
                    Node #{String(selected.id).padStart(2, "0")} · Newark Watershed
                  </span>
                </div>
                <h2 style={{
                  margin: "0 0 10px", fontSize: 18, fontWeight: 700,
                  color: C.text, fontFamily: serif, lineHeight: 1.25,
                }}>
                  {selected.label}
                </h2>
                <p style={{
                  margin: 0, fontSize: 13, color: C.textMid,
                  fontFamily: body, fontStyle: "italic", lineHeight: 1.72,
                }}>
                  {selected.desc}
                </p>
              </div>

              {/* Metadata card */}
              <div style={{
                flexShrink: 0, width: 112,
                background: C.bg, border: `1px solid ${C.stoneLight}`,
                borderRadius: 8, padding: "10px 12px",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                {[
                  { label: "Status", value: "Active" },
                  { label: "Year", value: "2026" },
                  { label: "Type", value: selected.tag },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ margin: "0 0 1px", fontSize: 9, color: C.textLight, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 12, color: C.text, fontWeight: 600, fontFamily: body }}>{value}</p>
                  </div>
                ))}
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 9, color: C.textLight, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>Color Key</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="7" height="11" viewBox="0 0 14 20" fill="none">
                      <path d="M 7 19 C 3 14, 0 10, 0 6 C 0 2.5, 3 0, 7 0 C 11 0, 14 2.5, 14 6 C 14 10, 11 14, 7 19 Z" fill={selected.color} />
                    </svg>
                    <span style={{ fontSize: 10.5, color: C.textMid, fontFamily: body }}>{selected.tag}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filename strip — typewriter / Data Org link */}
            <div style={{
              marginTop: 16, padding: "11px 6px 0",
              borderTop: `1px dashed ${C.stoneLight}`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Camera size={11} color={C.stone} opacity={0.6} />
              <code style={{
                fontSize: 13,
                fontFamily: "'Courier New',Courier,monospace",
                color: selected.color, fontWeight: 600,
                letterSpacing: "0.04em",
              }}>
                {selected.file}
              </code>
              <span style={{
                marginLeft: "auto", fontSize: 10,
                color: C.textLight, fontFamily: "monospace",
                letterSpacing: "0.05em",
              }}>
                Data Org · Second River Survey
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}