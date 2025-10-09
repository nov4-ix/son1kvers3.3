import React from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';

interface LocationCardProps {
  name: string;
  description: string;
  status: 'active' | 'locked' | 'coming-soon';
  color: 'cyan' | 'purple' | 'gold' | 'green' | 'red';
  icon: React.ReactNode;
  className?: string;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  name,
  description,
  status,
  color,
  icon,
  className = ''
}) => {
  const colorClasses = {
    cyan: 'border-cyan-400 text-cyan-400',
    purple: 'border-purple-400 text-purple-400',
    gold: 'border-yellow-400 text-yellow-400',
    green: 'border-green-400 text-green-400',
    red: 'border-red-400 text-red-400'
  };

  const statusClasses = {
    active: 'opacity-100',
    locked: 'opacity-60',
    'coming-soon': 'opacity-80'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`${className}`}
    >
      <Card 
        variant="elevated" 
        className={`p-6 h-full transition-all duration-300 ${statusClasses[status]} hover:shadow-lg`}
      >
        {/* Icono */}
        <div className={`w-12 h-12 rounded-lg border-2 ${colorClasses[color]} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        
        {/* Título */}
        <h3 className={`text-lg font-bold ${colorClasses[color]} mb-3`}>
          {name}
        </h3>
        
        {/* Descripción */}
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          {description}
        </p>
        
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              status === 'active' ? 'bg-green-400' : 
              status === 'locked' ? 'bg-gray-400' : 
              'bg-yellow-400'
            }`}></div>
            <span className="text-xs text-gray-400 capitalize">
              {status === 'active' ? 'Disponible' : 
               status === 'locked' ? 'Bloqueado' : 
               'Próximamente'}
            </span>
          </div>
          
          {status === 'active' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 text-xs font-mono border ${colorClasses[color]} rounded hover:bg-opacity-10 transition-colors`}
            >
              ACCEDER
            </motion.button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// Componente para mostrar todas las locaciones
export const LocationsGrid: React.FC = () => {
  const locations = [
    {
      name: 'La Terminal',
      description: 'Escenario flotante donde la música se convierte en revolución. Punto de encuentro de la Resistencia.',
      status: 'active' as const,
      color: 'green' as const,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
        </svg>
      )
    },
    {
      name: 'El Estudio Fantasma',
      description: 'Lugar de creación íntima. La puerta solo se abre con una demo real.',
      status: 'active' as const,
      color: 'cyan' as const,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      )
    },
    {
      name: 'El Archivo',
      description: 'Cámara sellada de obras perdidas, custodiada por Pixel. Memoria digital de la resistencia.',
      status: 'locked' as const,
      color: 'purple' as const,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      )
    },
    {
      name: 'El Santuario',
      description: 'Red secreta de artistas premium. Zona colaborativa exclusiva para creadores avanzados.',
      status: 'coming-soon' as const,
      color: 'gold' as const,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
        </svg>
      )
    },
    {
      name: 'La Zona Muerta',
      description: 'Territorio hackeado con vestigios de arte prohibido. Solo para los más audaces.',
      status: 'locked' as const,
      color: 'red' as const,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6C8.69,6 6,8.69 6,12C6,15.31 8.69,18 12,18C15.31,18 18,15.31 18,12C18,8.69 15.31,6 12,6M12,8C9.79,8 8,9.79 8,12C8,14.21 9.79,16 12,16C14.21,16 16,14.21 16,12C16,9.79 14.21,8 12,8Z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.map((location, index) => (
        <LocationCard
          key={location.name}
          {...location}
          className="delay-100"
        />
      ))}
    </div>
  );
};

export default LocationCard;
