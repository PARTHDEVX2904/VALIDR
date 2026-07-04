import React, { useState } from 'react';

const TIMESTAMP = new Date().toLocaleString();
const CERT_ID = '0x7f3a...9c2e';

export default function Certificate() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <style>{`
        .cert-copy-btn {
          width: 100%;
          height: 44px;
          background: #ffffff;
          color: #000000;
          border: none;
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 24px;
          transition: background-color 0.15s ease, transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cert-copy-btn:hover { background: #e8e8e8; transform: scale(1.01); }
        .cert-copy-btn:focus-visible { outline: 2px solid #ffffff; outline-offset: 3px; }
        .cert-copy-btn:active { transform: scale(0.98); }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '100px 20px' }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '0.5px solid var(--border-color)',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
          }}>

            {/* Verified badge */}
            <span style={{
              display: 'inline-block',
              background: 'var(--bg-tertiary)',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '99px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '20px',
            }}>
              Verified
            </span>

            {/* Heading */}
            <h1 style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '24px',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '8px',
            }}>
              Idea locked
            </h1>

            {/* Subtext */}
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginBottom: '24px',
              lineHeight: 1.6,
            }}>
              This idea has been cryptographically timestamped and cannot be altered.
            </p>

            {/* Divider */}
            <div style={{
              borderTop: '0.5px solid var(--border-color)',
              margin: '24px 0',
            }} />

            {/* Idea preview */}
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              marginBottom: '20px',
              lineHeight: 1.6,
            }}>
              "AI-powered hackathon idea validator for competitive exam students"
            </p>

            {/* Timestamp row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--text-tertiary)',
              }}>
                Locked on
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--text-tertiary)',
              }}>
                {TIMESTAMP}
              </span>
            </div>

            {/* Hash row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--text-tertiary)',
              }}>
                Certificate ID
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--text-tertiary)',
              }}>
                {CERT_ID}
              </span>
            </div>

            {/* Copy button */}
            <button className="cert-copy-btn" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy link'}
            </button>

          </div>
        </div>
      </main>
    </>
  );
}
