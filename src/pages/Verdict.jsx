import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const FALLBACK_DATA = {
  originalityScore: 34,
  saturationLevel: 'high',
  similarProjects: [
    { name: 'StudyBuddy AI', platform: 'Devpost', year: 2024 },
    { name: 'ExamPrep Pro', platform: 'Devpost', year: 2023 },
    { name: 'LearnFlow', platform: 'Product Hunt', year: 2024 },
  ],
  gap: 'Nobody has built this specifically for competitive exam students with anxiety-focused features.',
  pivots: [
    'Focus exclusively on exam anxiety management',
    'Build for a specific regional exam (UPSC, JEE)',
    'Add peer accountability features nobody else has',
  ],
};

const SATURATION_SCALE = { high: 0.85, medium: 0.5, low: 0.2 };

const MONO = "'Space Mono', monospace";

// Per-card accent colors
const AMBER  = '#f0a868';
const BLUE   = '#5b9bd9';
const GREEN  = '#7fe08a';
const PURPLE = '#a78bfa';

// Card base — background applied per-card
const CARD_BASE = {
  border: '0.5px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '18px 20px',
  fontFamily: MONO,
};

// Per-card radial gradient backgrounds
const BG = {
  originality: 'radial-gradient(circle at 15% 55%, rgba(255,255,255,0.035) 0%, #0a0a0a 65%)',
  saturation:  'radial-gradient(circle at 22% 38%, rgba(240,168,104,0.11) 0%, #0a0a0a 65%)',
  similar:     'radial-gradient(circle at 72% 62%, rgba(91,155,217,0.10) 0%, #0a0a0a 65%)',
  confidence:  'radial-gradient(circle at 50% 78%, rgba(127,224,138,0.09) 0%, #0a0a0a 65%)',
  pivot:       'radial-gradient(circle at 50% 25%, rgba(167,139,250,0.10) 0%, #0a0a0a 65%)',
  section:     'radial-gradient(circle at 50% 0%, #131313 0%, #090909 80%)',
};

const LABEL_STYLE = {
  fontFamily: MONO,
  fontSize: '9px',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: '#282828',
  marginBottom: '8px',
};

// Label with optional accent dot
function AccentLabel({ text, accent = null }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
      {accent && (
        <span style={{
          display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%',
          background: accent, flexShrink: 0, boxShadow: `0 0 5px ${accent}99`,
        }} />
      )}
      <p style={{
        fontFamily: MONO, fontSize: '9px', textTransform: 'uppercase',
        letterSpacing: '0.2em', color: '#282828', margin: 0,
      }}>
        {text}
      </p>
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <p style={{
      fontFamily: MONO, fontSize: '9px', textTransform: 'uppercase',
      letterSpacing: '0.2em', color: '#282828',
      marginBottom: '12px', marginTop: '36px',
    }}>
      — {text}
    </p>
  );
}

// Scatter plot — "YOU" dot slides right as displayScore counts up
function ScatterChart({ displayScore, dots }) {
  const youX = 8 + (displayScore / 100) * 128;
  const youY = 66 - (displayScore / 100) * 46;
  return (
    <svg viewBox="0 0 150 80" width="100%" height="100%" style={{ display: 'block' }}>
      <line x1="0" y1="40" x2="150" y2="40" stroke="#0e0e0e" strokeWidth="0.5" />
      <line x1="75" y1="0" x2="75" y2="80" stroke="#0e0e0e" strokeWidth="0.5" />
      <text x="3" y="77" fontSize="5" fill="#1c1c1c" fontFamily="Space Mono">LOW</text>
      <text x="115" y="77" fontSize="5" fill="#1c1c1c" fontFamily="Space Mono">NOVEL</text>
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="3" fill="#161616" stroke="#242424" strokeWidth="0.5" />
      ))}
      {/* Soft glow halo behind YOU dot */}
      <circle cx={youX} cy={youY} r="10" fill="rgba(255,255,255,0.05)" />
      <circle cx={youX} cy={youY} r="5" fill="#ffffff" />
      <text x={youX + 7} y={youY + 3} fontSize="5.5" fill="#ffffff" fontFamily="Space Mono" fontWeight="700">
        YOU
      </text>
    </svg>
  );
}

// Segmented gauge — amber fill via accentColor
function SatGauge({ filled, accentColor = '#ffffff' }) {
  return (
    <svg viewBox="0 0 114 16" width="100%" height="16" style={{ display: 'block' }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <rect
          key={i} x={i * 12} y={2} width={10} height={12} rx="2"
          fill={i < filled ? accentColor : '#0e0e0e'}
          stroke="#141414" strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}

// Node graph — satellite nodes in accent color
function NodeGraph({ count, accentColor = '#5b9bd9' }) {
  const cx = 60, cy = 40, r = 26;
  const nodes = Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  return (
    <svg viewBox="0 0 120 80" width="100%" height="80" style={{ display: 'block' }}>
      {nodes.map((n, i) => (
        <line key={i} x1={cx} y1={cy} x2={n.x} y2={n.y}
          stroke={accentColor} strokeWidth="0.7" opacity="0.3" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="4"
          fill={accentColor + '22'} stroke={accentColor} strokeWidth="0.8" opacity="0.75" />
      ))}
      {/* Center: the idea — stays white for contrast */}
      <circle cx={cx} cy={cy} r="7" fill="#ffffff" />
    </svg>
  );
}

// Confidence sparkline — always green (live/active meaning)
function ConfidenceSparkline() {
  return (
    <svg viewBox="0 0 100 36" width="100%" height="36" style={{ display: 'block' }}>
      <polyline
        points="0,20 8,20 12,9 16,30 20,20 34,20 38,7 42,32 46,20 60,20 64,13 68,27 72,20 86,20 90,15 94,25 100,20"
        fill="none" stroke={GREEN} strokeWidth="1.2"
        strokeLinejoin="round" strokeLinecap="round"
      />
    </svg>
  );
}

// Upward trend — accent-colored, steeper for lower originality score
function TrendLine({ score, accentColor = '#ffffff' }) {
  const endY = score < 40 ? 7 : score < 70 ? 14 : 22;
  const mid1Y = score < 40 ? 26 : score < 70 ? 28 : 30;
  const mid2Y = score < 40 ? 16 : score < 70 ? 20 : 26;
  return (
    <svg viewBox="0 0 100 40" width="100%" height="40" style={{ display: 'block' }}>
      <path
        d={`M 5 35 C 28 ${mid1Y + 4}, 60 ${mid2Y + 2}, 95 ${endY + 4} L 95 40 L 5 40 Z`}
        fill={accentColor + '14'}
      />
      <path
        d={`M 5 35 C 28 ${mid1Y}, 60 ${mid2Y}, 95 ${endY}`}
        fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round"
      />
      <circle cx="95" cy={endY} r="2.5" fill={accentColor} />
    </svg>
  );
}

export default function Verdict() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || FALLBACK_DATA;
  const { originalityScore, saturationLevel, similarProjects, gap, pivots } = data;

  const [mounted, setMounted] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [satFilled, setSatFilled] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Score count-up
  useEffect(() => {
    const steps = 40;
    const intervalMs = 1000 / steps;
    const increment = originalityScore / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= originalityScore) {
        setDisplayScore(originalityScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [originalityScore]);

  // Saturation segments fill one at a time
  useEffect(() => {
    if (!mounted) return;
    const satFrac = SATURATION_SCALE[(saturationLevel || 'medium').toLowerCase()] ?? 0.5;
    const target = Math.round(satFrac * 10);
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setSatFilled(count);
      if (count >= target) clearInterval(timer);
    }, 90);
    return () => clearInterval(timer);
  }, [mounted, saturationLevel]);

  const fadeUp = (delay) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(12px)',
    transition: `opacity 0.35s ease ${delay}s, transform 0.35s ease ${delay}s`,
  });

  const satFrac = SATURATION_SCALE[(saturationLevel || 'medium').toLowerCase()] ?? 0.5;
  const pivotPotential = originalityScore < 40 ? 'HIGH' : originalityScore < 70 ? 'MED' : 'LOW';

  // Deterministic scatter positions for similar project dots (low-novelty cluster)
  const scatterDots = similarProjects.map((_, i) => ({
    cx: 12 + ((i * 41 + 17) % 55),
    cy: 18 + ((i * 29 + 11) % 44),
  }));

  return (
    <>
      <style>{`
        .v-btn-primary {
          flex: 1; height: 48px;
          background: #ffffff; color: #000000;
          border: none; border-radius: 8px;
          font-family: ${MONO}; font-size: 13px; font-weight: 700;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
        }
        .v-btn-primary:hover { background: #e8e8e8; transform: scale(1.01); }
        .v-btn-primary:focus-visible { outline: 2px solid #ffffff; outline-offset: 3px; }
        .v-btn-primary:active { transform: scale(0.98); }

        .v-btn-secondary {
          flex: 1; height: 48px;
          background: transparent; color: #ffffff;
          border: 1px solid #1a1a1a; border-radius: 8px;
          font-family: ${MONO}; font-size: 13px; font-weight: 700;
          cursor: pointer;
          transition: border-color 0.15s ease, transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
        }
        .v-btn-secondary:hover { border-color: #333333; transform: scale(1.01); }
        .v-btn-secondary:focus-visible { outline: 1px solid #555555; outline-offset: 3px; }
        .v-btn-secondary:active { transform: scale(0.98); }

        .v-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .v-hero { grid-column: span 2; }

        @media (max-width: 680px) {
          .v-grid { grid-template-columns: 1fr; }
          .v-hero { grid-column: span 1; }
        }
        @media (min-width: 681px) and (max-width: 900px) {
          .v-grid { grid-template-columns: repeat(2, 1fr); }
          .v-hero { grid-column: span 2; }
        }
      `}</style>

      <Navbar />

      <main style={{
        minHeight: 'calc(100vh - 69px)',
        background: '#000000',
        padding: '44px 20px 80px',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Page header */}
          <div style={{ marginBottom: '24px', ...fadeUp(0) }}>
            <p style={{ ...LABEL_STYLE, marginBottom: '8px', color: '#242424' }}>— Verdict</p>
            <h1 style={{
              fontFamily: MONO, fontSize: '26px', fontWeight: 700,
              color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em',
            }}>
              Idea analyzed.
            </h1>
          </div>

          {/* ── Metric grid ── */}
          <div className="v-grid" style={fadeUp(0.04)}>

            {/* HERO — Originality Score (spans 2 cols, neutral no accent) */}
            <div className="v-hero" style={{
              ...CARD_BASE,
              background: BG.originality,
              display: 'flex', flexDirection: 'column', minHeight: '160px',
            }}>
              <p style={LABEL_STYLE}>Originality Score</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flex: 1 }}>
                {/* Number */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                    <span style={{
                      fontFamily: MONO, fontSize: '68px', fontWeight: 700,
                      color: '#ffffff', lineHeight: 0.88,
                    }}>
                      {displayScore}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: '18px', color: '#242424', fontWeight: 400 }}>/100</span>
                  </div>
                  <p style={{ fontFamily: MONO, fontSize: '10px', color: '#303030', marginTop: '10px', lineHeight: 1.5 }}>
                    vs {similarProjects.length} similar project{similarProjects.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                {/* Scatter chart */}
                <div style={{ flex: 1, height: '80px', minWidth: 0 }}>
                  <ScatterChart displayScore={displayScore} dots={scatterDots} />
                </div>
              </div>
            </div>

            {/* Saturation — amber accent */}
            <div style={{ ...CARD_BASE, background: BG.saturation, display: 'flex', flexDirection: 'column' }}>
              <AccentLabel text="Saturation" accent={AMBER} />
              <span style={{
                fontFamily: MONO, fontSize: '30px', fontWeight: 700,
                color: '#ffffff', textTransform: 'uppercase', lineHeight: 1,
              }}>
                {saturationLevel}
              </span>
              <div style={{ marginTop: 'auto', paddingTop: '14px' }}>
                <SatGauge filled={satFilled} accentColor={AMBER} />
                <p style={{ fontFamily: MONO, fontSize: '9px', color: '#242424', marginTop: '7px' }}>
                  {Math.round(satFrac * 100)}% of adjacent niches occupied
                </p>
              </div>
            </div>

            {/* Similar Projects — blue accent node graph */}
            <div style={{ ...CARD_BASE, background: BG.similar }}>
              <AccentLabel text="Similar Found" accent={BLUE} />
              <span style={{ fontFamily: MONO, fontSize: '38px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                {similarProjects.length}
              </span>
              <NodeGraph count={similarProjects.length} accentColor={BLUE} />
            </div>

            {/* Confidence — green accent (established "live" meaning) */}
            <div style={{ ...CARD_BASE, background: BG.confidence }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%',
                    background: GREEN, flexShrink: 0, boxShadow: `0 0 5px ${GREEN}99`,
                  }} />
                  <p style={{
                    fontFamily: MONO, fontSize: '9px', textTransform: 'uppercase',
                    letterSpacing: '0.2em', color: '#282828', margin: 0,
                  }}>Confidence</p>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontFamily: MONO, fontSize: '8px', color: GREEN, letterSpacing: '0.1em',
                }}>
                  <span style={{
                    width: '4px', height: '4px', borderRadius: '50%',
                    background: GREEN, boxShadow: `0 0 4px ${GREEN}`, flexShrink: 0,
                  }} />
                  LIVE
                </span>
              </div>
              <span style={{ fontFamily: MONO, fontSize: '30px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>94%</span>
              <ConfidenceSparkline />
              <p style={{ fontFamily: MONO, fontSize: '9px', color: '#242424', marginTop: '4px' }}>
                3 sources · ~8s scan
              </p>
            </div>

            {/* Pivot Potential — purple accent trend */}
            <div style={{ ...CARD_BASE, background: BG.pivot }}>
              <AccentLabel text="Pivot Potential" accent={PURPLE} />
              <span style={{ fontFamily: MONO, fontSize: '30px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                {pivotPotential}
              </span>
              <TrendLine score={originalityScore} accentColor={PURPLE} />
              <p style={{ fontFamily: MONO, fontSize: '9px', color: '#242424', marginTop: '4px' }}>
                {pivots.length} directions identified
              </p>
            </div>

          </div>

          {/* ── Similar Projects list ── */}
          <div style={fadeUp(0.14)}>
            <SectionLabel text="Similar Projects Found" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {similarProjects.map((project, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: BG.section,
                  border: '0.5px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#222222', flexShrink: 0 }} />
                    <span style={{ fontFamily: MONO, fontSize: '13px', color: '#ffffff' }}>{project.name}</span>
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: '11px', color: '#272727' }}>
                    {project.platform} · {project.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── The Gap ── */}
          <div style={fadeUp(0.22)}>
            <SectionLabel text="The Gap" />
            <div style={{
              background: BG.section,
              border: '0.5px solid rgba(255,255,255,0.06)',
              borderLeft: '2px solid #2a2a2a',
              borderRadius: '8px',
              padding: '18px 20px',
            }}>
              <p style={{ fontFamily: MONO, fontSize: '13px', color: '#5a5a5a', lineHeight: 1.75 }}>
                {gap}
              </p>
            </div>
          </div>

          {/* ── Recommended Pivots ── */}
          <div style={fadeUp(0.3)}>
            <SectionLabel text="Recommended Pivots" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pivots.map((pivot, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  background: BG.section,
                  border: '0.5px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                }}>
                  <div style={{
                    flexShrink: 0, width: '22px', height: '22px',
                    border: '1px solid #1a1a1a', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: MONO, fontSize: '10px', color: '#282828',
                    marginTop: '1px',
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontFamily: MONO, fontSize: '13px', color: '#ffffff', lineHeight: 1.6 }}>
                    {pivot}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '36px', ...fadeUp(0.38) }}>
            <button className="v-btn-primary" onClick={() => navigate('/certificate/demo123')}>
              Lock this idea →
            </button>
            <button className="v-btn-secondary" onClick={() => navigate('/feed')}>
              Save & explore more
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
