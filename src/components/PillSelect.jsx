import React from 'react';

export default function PillSelect({ options, selected, onChange, multi = false }) {
  const isSelected = (opt) =>
    multi ? selected.includes(opt) : selected === opt;

  const handleClick = (opt) => {
    if (multi) {
      onChange(
        selected.includes(opt)
          ? selected.filter((s) => s !== opt)
          : [...selected, opt]
      );
    } else {
      onChange(selected === opt ? null : opt);
    }
  };

  return (
    <>
      <style>{`
        .pill-btn {
          border: 0.5px solid var(--border-color);
          background: transparent;
          color: var(--text-secondary);
          border-radius: 99px;
          padding: 6px 14px;
          font-family: var(--font-mono);
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
        }
        .pill-btn:hover:not(.pill-selected) {
          border-color: var(--text-tertiary);
          color: var(--text-primary);
        }
        .pill-btn.pill-selected {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }
        .pill-btn.pill-selected:hover {
          background: #e8e8e8;
          border-color: #e8e8e8;
        }
        .pill-btn:focus-visible {
          outline: 1px solid var(--text-secondary);
          outline-offset: 3px;
        }
        .pill-btn:active {
          transform: scale(0.97);
        }
      `}</style>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map((opt) => (
          <button
            key={opt}
            className={`pill-btn${isSelected(opt) ? ' pill-selected' : ''}`}
            onClick={() => handleClick(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </>
  );
}
