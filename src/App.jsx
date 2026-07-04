import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './globals.css';

import Hero from '../Hero.jsx';
import IdeaInput from './pages/IdeaInput';
import Scanning from './pages/Scanning';
import Verdict from './pages/Verdict';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Certificate from './pages/Certificate';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/validate" element={<IdeaInput />} />
        <Route path="/scanning" element={<Scanning />} />
        <Route path="/verdict/:id" element={<Verdict />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/certificate/:id" element={<Certificate />} />
      </Routes>
    </BrowserRouter>
  );
}
