import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MONO = "'Space Mono', monospace";

const ALL_STACK = [
  'React', 'Node.js', 'Python', 'ML/AI', 'Blockchain',
  'Mobile', 'Rust', 'Go', 'Next.js', 'TypeScript',
  'Supabase', 'Firebase',
];

const IDEAS = [
  { id: 'demo123', title: 'AI-powered UPSC answer coach',         date: 'Jul 8, 2026',  hackathon: 'SIH',     score: 71, locked: true  },
  { id: 'demo124', title: 'Hackathon idea validator',             date: 'Jul 7, 2026',  hackathon: 'MLH',     score: 34, locked: true  },
  { id: 'demo125', title: 'Voice receptionist for hotels',        date: 'Jul 5, 2026',  hackathon: 'Devfolio',score: 62, locked: false },
  { id: 'demo126', title: 'Financial literacy platform for students', date: 'Jul 3, 2026', hackathon: 'SIH', score: 78, locked: true  },
  { id: 'demo127', title: 'Goa restaurant discovery app',         date: 'Jun 28, 2026', hackathon: 'Other',   score: 45, locked: false },
  { id: 'demo128', title: 'Newsletter automation pipeline',       date: 'Jun 25, 2026', hackathon: 'MLH',     score: 55, locked: false },
  { id: 'demo129', title: 'CR assignment portal',                 date: 'Jun 20, 2026', hackathon: 'SIH',     score: 83, locked: true  },
];

function scorePill(score) {
  if (score > 60) return { bg: 'rgba(127,224,138,0.12)', color: '#7fe08a', border: '#7fe08a' };
  if (score >= 30) return { bg: 'rgba(91,155,217,0.12)',  color: '#5b9bd9', border: '#5b9bd9' };
  return               { bg: 'rgba(240,168,104,0.12)', color: '#f0a868', border: '#f0a868' };
}

const SECTION_LABEL = {
  fontFamily: MONO, fontSize: '10px', textTransform: 'uppercase',
  letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)',
  marginBottom: '12px', marginTop: '32px',
};

const CARD = {
  background: '#111111',
  border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
};

export default function Profile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing]       = useState(false);
  const [name, setName]                 = useState('Aditi');
  const [bio, setBio]                   = useState(
    'CS student building at the intersection of AI and developer tools. INFIN8 Club core organizer. Always validating before building.'
  );
  const [draftName, setDraftName]       = useState(name);
  const [draftBio, setDraftBio]         = useState(bio);
  const [selectedStack, setSelectedStack] = useState(['React', 'Node.js', 'Python', 'Next.js']);

  const startEdit = () => { setDraftName(name); setDraftBio(bio); setIsEditing(true); };
  const saveEdit  = () => { setName(draftName); setBio(draftBio); setIsEditing(false); };
  const cancelEdit = () => setIsEditing(false);

  const toggleStack = (tech) =>
    setSelectedStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );

  const locked = IDEAS.filter((i) => i.locked);

  const inputStyle = {
    fontFamily: MONO, fontSize: '13px', color: '#ffffff',
    background: 'rgba(255,255,255,0.04)',
    border: '0.5px solid rgba(255,255,255,0.15)',
    borderRadius: '6px', padding: '8px 12px',
    width: '100%', outline: 'none', resize: 'vertical',
    lineHeight: 1.6,
  };

  return (
    <>
      <style>{`
        .p-btn-save {
          fontFamily: ${MONO}; font-size: 12px; font-weight: 700;
          background: #ffffff; color: #000000;
          border: none; border-radius: 6px;
          padding: 7px 16px; cursor: pointer;
          transition: background-color 150ms ease, transform 150ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .p-btn-save:hover { background: #e8e8e8; transform: scale(1.01); }
        .p-btn-save:active { transform: scale(0.98); }
        .p-btn-save:focus-visible { outline: 2px solid #ffffff; outline-offset: 3px; }

        .p-btn-cancel {
          font-family: ${MONO}; font-size: 12px; font-weight: 700;
          background: transparent; color: rgba(255,255,255,0.5);
          border: 0.5px solid rgba(255,255,255,0.2); border-radius: 6px;
          padding: 7px 16px; cursor: pointer;
          transition: border-color 150ms ease, color 150ms ease, transform 150ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .p-btn-cancel:hover { border-color: rgba(255,255,255,0.4); color: rgba(255,255,255,0.8); transform: scale(1.01); }
        .p-btn-cancel:active { transform: scale(0.98); }
        .p-btn-cancel:focus-visible { outline: 1px solid rgba(255,255,255,0.4); outline-offset: 3px; }

        .p-btn-edit {
          font-family: ${MONO}; font-size: 11px;
          background: transparent; color: rgba(255,255,255,0.5);
          border: 0.5px solid rgba(255,255,255,0.2); border-radius: 6px;
          padding: 6px 14px; cursor: pointer;
          transition: border-color 150ms ease, color 150ms ease, transform 150ms cubic-bezier(0.34,1.56,0.64,1);
          white-space: nowrap; flex-shrink: 0;
        }
        .p-btn-edit:hover { border-color: rgba(255,255,255,0.4); color: rgba(255,255,255,0.8); transform: scale(1.01); }
        .p-btn-edit:active { transform: scale(0.98); }
        .p-btn-edit:focus-visible { outline: 1px solid rgba(255,255,255,0.4); outline-offset: 3px; }

        .p-cert-btn {
          font-family: ${MONO}; font-size: 11px;
          color: #7fe08a; background: transparent;
          border: 0.5px solid rgba(127,224,138,0.3); border-radius: 6px;
          padding: 5px 12px; cursor: pointer; white-space: nowrap;
          transition: border-color 150ms ease, background-color 150ms ease, transform 150ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .p-cert-btn:hover { border-color: rgba(127,224,138,0.6); background: rgba(127,224,138,0.06); transform: scale(1.01); }
        .p-cert-btn:active { transform: scale(0.98); }
        .p-cert-btn:focus-visible { outline: 1px solid #7fe08a; outline-offset: 3px; }

        .p-stack-pill {
          font-family: ${MONO}; font-size: 11px;
          border-radius: 99px; padding: 5px 12px;
          cursor: pointer;
          transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease, transform 150ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .p-stack-pill:hover { transform: scale(1.04); }
        .p-stack-pill:active { transform: scale(0.97); }
        .p-stack-pill:focus-visible { outline: 1px solid rgba(255,255,255,0.5); outline-offset: 2px; }
      `}</style>

      <Navbar />

      <main style={{ minHeight: 'calc(100vh - 69px)', background: '#000000', padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* ── Profile header card ── */}
          <div style={{ ...CARD, padding: '28px', marginBottom: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>

              {/* Avatar */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,255,255,0.06)',
                border: '0.5px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: MONO, fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>AD</span>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
                  {isEditing ? (
                    <input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      style={{ ...inputStyle, fontSize: '18px', fontWeight: 700, padding: '6px 10px', width: 'auto', maxWidth: '220px' }}
                    />
                  ) : (
                    <p style={{ fontFamily: MONO, fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: 0 }}>{name}</p>
                  )}
                  {!isEditing && (
                    <button className="p-btn-edit" onClick={startEdit}>Edit profile</button>
                  )}
                </div>

                <p style={{ fontFamily: MONO, fontSize: '12px', color: 'rgba(255,255,255,0.35)', margin: '0 0 12px' }}>@aditi_builds</p>

                {isEditing ? (
                  <textarea
                    value={draftBio}
                    onChange={(e) => setDraftBio(e.target.value)}
                    rows={3}
                    style={inputStyle}
                  />
                ) : (
                  <p style={{ fontFamily: MONO, fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{bio}</p>
                )}

                {isEditing && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button className="p-btn-save" onClick={saveEdit}>Save changes</button>
                    <button className="p-btn-cancel" onClick={cancelEdit}>Cancel</button>
                  </div>
                )}

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                  {[
                    { num: '7', label: 'ideas validated' },
                    { num: '3', label: 'ideas locked' },
                    { num: '2', label: 'hackathons targeted' },
                  ].map((s) => (
                    <div key={s.label} style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '0.5px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px', padding: '8px 16px', textAlign: 'center',
                    }}>
                      <p style={{ fontFamily: MONO, fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: 0 }}>{s.num}</p>
                      <p style={{ fontFamily: MONO, fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px', margin: '2px 0 0' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Tech stack preferences ── */}
          <p style={SECTION_LABEL}>— MY STACK</p>
          <div style={{ ...CARD, padding: '20px', marginBottom: '0' }}>
            <p style={{ fontFamily: MONO, fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>Your preferred tech stack</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ALL_STACK.map((tech) => {
                const sel = selectedStack.includes(tech);
                return (
                  <button
                    key={tech}
                    className="p-stack-pill"
                    onClick={() => toggleStack(tech)}
                    style={{
                      background: sel ? '#ffffff' : 'transparent',
                      color: sel ? '#000000' : 'rgba(255,255,255,0.4)',
                      border: `0.5px solid ${sel ? '#ffffff' : 'rgba(255,255,255,0.15)'}`,
                      fontWeight: sel ? 700 : 400,
                    }}
                  >
                    {tech}
                  </button>
                );
              })}
            </div>
            <p style={{ fontFamily: MONO, fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '12px', marginBottom: 0 }}>
              These pre-fill your future validations automatically.
            </p>
          </div>

          {/* ── Validated ideas history ── */}
          <p style={SECTION_LABEL}>— VALIDATED IDEAS</p>
          <div>
            {IDEAS.map((idea) => {
              const pill = scorePill(idea.score);
              return (
                <div key={idea.id} style={{
                  background: '#111111',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '16px 20px',
                  marginBottom: '8px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 700, color: '#ffffff', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {idea.title}
                    </p>
                    <p style={{ fontFamily: MONO, fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                      {idea.date} · {idea.hackathon}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {idea.locked && (
                      <span style={{ fontFamily: MONO, fontSize: '9px', color: 'rgba(127,224,138,0.6)', letterSpacing: '0.05em' }}>🔒 LOCKED</span>
                    )}
                    <span style={{
                      fontFamily: MONO, fontSize: '11px', fontWeight: 700,
                      padding: '3px 10px', borderRadius: '99px',
                      background: pill.bg, color: pill.color,
                      border: `0.5px solid ${pill.border}`,
                    }}>
                      {idea.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Locked certificates ── */}
          <p style={SECTION_LABEL}>— LOCKED CERTIFICATES</p>
          <div>
            {locked.map((idea) => (
              <div key={idea.id} style={{
                background: 'rgba(127,224,138,0.04)',
                border: '0.5px solid rgba(127,224,138,0.2)',
                borderRadius: '10px', padding: '16px 20px',
                marginBottom: '8px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
              }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: MONO, fontSize: '13px', fontWeight: 700, color: '#ffffff', margin: '0 0 4px' }}>
                    🔒 {idea.title}
                  </p>
                  <p style={{ fontFamily: MONO, fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: '0 0 3px' }}>
                    Locked on {idea.date}
                  </p>
                  <p style={{ fontFamily: MONO, fontSize: '10px', color: 'rgba(127,224,138,0.5)', margin: 0 }}>
                    0x7f3a...9c2e
                  </p>
                </div>
                <button className="p-cert-btn" onClick={() => navigate(`/certificate/${idea.id}`)}>
                  View certificate →
                </button>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
