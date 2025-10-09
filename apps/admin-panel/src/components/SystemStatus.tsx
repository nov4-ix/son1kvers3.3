// src/components/SystemStatus.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAdminStore } from '../store/useAdminStore';

export const SystemStatus: React.FC = () => {
  const { systemHealth } = useAdminStore();

  const modules = [
    { id: 'the-generator', name: 'The Generator', status: systemHealth?.modules?.theGenerator || 'offline', icon: '🎵' },
    { id: 'ghost-studio', name: 'Ghost Studio', status: systemHealth?.modules?.ghostStudio || 'offline', icon: '🎛️' },
    { id: 'nova-post-pilot', name: 'Nova Post Pilot', status: systemHealth?.modules?.novaPostPilot || 'offline', icon: '🚀' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-500/20';
      case 'offline': return 'text-red-400 bg-red-500/20';
      case 'error': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '✅';
      case 'offline': return '❌';
      case 'error': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan">📊 Estado del Sistema</h2>
      
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Estado General</p>
              <p className={`text-lg font-semibold ${
                systemHealth?.status === 'healthy' ? 'text-green-400' :
                systemHealth?.status === 'warning' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {systemHealth?.status === 'healthy' ? 'Saludable' :
                 systemHealth?.status === 'warning' ? 'Advertencia' :
                 'Crítico'}
              </p>
            </div>
            <div className="text-2xl">
              {systemHealth?.status === 'healthy' ? '✅' :
               systemHealth?.status === 'warning' ? '⚠️' :
               '🚨'}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Tokens Válidos</p>
              <p className="text-lg font-semibold text-blue-400">
                {systemHealth?.tokens?.valid || 0}/{systemHealth?.tokens?.total || 0}
              </p>
            </div>
            <div className="text-2xl">🔑</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Proxies Activos</p>
              <p className="text-lg font-semibold text-purple-400">
                {systemHealth?.proxies?.active || 0}/{systemHealth?.proxies?.total || 0}
              </p>
            </div>
            <div className="text-2xl">🌐</div>
          </div>
        </motion.div>
      </div>

      {/* Modules Status */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🔧 Módulos del Sistema</h3>
        <div className="space-y-3">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{module.icon}</span>
                <span className="font-medium text-white">{module.name}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(module.status)}`}>
                {getStatusIcon(module.status)} {module.status.toUpperCase()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Issues & Recommendations */}
      {(systemHealth?.issues?.length > 0 || systemHealth?.recommendations?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemHealth?.issues?.length > 0 && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-2">🚨 Problemas Detectados</h4>
              <ul className="space-y-1 text-sm text-red-300">
                {systemHealth.issues.map((issue: string, index: number) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {systemHealth?.recommendations?.length > 0 && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">💡 Recomendaciones</h4>
              <ul className="space-y-1 text-sm text-blue-300">
                {systemHealth.recommendations.map((rec: string, index: number) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Pixel Kamikaze Status */}
      <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🎯 Pixel Kamikaze</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">
              {systemHealth?.pixelKamikaze?.sacrifices || 0}
            </p>
            <p className="text-sm text-gray-400">Sacrificios</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {systemHealth?.pixelKamikaze?.successRate || 0}%
            </p>
            <p className="text-sm text-gray-400">Tasa de Éxito</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${
              systemHealth?.pixelKamikaze?.isActive ? 'text-green-400' : 'text-gray-400'
            }`}>
              {systemHealth?.pixelKamikaze?.isActive ? 'ACTIVO' : 'INACTIVO'}
            </p>
            <p className="text-sm text-gray-400">Estado</p>
          </div>
        </div>
      </div>
    </div>
  );
};
