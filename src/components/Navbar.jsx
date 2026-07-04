import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoUrl from '../../brand_assests/LOGO.png';

const navLinks = [
  { label: 'Validate', to: '/validate' },
  { label: 'Feed', to: '/feed' },
  { label: 'Profile', to: '/profile' },
];

export default function Navbar() {
  return (
    <>
      <style>{`
        .nav-link {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #888888;
          text-decoration: none;
          transition: color 150ms ease;
          outline: none;
        }
        .nav-link:hover,
        .nav-link.active {
          color: #ffffff;
        }
        .nav-link:focus-visible {
          color: #ffffff;
          outline: 1px solid #ffffff;
          outline-offset: 4px;
          border-radius: 2px;
        }
      `}</style>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        background: '#000000',
        borderBottom: '0.5px solid #1a1a1a',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src={logoUrl} alt="ValidR" style={{ height: '36px', width: 'auto' }} />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
