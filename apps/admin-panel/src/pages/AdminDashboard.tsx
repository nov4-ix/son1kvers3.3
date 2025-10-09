// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminHeader } from '../components/AdminHeader';
import { SystemStatus } from '../components/SystemStatus';
import { PixelKamikazeMonitor } from '../components/PixelKamikazeMonitor';
import { TokenManager } from '../components/TokenManager';
import { ProxyManager } from '../components/ProxyManager';
import { RealTimeLogs } from '../components/RealTimeLogs';
import { StripeManager } from '../components/StripeManager';
import { useAdminStore } from '../store/useAdminStore';
import { AdminService } from '../services/AdminService';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isConnected, setIsConnected] = useState(false);
  const { systemHealth, updateSystemHealth } = useAdminStore();
  const adminService = AdminService.getInstance();

  useEffect(() => {
    // Conectar al servicio administrativo
    const connect = async () => {
      try {
        await adminService.connect();
        setIsConnected(true);
        console.log('🔧 Conectado al panel administrativo');
      } catch (error) {
        console.error('❌ Error conectando:', error);
        setIsConnected(false);
      }
    };

    connect();

    // Actualizar estado del sistema cada 5 segundos
    const interval = setInterval(async () => {
      try {
        const health = await adminService.getSystemHealth();
        updateSystemHealth(health);
      } catch (error) {
        console.error('❌ Error obteniendo salud del sistema:', error);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      adminService.disconnect();
    };
  }, [adminService, updateSystemHealth]);

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'pixel', label: '🎯 Pixel Kamikaze', icon: '🎯' },
    { id: 'tokens', label: '🔑 Tokens', icon: '🔑' },
    { id: 'proxies', label: '🌐 Proxies', icon: '🌐' },
    { id: 'stripe', label: '💳 Stripe', icon: '💳' },
    { id: 'logs', label: '📝 Logs', icon: '📝' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SystemStatus />;
      case 'pixel':
        return <PixelKamikazeMonitor />;
      case 'tokens':
        return <TokenManager />;
      case 'proxies':
        return <ProxyManager />;
      case 'stripe':
        return <StripeManager />;
      case 'logs':
        return <RealTimeLogs />;
      default:
        return <SystemStatus />;
    }
  };

  return (
    <div className="min-h-screen bg-carbon text-white">
      {/* Header */}
      <AdminHeader 
        isConnected={isConnected}
        systemHealth={systemHealth}
      />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900/50 backdrop-blur-xl border-r border-white/10 min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-bold text-cyan mb-6">🔧 Admin Panel</h2>
            
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-cyan/20 text-cyan border border-cyan/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>

            {/* Status Indicator */}
            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className="text-sm font-medium">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {systemHealth.status === 'healthy' ? '✅ Sistema saludable' :
                 systemHealth.status === 'warning' ? '⚠️ Advertencias' :
                 '🚨 Problemas críticos'}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Overlay */}
      {typeof window !== 'undefined' && window.innerWidth < 768 && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className="text-xs text-gray-300">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
