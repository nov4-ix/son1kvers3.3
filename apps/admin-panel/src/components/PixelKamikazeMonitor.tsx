// src/components/PixelKamikazeMonitor.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const PixelKamikazeMonitor: React.FC = () => {
  const [missions, setMissions] = useState([
    { id: '1', type: 'token_test', status: 'completed', timestamp: new Date().toISOString() },
    { id: '2', type: 'api_test', status: 'running', timestamp: new Date().toISOString() },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan">🎯 Pixel Kamikaze Monitor</h2>
      
      <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Misiones Activas</h3>
        <div className="space-y-3">
          {missions.map((mission) => (
            <div key={mission.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🎯</span>
                <span className="font-medium text-white">{mission.type}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                mission.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                mission.status === 'running' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {mission.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
