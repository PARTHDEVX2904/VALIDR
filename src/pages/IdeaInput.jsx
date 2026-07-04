import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PillSelect from '../components/PillSelect';

const TECH_STACK = [
  'React', 'Node.js', 'Python', 'ML/AI', 'Blockchain',
  'Mobile', 'Rust', 'Go', 'Next.js', 'TypeScript',
];
const HACKATHONS = [
  'SIH', 'MLH', 'ETHGlobal', 'Devfolio', 'HackMIT', 'HackHarvard', 'Other',
];
const TEAM_SIZES = ['Solo', '2-3 people', '4-5 people'];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

function SectionLabel({ text }) {
  return (
    <p style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'var(--text-quaternary)',
      marginBottom: '8px',
      marginTop: '20px',
    }}>
      {text}
    </p>
  );
}

export default function IdeaInput() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState('');
  const [techStack, setTechStack] = useState([]);
  const [hackathon, setHackathon] = useState([]);
  const [teamSize, setTeamSize] = useState(null);
  const [experience, setExperience] = useState(null);

  const isEmpty = idea.trim() === '';

  const handleValidate = () => {
    if (isEmpty) return;
    navigate('/scanning', { state: { idea, techStack, hackathon, teamSize, experience } });
  };

  return (
    <>
      <style>{`
        .idea-textarea {
          width: 100%;
          background: var(--bg-tertiary);
          border: 0.5px solid var(--border-color);
          color: #ffffff;
          font-family: var(--font-mono);
          font-size: 14px;
          min-height: 120px;
          border-radius: 8px;
          padding: 12px 14px;
          resize: none;
          line-height: 1.6;
          transition: border-color 0.15s ease;
        }
        .idea-textarea::placeholder {
          color: var(--text-quaternary);
        }
        .idea-textarea:focus {
          outline: none;
          border-color: var(--text-tertiary);
        }
        .validate-btn {
          width: 100%;
          height: 48px;
          background: #ffffff;
          color: #000000;
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 700;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          margin-top: 24px;
          transition: background-color 0.15s ease, transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
        }
        .validate-btn:hover:not(:disabled) {
          background: #e8e8e8;
          transform: scale(1.01);
        }
        .validate-btn:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 3px;
        }
        .validate-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .validate-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <Navbar />

      <main style={{
        minHeight: 'calc(100vh - 69px)',
        background: 'var(--bg-primary)',
        padding: '80px 16px',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '32px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}>
            What are you building?
          </h1>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '0.5px solid var(--border-color)',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <textarea
              className="idea-textarea"
              placeholder="Describe your hackathon idea in a few sentences..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />

            <SectionLabel text="Tech Stack" />
            <PillSelect
              options={TECH_STACK}
              selected={techStack}
              onChange={setTechStack}
              multi
            />

            <SectionLabel text="Target Hackathon" />
            <PillSelect
              options={HACKATHONS}
              selected={hackathon}
              onChange={setHackathon}
              multi
            />

            <SectionLabel text="Team Size" />
            <PillSelect
              options={TEAM_SIZES}
              selected={teamSize}
              onChange={setTeamSize}
            />

            <SectionLabel text="Experience Level" />
            <PillSelect
              options={EXPERIENCE_LEVELS}
              selected={experience}
              onChange={setExperience}
            />

            <button
              className="validate-btn"
              onClick={handleValidate}
              disabled={isEmpty}
            >
              Validate Idea →
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
