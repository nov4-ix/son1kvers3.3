import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

interface ModuleCardProps {
  module: {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: 'online' | 'offline' | 'maintenance';
    url: string;
    lastActivity?: string;
  };
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const { setActiveModule } = useAppStore();

  const handleClick = () => {
    setActiveModule(module.id);
    // In a real app, this would navigate to the module
    console.log(`Navigating to ${module.name}: ${module.url}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#00FF88';
      case 'offline': return '#FF4444';
      case 'maintenance': return '#FFAA00';
      default: return '#6C757D';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'maintenance': return 'Mantenimiento';
      default: return 'Desconocido';
    }
  };

  return (
    <motion.div
      className="module-card"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="module-icon">{module.icon}</div>
      <h3 className="module-title">{module.name}</h3>
      <p className="module-description">{module.description}</p>
      <div className="module-status">
        <div 
          className="status-dot" 
          style={{ backgroundColor: getStatusColor(module.status) }}
        />
        <span>{getStatusText(module.status)}</span>
      </div>
    </motion.div>
  );
};