import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GhostStudio } from './pages/GhostStudio';

function App() {
  return (
    <Routes>
      <Route path="/" element={<GhostStudio />} />
      <Route path="/ghost-studio" element={<GhostStudio />} />
    </Routes>
  );
}

export default App;