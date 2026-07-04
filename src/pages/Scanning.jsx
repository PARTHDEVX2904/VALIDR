import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LINES = [
  '> initializing scan...',
  '> scanning devpost database...',
  '> 50,000+ projects indexed',
  '> checking github repositories...',
  '> querying product hunt...',
  '> analyzing winner patterns...',
  '> calculating originality score...',
  '> generating verdict...',
];

const CHAR_DURATION = 600;
const PAUSE_AFTER = 400;
const TOTAL_DURATION = LINES.length * (CHAR_DURATION + PAUSE_AFTER);

const MOCK_DATA = {
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

export default function Scanning() {
  const navigate = useNavigate();
  const [doneLines, setDoneLines] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const timeoutsRef = useRef([]);

  useEffect(() => {
    let mounted = true;

    const addTimeout = (fn, delay) => {
      const id = setTimeout(fn, delay);
      timeoutsRef.current.push(id);
      return id;
    };

    const typeLine = (lineIdx) => {
      if (!mounted || lineIdx >= LINES.length) return;
      const line = LINES[lineIdx];

      setCurrentText('');

      for (let i = 1; i <= line.length; i++) {
        const delay = (i / line.length) * CHAR_DURATION;
        const partial = line.slice(0, i);
        addTimeout(() => {
          if (mounted) setCurrentText(partial);
        }, delay);
      }

      addTimeout(() => {
        if (!mounted) return;
        setDoneLines((prev) => [...prev, line]);
        setCurrentText('');

        addTimeout(() => {
          if (!mounted) return;
          if (lineIdx < LINES.length - 1) {
            typeLine(lineIdx + 1);
          } else {
            addTimeout(() => {
              if (mounted) navigate('/verdict/demo123', { state: MOCK_DATA });
            }, 500);
          }
        }, PAUSE_AFTER);
      }, CHAR_DURATION);
    };

    typeLine(0);

    return () => {
      mounted = false;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [navigate]);

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor {
          animation: blink 1s step-end infinite;
          color: #ffffff;
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        .progress-inner {
          height: 100%;
          background: #ffffff;
          animation: progressFill ${TOTAL_DURATION}ms linear forwards;
          border-radius: 1px;
        }
      `}</style>

      <Navbar />

      <main style={{
        minHeight: 'calc(100vh - 69px)',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
      }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '0.5px solid var(--border-color)',
            borderRadius: '8px',
            padding: '24px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: '1.8',
            minHeight: '240px',
          }}>
            {doneLines.map((line, i) => (
              <div key={i} style={{ color: 'var(--text-tertiary)' }}>
                {line}
              </div>
            ))}

            {currentText !== '' || doneLines.length < LINES.length ? (
              <div style={{ color: '#ffffff' }}>
                {currentText}
                <span className="cursor">_</span>
              </div>
            ) : null}
          </div>

          <div style={{
            marginTop: '16px',
            width: '100%',
            height: '2px',
            background: 'var(--bg-tertiary)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}>
            <div className="progress-inner" />
          </div>
        </div>
      </main>
    </>
  );
}
