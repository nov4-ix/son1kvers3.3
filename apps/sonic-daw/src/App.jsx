import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SonicDAW } from './pages/SonicDAW';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SonicDAW />} />
      <Route path="/sonic-daw" element={<SonicDAW />} />
    </Routes>
  );
}

export default App;