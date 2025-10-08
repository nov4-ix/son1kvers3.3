import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { GhostStudio } from './pages/GhostStudio';
import { CloneStation } from './pages/CloneStation';
import { NovaPostPilot } from './pages/NovaPostPilot';
import { SanctuarySocial } from './pages/SanctuarySocial';
import { NexusVisual } from './pages/NexusVisual';
import { Settings } from './pages/Settings';
import { Projects } from './pages/Projects';
import { Layout } from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ghost-studio" element={<GhostStudio />} />
        <Route path="/clone-station" element={<CloneStation />} />
        <Route path="/nova-post-pilot" element={<NovaPostPilot />} />
        <Route path="/sanctuary-social" element={<SanctuarySocial />} />
        <Route path="/nexus-visual" element={<NexusVisual />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;