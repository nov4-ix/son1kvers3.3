// src/components/AdminHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface AdminHeaderProps {
  isConnected: boolean;
  systemHealth: any;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ isConnected, systemHealth }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-2xl">🔧</div>
          <div>
            <h1 className="text-xl font-bold text-cyan">SON1KVERS3 Admin Panel</h1>
            <p className="text-sm text-gray-400">Control total del ecosistema</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-400' : 'bg-red-400'
            }`} />
            <span className="text-sm text-gray-300">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          
          {/* System Health */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            systemHealth?.status === 'healthy' ? 'bg-green-500/20 text-green-400' :
            systemHealth?.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {systemHealth?.status === 'healthy' ? '✅ Saludable' :
             systemHealth?.status === 'warning' ? '⚠️ Advertencia' :
             '🚨 Crítico'}
          </div>
          
          {/* Time */}
          <div className="text-sm text-gray-400">
            {new Date().toLocaleTimeString('es-ES')}
          </div>
        </div>
      </div>
    </header>
  );
};
