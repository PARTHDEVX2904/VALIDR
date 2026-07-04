import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const TABS = ['Trending', 'Hall of Fame', 'Graveyard'];

const FEED_ITEMS = [
  { idea: 'AI mental health journal for students', score: 23, saturation: 'high', timestamp: '2 min ago' },
  { idea: 'Blockchain voting system for college elections', score: 67, saturation: 'low', timestamp: '8 min ago' },
  { idea: 'Real-time carbon footprint tracker', score: 45, saturation: 'medium', timestamp: '15 min ago' },
  { idea: 'Voice-controlled accessibility tool', score: 78, saturation: 'low', timestamp: '23 min ago' },
  { idea: 'Peer-to-peer skill exchange platform', score: 31, saturation: 'high', timestamp: '34 min ago' },
  { idea: 'Smart irrigation system for small farms', score: 82, saturation: 'low', timestamp: '1 hr ago' },
];

function scorePillStyle(score) {
  if (score > 60) return {
    background: 'rgba(255,255,255,0.12)',
    color: '#ffffff',
    border: '0.5px solid rgba(255,255,255,0.3)',
  };
  if (score >= 30) return {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '0.5px solid var(--text-tertiary)',
  };
  return {
    background: 'transparent',
    color: 'var(--text-quaternary)',
    border: '0.5px solid var(--border-color)',
  };
}

export default function Feed() {
  const [activeTab, setActiveTab] = useState('Trending');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <style>{`
        .feed-tab {
          font-family: var(--font-mono);
          font-size: 13px;
          padding: 8px 16px;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          background: transparent;
          color: var(--text-secondary);
          transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
        }
        .feed-tab:hover:not(.feed-tab-active) { color: var(--text-primary); }
        .feed-tab.feed-tab-active { background: #ffffff; color: #000000; }
        .feed-tab:focus-visible { outline: 1px solid var(--text-secondary); outline-offset: 3px; }
        .feed-tab:active { transform: scale(0.97); }
      `}</style>

      <Navbar />

      <main style={{
        minHeight: 'calc(100vh - 69px)',
        background: 'var(--bg-primary)',
        padding: '40px 20px 80px',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '28px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '4px',
          }}>
            Live pulse
          </h1>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '32px',
          }}>
            What's trending across hackathons right now
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`feed-tab${activeTab === tab ? ' feed-tab-active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Feed cards */}
          <div>
            {FEED_ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '0.5px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: i < FEED_ITEMS.length - 1 ? '10px' : 0,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`,
                }}
              >
                {/* Idea text */}
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: '#ffffff',
                  marginBottom: '10px',
                  lineHeight: 1.5,
                }}>
                  {item.idea}
                </p>

                {/* Meta row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  {/* Score badge */}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '99px',
                    ...scorePillStyle(item.score),
                  }}>
                    {item.score}
                  </span>

                  {/* Saturation */}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    {item.saturation} sat
                  </span>

                  {/* Spacer */}
                  <span style={{ flex: 1 }} />

                  {/* Timestamp */}
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--text-tertiary)',
                  }}>
                    {item.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
