import React from 'react';
import Navbar from '../components/Navbar';

export default function Profile() {
  return (
    <>
      <Navbar />
      <main style={{
        minHeight: 'calc(100vh - 69px)',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          color: 'var(--text-primary)',
          letterSpacing: '0.1em',
        }}>
          Profile
        </span>
      </main>
    </>
  );
}
