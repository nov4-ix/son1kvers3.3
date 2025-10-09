import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToolNavigation } from '../lib/navigation';

interface VintageConsoleProps {
  className?: string;
}

const VintageConsole: React.FC<VintageConsoleProps> = ({ className = '' }) => {
  const { handleToolSelect, isRedirecting, redirectingTo } = useToolNavigation();
  const [activeButtons, setActiveButtons] = useState<Set<string>>(new Set());
  const [knobValues, setKnobValues] = useState({
    drive: 50,
    speed: 15,
    bias: 50,
    level: 75
  });

  // Mapeo de herramientas a subdominios
  const toolMapping = {
    'ghost-studio': 'ghost.son1kvers3.com',
    'clone-station': 'clone.son1kvers3.com', 
    'nova-post-pilot': 'nova.son1kvers3.com',
    'sanctuary-social': 'sanctuary.son1kvers3.com',
    'nexus-visual': 'nexus.son1kvers3.com'
  };

  const handleButtonClick = (toolId: string) => {
    if (isRedirecting) return;
    
    // Efecto visual del botón
    setActiveButtons(prev => new Set([...prev, toolId]));
    setTimeout(() => {
      setActiveButtons(prev => {
        const newSet = new Set(prev);
        newSet.delete(toolId);
        return newSet;
      });
    }, 200);

    // Redirección
    const subdomain = toolMapping[toolId as keyof typeof toolMapping];
    if (subdomain) {
      handleToolSelect(toolId, subdomain);
    }
  };

  const handleKnobChange = (knob: keyof typeof knobValues, value: number) => {
    setKnobValues(prev => ({ ...prev, [knob]: value }));
  };

  const renderKnob = (knob: keyof typeof knobValues, label: string, min = 0, max = 100) => {
    const value = knobValues[knob];
    const rotation = ((value - min) / (max - min)) * 270 - 135;

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-16 h-16 bg-gray-800 rounded-full border-2 border-gray-600 shadow-lg">
          {/* Marca del knob */}
          <div 
            className="absolute top-2 left-1/2 w-1 h-6 bg-cyan-400 rounded-full transform -translate-x-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          />
          {/* Marcas de escala */}
          {[...Array(11)].map((_, i) => {
            const angle = (i / 10) * 270 - 135;
            return (
              <div
                key={i}
                className="absolute top-2 left-1/2 w-0.5 h-3 bg-gray-500 transform -translate-x-1/2 origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
              />
            );
          })}
        </div>
        <span className="text-xs text-gray-300 font-mono">{label}</span>
        <span className="text-xs text-cyan-400 font-mono">{value}</span>
      </div>
    );
  };

  return (
    <div className={`vintage-console-container ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-4xl mx-auto"
      >
        {/* Consola Principal */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl border-2 border-gray-700 overflow-hidden">
          {/* Textura de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-transparent via-gray-600 to-transparent"></div>
          </div>

          {/* Header de la consola */}
          <div className="relative z-10 bg-gray-900 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-bold text-white font-mono">SON1K CONSOLE</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-400 font-mono">V2.1.3</div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400 font-mono">ONLINE</span>
              </div>
            </div>
          </div>

          {/* Contenido principal de la consola */}
          <div className="relative z-10 p-8">
            {/* Sección superior - COLOR / MODERN / DRIVE */}
            <div className="flex items-center justify-between mb-8">
              {/* COLOR Section */}
              <div className="flex flex-col items-center space-y-4">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">COLOR</span>
                <div className="grid grid-cols-3 gap-3">
                  {/* Ghost Studio */}
                  <motion.button
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                      activeButtons.has('ghost-studio') 
                        ? 'bg-cyan-500 border-cyan-300 text-white shadow-lg shadow-cyan-500/50' 
                        : 'bg-gray-700 border-gray-500 text-cyan-400 hover:bg-gray-600 hover:border-cyan-400'
                    } ${isRedirecting && redirectingTo === 'ghost-studio' ? 'animate-pulse' : ''}`}
                    onClick={() => handleButtonClick('ghost-studio')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isRedirecting}
                  >
                    {isRedirecting && redirectingTo === 'ghost-studio' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      '🎵'
                    )}
                  </motion.button>

                  {/* Clone Station */}
                  <motion.button
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                      activeButtons.has('clone-station') 
                        ? 'bg-purple-500 border-purple-300 text-white shadow-lg shadow-purple-500/50' 
                        : 'bg-gray-700 border-gray-500 text-purple-400 hover:bg-gray-600 hover:border-purple-400'
                    } ${isRedirecting && redirectingTo === 'clone-station' ? 'animate-pulse' : ''}`}
                    onClick={() => handleButtonClick('clone-station')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isRedirecting}
                  >
                    {isRedirecting && redirectingTo === 'clone-station' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      '🎤'
                    )}
                  </motion.button>

                  {/* Nova Post Pilot */}
                  <motion.button
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                      activeButtons.has('nova-post-pilot') 
                        ? 'bg-green-500 border-green-300 text-white shadow-lg shadow-green-500/50' 
                        : 'bg-gray-700 border-gray-500 text-green-400 hover:bg-gray-600 hover:border-green-400'
                    } ${isRedirecting && redirectingTo === 'nova-post-pilot' ? 'animate-pulse' : ''}`}
                    onClick={() => handleButtonClick('nova-post-pilot')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isRedirecting}
                  >
                    {isRedirecting && redirectingTo === 'nova-post-pilot' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      '🚀'
                    )}
                  </motion.button>
                </div>
              </div>

              {/* DRIVE Knob */}
              <div className="flex flex-col items-center space-y-4">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">DRIVE</span>
                {renderKnob('drive', 'DRIVE', 0, 100)}
              </div>

              {/* MODERN Section */}
              <div className="flex flex-col items-center space-y-4">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">MODERN</span>
                <div className="grid grid-cols-2 gap-3">
                  {/* Sanctuary Social */}
                  <motion.button
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                      activeButtons.has('sanctuary-social') 
                        ? 'bg-yellow-500 border-yellow-300 text-white shadow-lg shadow-yellow-500/50' 
                        : 'bg-gray-700 border-gray-500 text-yellow-400 hover:bg-gray-600 hover:border-yellow-400'
                    } ${isRedirecting && redirectingTo === 'sanctuary-social' ? 'animate-pulse' : ''}`}
                    onClick={() => handleButtonClick('sanctuary-social')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isRedirecting}
                  >
                    {isRedirecting && redirectingTo === 'sanctuary-social' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      '🏛️'
                    )}
                  </motion.button>

                  {/* Nexus Visual */}
                  <motion.button
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                      activeButtons.has('nexus-visual') 
                        ? 'bg-red-500 border-red-300 text-white shadow-lg shadow-red-500/50' 
                        : 'bg-gray-700 border-gray-500 text-red-400 hover:bg-gray-600 hover:border-red-400'
                    } ${isRedirecting && redirectingTo === 'nexus-visual' ? 'animate-pulse' : ''}`}
                    onClick={() => handleButtonClick('nexus-visual')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isRedirecting}
                  >
                    {isRedirecting && redirectingTo === 'nexus-visual' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      '⚡'
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Sección inferior - SPEED / TRANSPORT */}
            <div className="flex items-center justify-between">
              {/* SPEED Controls */}
              <div className="flex flex-col items-center space-y-4">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">SPEED</span>
                <div className="flex space-x-2">
                  <motion.button
                    className={`px-4 py-2 rounded-lg border-2 font-mono text-sm transition-all duration-200 ${
                      knobValues.speed === 7.5 
                        ? 'bg-cyan-500 border-cyan-300 text-white shadow-lg shadow-cyan-500/50' 
                        : 'bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600 hover:border-cyan-400'
                    }`}
                    onClick={() => setKnobValues(prev => ({ ...prev, speed: 7.5 }))}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    7.5
                  </motion.button>
                  <motion.button
                    className={`px-4 py-2 rounded-lg border-2 font-mono text-sm transition-all duration-200 ${
                      knobValues.speed === 15 
                        ? 'bg-cyan-500 border-cyan-300 text-white shadow-lg shadow-cyan-500/50' 
                        : 'bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600 hover:border-cyan-400'
                    }`}
                    onClick={() => setKnobValues(prev => ({ ...prev, speed: 15 }))}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    15
                  </motion.button>
                </div>
              </div>

              {/* TRANSPORT Controls */}
              <div className="flex flex-col items-center space-y-4">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">TRANSPORT</span>
                <div className="flex space-x-2">
                  <motion.button
                    className="w-12 h-12 rounded-lg border-2 bg-gray-700 border-gray-500 text-green-400 hover:bg-gray-600 hover:border-green-400 flex items-center justify-center text-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ▶
                  </motion.button>
                  <motion.button
                    className="w-12 h-12 rounded-lg border-2 bg-gray-700 border-gray-500 text-red-400 hover:bg-gray-600 hover:border-red-400 flex items-center justify-center text-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ■
                  </motion.button>
                  <motion.button
                    className="w-12 h-12 rounded-lg border-2 bg-gray-700 border-gray-500 text-purple-400 hover:bg-gray-600 hover:border-purple-400 flex items-center justify-center text-xl transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ●
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Efectos de luz */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Información de estado */}
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-600">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
              />
              <span className="text-cyan-400 font-mono text-sm">
                Conectando a {redirectingTo}...
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VintageConsole;

