import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ToolButtonProps {
  label: string;
  subdomain: string;
  icon: React.ReactNode;
  color: 'cyan' | 'purple' | 'green' | 'red' | 'gold';
  position: { x: number; y: number };
  onClick: () => void;
  isActive?: boolean;
  isLoading?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  label,
  subdomain,
  icon,
  color,
  position,
  onClick,
  isActive = false,
  isLoading = false
}) => {
  const colorClasses = {
    cyan: 'bg-cyan-400/20 border-cyan-400 text-cyan-400',
    purple: 'bg-purple-400/20 border-purple-400 text-purple-400',
    green: 'bg-green-400/20 border-green-400 text-green-400',
    red: 'bg-red-400/20 border-red-400 text-red-400',
    gold: 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
  };

  return (
    <motion.button
      className={`
        absolute w-16 h-12 rounded-lg border-2
        ${colorClasses[color]}
        ${isActive ? 'shadow-lg shadow-current/50' : 'shadow-md'}
        ${isLoading ? 'animate-pulse' : ''}
        backdrop-blur-sm
        flex items-center justify-center
        hover:scale-105 hover:shadow-xl
        transition-all duration-300
        cursor-pointer
        font-mono text-xs font-bold
        relative overflow-hidden
      `}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={isLoading}
    >
      {/* Efecto de brillo interno */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
      
      {/* Contenido */}
      <div className="relative z-10 flex items-center space-x-1">
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          <>
            <span className="text-lg">{icon}</span>
            <span className="text-xs">{label}</span>
          </>
        )}
      </div>
      
      {/* Indicador LED */}
      <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
        isLoading ? 'bg-yellow-400 animate-pulse' : 
        isActive ? 'bg-green-400' : 'bg-gray-500'
      }`}></div>
      
      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-lg px-3 py-2 text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
        <div className="font-bold text-white">{label}</div>
        <div className="text-gray-300">{subdomain}</div>
        <div className={`text-xs ${
          isLoading ? 'text-yellow-400' : 
          isActive ? 'text-green-400' : 'text-gray-400'
        }`}>
          {isLoading ? 'Cargando...' : isActive ? 'Activo' : 'Standby'}
        </div>
      </div>
    </motion.button>
  );
};

interface ProfessionalConsoleProps {
  onToolSelect: (tool: string, subdomain: string) => void;
  isLoading?: boolean;
  loadingTool?: string | null;
}

export const ProfessionalConsole: React.FC<ProfessionalConsoleProps> = ({ 
  onToolSelect, 
  isLoading = false, 
  loadingTool = null 
}) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'ghost-studio',
      label: 'GHOST',
      subdomain: 'ghost.son1kvers3.com',
      icon: '🎵',
      color: 'cyan' as const,
      position: { x: 15, y: 75 }
    },
    {
      id: 'clone-station',
      label: 'CLONE',
      subdomain: 'clone.son1kvers3.com',
      icon: '🎤',
      color: 'purple' as const,
      position: { x: 35, y: 75 }
    },
    {
      id: 'nova-post-pilot',
      label: 'NOVA',
      subdomain: 'nova.son1kvers3.com',
      icon: '🚀',
      color: 'green' as const,
      position: { x: 55, y: 75 }
    },
    {
      id: 'sanctuary-social',
      label: 'SOCIAL',
      subdomain: 'sanctuary.son1kvers3.com',
      icon: '🏛️',
      color: 'gold' as const,
      position: { x: 75, y: 75 }
    },
    {
      id: 'nexus-visual',
      label: 'NEXUS',
      subdomain: 'nexus.son1kvers3.com',
      icon: '⚡',
      color: 'red' as const,
      position: { x: 85, y: 45 }
    }
  ];

  const handleToolClick = (tool: typeof tools[0]) => {
    setActiveTool(tool.id);
    onToolSelect(tool.id, tool.subdomain);
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
      {/* Fondo con textura metálica */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-900/80"></div>
      
      {/* Patrón de textura */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Header de la consola */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gray-800/80 backdrop-blur-sm border-b border-gray-600 flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-white font-mono font-bold">SON1KVERS3</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-xs font-mono">ONLINE</span>
        </div>
        
        <div className="text-gray-400 text-xs font-mono">
          PROTOCOL ALPHA.01
        </div>
      </div>

      {/* VU Meters simulados */}
      <div className="absolute top-16 left-4 right-4 h-8 bg-gray-900/50 rounded-lg border border-gray-600 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-xs font-mono">VU</span>
          <div className="w-24 h-4 bg-gray-800 rounded border border-gray-600 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 opacity-30 rounded"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-white rounded"></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-24 h-4 bg-gray-800 rounded border border-gray-600 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 opacity-30 rounded"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-white rounded"></div>
          </div>
          <span className="text-gray-400 text-xs font-mono">VU</span>
        </div>
      </div>

      {/* Área principal de la consola */}
      <div className="absolute top-28 left-4 right-4 bottom-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-600 p-4">
        
        {/* Sección COLOR */}
        <div className="absolute left-4 top-4">
          <div className="text-gray-400 text-xs font-mono mb-2">COLOR</div>
          <div className="flex space-x-2">
            {tools.slice(0, 3).map((tool, index) => (
              <ToolButton
                key={tool.id}
                {...tool}
                onClick={() => handleToolClick(tool)}
                isActive={activeTool === tool.id}
                isLoading={loadingTool === tool.id}
                position={{ x: index * 20, y: 0 }}
              />
            ))}
          </div>
        </div>

        {/* Sección MODERN/DRIVE */}
        <div className="absolute left-1/2 top-4 transform -translate-x-1/2 text-center">
          <div className="text-gray-400 text-xs font-mono mb-2">MODERN</div>
          <div className="flex space-x-2 mb-4">
            <ToolButton
              {...tools[3]}
              onClick={() => handleToolClick(tools[3])}
              isActive={activeTool === tools[3].id}
              isLoading={loadingTool === tools[3].id}
              position={{ x: 0, y: 0 }}
            />
            <ToolButton
              {...tools[4]}
              onClick={() => handleToolClick(tools[4])}
              isActive={activeTool === tools[4].id}
              isLoading={loadingTool === tools[4].id}
              position={{ x: 20, y: 0 }}
            />
          </div>
          
          {/* Knob central */}
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-full h-full rounded-full border-2 border-gray-600 bg-gray-700/50 flex items-center justify-center">
              <div className="w-2 h-8 bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full"></div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-xs font-mono">DRIVE</div>
          </div>
        </div>

        {/* Sección SPEED/TRANSPORT */}
        <div className="absolute right-4 top-4">
          <div className="text-gray-400 text-xs font-mono mb-2">SPEED</div>
          <div className="flex space-x-2 mb-4">
            <div className="w-12 h-8 bg-gray-700/50 border border-gray-600 rounded flex items-center justify-center text-gray-400 text-xs font-mono">
              7.5
            </div>
            <div className="w-12 h-8 bg-cyan-400/20 border border-cyan-400 rounded flex items-center justify-center text-cyan-400 text-xs font-mono">
              15
            </div>
          </div>
          
          <div className="text-gray-400 text-xs font-mono mb-2">TRANSPORT</div>
          <div className="flex space-x-2">
            <div className="w-12 h-8 bg-green-400/20 border border-green-400 rounded flex items-center justify-center text-green-400 text-xs">
              ▶
            </div>
            <div className="w-12 h-8 bg-gray-700/50 border border-gray-600 rounded flex items-center justify-center text-gray-400 text-xs">
              ⏹
            </div>
            <div className="w-16 h-8 bg-gray-700/50 border border-gray-600 rounded flex items-center justify-center text-gray-400 text-xs font-mono">
              0 1 BAR
            </div>
          </div>
        </div>

        {/* Estado del sistema */}
        <div className="absolute bottom-4 left-4 right-4 bg-gray-900/50 rounded border border-gray-600 p-3">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-xs font-mono">
              {activeTool ? `ACTIVE: ${tools.find(t => t.id === activeTool)?.label}` : 'SYSTEM STANDBY'}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-xs font-mono">OPERATIONAL</span>
              </div>
              <div className="text-gray-400 text-xs font-mono">ACCESS: AUTHORIZED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalConsole;
