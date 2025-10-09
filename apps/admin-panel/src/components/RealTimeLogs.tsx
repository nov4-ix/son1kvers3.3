// src/components/RealTimeLogs.tsx
import React from 'react';

export const RealTimeLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan">📝 Logs en Tiempo Real</h2>
      <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <p className="text-gray-300">Logs del sistema...</p>
      </div>
    </div>
  );
};
