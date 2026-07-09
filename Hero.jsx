import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SceneCanvas from "./components/SceneCanvas";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body { background: #000000; font-family: 'Space Mono', monospace; }

  .hero-cta {
    display: inline-flex;
    align-items: center;
    padding: 14px 24px;
    background: #ffffff;
    color: #000000;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.15s ease, transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .hero-cta:hover { background: #e8e8e8; transform: scale(1.02); }
  .hero-cta:focus-visible { outline: 2px solid #ffffff; outline-offset: 3px; }
  .hero-cta:active { transform: scale(0.98); }

  .hero-secondary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 22px;
    background: rgba(0,0,0,0.4);
    color: #ffffff;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    font-weight: 400;
    border: 0.5px solid rgba(255,255,255,0.35);
    border-radius: 8px;
    cursor: pointer;
    backdrop-filter: blur(4px);
    transition: color 0.15s ease, border-color 0.15s ease, transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .hero-secondary:hover { color: #cccccc; border-color: rgba(255,255,255,0.5); transform: scale(1.02); }
  .hero-secondary:focus-visible { outline: 2px solid rgba(255,255,255,0.5); outline-offset: 3px; }
  .hero-secondary:active { transform: scale(0.98); }

  .workflow-section {
    position: relative;
    z-index: 30;
    background: #000000;
    border-top: 1px solid #111111;
    padding: 100px 72px 120px;
  }

  .workflow-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }

  @media (max-width: 960px) {
    .workflow-section { padding: 72px 24px 80px; }
    .workflow-grid { grid-template-columns: 1fr; gap: 56px; }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const STEPS = [
  {
    num: '01',
    title: 'Describe your idea',
    desc: 'Type what you\'re building. Select your tech stack, target hackathon, and team size. The whole intake takes under 60 seconds.',
    live: false,
    sources: null,
  },
  {
    num: '02',
    title: 'Live cross-platform scan',
    desc: 'ValidR searches three platforms in parallel for anything that already exists — live, not from a cached index.',
    live: true,
    sources: ['Devpost', 'GitHub', 'Product Hunt'],
  },
  {
    num: '03',
    title: 'Score + gap analysis',
    desc: 'An originality score and saturation level are calculated. The specific gap nobody\'s filled yet gets surfaced.',
    live: false,
    sources: null,
  },
  {
    num: '04',
    title: 'Verdict + idea lock',
    desc: 'You get the score, similar projects, the gap, and 3 concrete pivot suggestions. Lock your idea with a timestamp to prove it\'s yours.',
    live: false,
    sources: null,
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('intro');
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);
  const workflowRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('transition'), 2000);
    const t2 = setTimeout(() => setPhase('revealed'), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStepsVisible(true); },
      { threshold: 0.08 }
    );
    if (workflowRef.current) observer.observe(workflowRef.current);
    return () => observer.disconnect();
  }, []);

  const isRevealed = phase === 'revealed';
  const isIntro = phase === 'intro';

  const fadeUp = (delay) => ({
    opacity: isRevealed ? 1 : 0,
    transform: isRevealed ? 'translateY(0)' : 'translateY(-10px)',
    transition: isRevealed
      ? `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`
      : 'none',
  });

  const stepFade = (delaySecs) => ({
    opacity: stepsVisible ? 1 : 0,
    transform: stepsVisible ? 'translateY(0)' : 'translateY(18px)',
    transition: stepsVisible
      ? `opacity 0.55s ease ${delaySecs}s, transform 0.55s ease ${delaySecs}s`
      : 'none',
  });

  const handleSeeHow = () => {
    setShowWorkflow(true);
    setTimeout(() => workflowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <>
      <style>{styles}</style>

      {/* ─── Hero ─── */}
      <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#000000', overflow: 'hidden' }}>

        {/* Full screen 3D canvas as background */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <SceneCanvas />
        </div>

        {/* Dark overlay for text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />

        {/* Navbar on top */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px 24px 24px',
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 40,
          ...fadeUp(0),
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="brand_assests/LOGO.png" alt="ValidR logo" style={{ height: '32px', width: 'auto' }} />
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '18px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.02em',
            }}>
              ValidR
            </span>
          </div>
          <a href="#" style={{
            color: '#666666',
            fontFamily: "'Space Mono', monospace",
            fontSize: '13px',
            textDecoration: 'none',
          }}>
            Sign in
          </a>
        </nav>

        {/* Centered content on top of canvas */}
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 10,
          width: '100%',
          maxWidth: '700px',
        }}>

          {/* Live badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            border: '0.5px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '11px',
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.06em',
            padding: '5px 14px',
            borderRadius: '99px',
            marginBottom: '20px',
            ...fadeUp(0),
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7fe08a', flexShrink: 0 }} />
            247 ideas validated today
          </div>

          <h1 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '52px',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
            ...fadeUp(0.1),
          }}>
            Know before you build.
          </h1>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '15px',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
            maxWidth: '420px',
            margin: '0 auto',
            ...fadeUp(0.25),
          }}>
            Stop building ideas that already exist. Validate originality, find the gap, and pivot smart — before the hackathon starts.
          </p>

          {/* Terminal preview */}
          <div style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '10px',
            padding: '16px 20px',
            marginBottom: '24px',
            maxWidth: '380px',
            marginLeft: 'auto',
            marginRight: 'auto',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            position: 'relative',
            zIndex: 20,
            textAlign: 'left',
            ...fadeUp(0.35),
          }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
              LIVE SCAN PREVIEW
            </p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.8', marginBottom: '0' }}>&gt; scanning devpost...</p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.8', marginBottom: '0' }}>&gt; 47 similar projects found</p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', color: '#ffffff', fontWeight: '700', lineHeight: '1.8' }}>
              &gt; originality score: 23/100<span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            ...fadeUp(0.5),
          }}>
            <button className="hero-cta" onClick={() => navigate('/validate')}>
              Validate an idea →
            </button>
            <button className="hero-secondary" onClick={handleSeeHow}>
              See how it works ↓
            </button>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '20px',
            ...fadeUp(0.6),
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>50k+</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>projects indexed</span>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>3</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>data sources</span>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>8s</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>avg validation</span>
            </div>
          </div>

        </div>

      </div>

        {/* ─── How it works ─── */}
        <section ref={workflowRef} className="workflow-section">

          {/* Header */}
          <div style={{ marginBottom: '72px', ...stepFade(0) }}>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              color: '#2e2e2e',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}>
              — process
            </p>
            <h2 style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '38px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '10px',
            }}>
              From idea to verdict.
            </h2>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '13px',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
            }}>
              The full analysis runs end to end in 8 seconds.
            </p>
          </div>

          {/* Grid: timeline + verdict card */}
          <div className="workflow-grid">

            {/* Left — 4-step vertical timeline */}
            <div style={{ position: 'relative' }}>

              {/* Connector line */}
              <div style={{
                position: 'absolute',
                left: '19px',
                top: '20px',
                width: '1px',
                height: 'calc(100% - 48px)',
                background: 'linear-gradient(to bottom, #181818 0%, #181818 80%, transparent 100%)',
              }} />

              {STEPS.map((step, i) => (
                <div key={step.num} style={{
                  display: 'flex',
                  gap: '28px',
                  marginBottom: i < STEPS.length - 1 ? '52px' : 0,
                  ...stepFade(0.1 + i * 0.12),
                }}>
                  {/* Node circle */}
                  <div style={{
                    flexShrink: 0,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `1px solid ${step.live ? 'rgba(127,224,138,0.15)' : 'rgba(255,255,255,0.3)'}`,
                    background: '#060606',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    {step.live && (
                      <div style={{
                        position: 'absolute',
                        inset: '-3px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(127,224,138,0.06) 0%, transparent 70%)',
                      }} />
                    )}
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '10px',
                      fontWeight: 700,
                      color: step.live ? '#7fe08a' : '#ffffff',
                      letterSpacing: '0.04em',
                      position: 'relative',
                    }}>
                      {step.num}
                    </span>
                  </div>

                  {/* Step content */}
                  <div style={{ paddingTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '-0.01em',
                      }}>
                        {step.title}
                      </h3>
                      {step.live && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '2px 8px',
                          background: 'rgba(127,224,138,0.06)',
                          border: '1px solid rgba(127,224,138,0.18)',
                          borderRadius: '9999px',
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '9px',
                          fontWeight: 700,
                          color: '#7fe08a',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}>
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: '#7fe08a',
                            boxShadow: '0 0 5px #7fe08a',
                          }} />
                          live
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.55)',
                      lineHeight: 1.7,
                      maxWidth: '360px',
                    }}>
                      {step.desc}
                    </p>
                    {step.sources && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                        {step.sources.map((src) => (
                          <span key={src} style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '10px',
                            color: 'rgba(255,255,255,0.5)',
                            padding: '3px 10px',
                            border: '0.5px solid rgba(255,255,255,0.2)',
                            background: 'transparent',
                            borderRadius: '4px',
                          }}>
                            {src}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right — mock verdict output */}
            <div>
              <div style={{ ...stepFade(0.2) }}>
                <div style={{
                  background: '#111111',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  fontFamily: "'Space Mono', monospace",
                }}>
                  {/* Titlebar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 16px',
                    borderBottom: '1px solid #0f0f0f',
                    background: '#040404',
                  }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[0, 1, 2].map(d => (
                        <div key={d} style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#161616' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}>VALIDR — RESULT</span>
                    <div style={{ width: '42px' }} />
                  </div>

                  {/* Body */}
                  <div style={{ padding: '22px' }}>

                    {/* Score row */}
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px' }}>
                        ORIGINALITY SCORE
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ flex: 1, height: '3px', background: '#101010', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{
                            width: '84%',
                            height: '100%',
                            background: 'linear-gradient(to right, #1e1e1e, #ffffff)',
                            borderRadius: '2px',
                          }} />
                        </div>
                        <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', minWidth: '54px', textAlign: 'right' }}>
                          84 / 100
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#7fe08a', marginTop: '7px' }}>
                        High originality · Low saturation
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#0f0f0f', marginBottom: '18px' }} />

                    {/* Similar projects */}
                    <div style={{ marginBottom: '18px' }}>
                      <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px' }}>
                        SIMILAR PROJECTS FOUND: 2
                      </p>
                      {[
                        { name: 'HackCompare', meta: 'Devpost · 2023' },
                        { name: 'IdeaCheck.io', meta: 'Product Hunt · 2022' },
                      ].map((p) => (
                        <div key={p.name} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '5px',
                        }}>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>→ {p.name}</span>
                          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>{p.meta}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ height: '1px', background: '#0f0f0f', marginBottom: '18px' }} />

                    {/* Gap */}
                    <div style={{ marginBottom: '18px' }}>
                      <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        THE GAP
                      </p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>
                        No tool combines live cross-platform scanning with structured pivot suggestions in a single hackathon flow.
                      </p>
                    </div>

                    <div style={{ height: '1px', background: '#0f0f0f', marginBottom: '18px' }} />

                    {/* Pivots */}
                    <div style={{ marginBottom: '22px' }}>
                      <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px' }}>
                        PIVOT SUGGESTIONS
                      </p>
                      {[
                        'Target solo builders, not teams',
                        'Add async collaboration review',
                        'Expand beyond hackathons to early MVPs',
                      ].map((pivot, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', flexShrink: 0, marginTop: '1px' }}>→</span>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>{pivot}</span>
                        </div>
                      ))}
                    </div>

                    {/* Idea lock */}
                    <div style={{
                      padding: '10px 14px',
                      border: '1px solid #141414',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <span style={{ fontSize: '10px', color: '#222222' }}>Lock this idea with timestamp</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1a1a1a' }} />
                        <span style={{ fontSize: '8px', color: '#1e1e1e', letterSpacing: '0.12em' }}>LOCKED</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Speed callout */}
                <div style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  ...stepFade(0.55),
                }}>
                  <div style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#303030',
                    boxShadow: '0 0 6px rgba(255,255,255,0.12)',
                  }} />
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '11px',
                    color: '#2e2e2e',
                  }}>
                    Analysis completes in ~8 seconds end to end
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{
            marginTop: '80px',
            paddingTop: '40px',
            borderTop: '1px solid #0d0d0d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            ...stepFade(0.65),
          }}>
            <p style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '13px',
              color: '#2e2e2e',
            }}>
              Ready to validate your idea?
            </p>
            <button className="hero-cta" onClick={() => navigate('/validate')}>
              Start for free →
            </button>
          </div>

        </section>
    </>
  );
}
