import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getModuleLore, getFactionInfo } from '../lib/lore';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import LoadingSpinner from './ui/LoadingSpinner';

export const CloneStation: React.FC = () => {
  const { addProject } = useAppStore();
  const [isCloning, setIsCloning] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<string | null>(null);
  const [voiceText, setVoiceText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');

  // Obtener información de lore del módulo
  const moduleLore = getModuleLore('clone-station');
  const factionInfo = moduleLore ? getFactionInfo(moduleLore.faction) : null;

  const handleCloneVoice = async () => {
    if (!voiceText.trim() || !selectedVoice) return;
    
    setIsCloning(true);
    // Simular clonación de voz
    setTimeout(() => {
      setCurrentVoice(`Voz clonada: ${selectedVoice} - "${voiceText}"`);
      addProject({
        name: `Clonación de Voz - ${selectedVoice}`,
        type: 'voice',
        status: 'active',
        metadata: { voice: selectedVoice, text: voiceText }
      });
      setIsCloning(false);
    }, 3000);
  };

  const voicePresets = [
    { name: 'Nova', description: 'Voz femenina cálida y expresiva', category: 'Resistencia' },
    { name: 'Pixel', description: 'Voz androide con matices humanos', category: 'ALVAE' },
    { name: 'Cipher', description: 'Voz masculina profunda y misteriosa', category: 'Resistencia' },
    { name: 'Bella', description: 'Voz lírica emotiva y poderosa', category: 'Resistencia' },
    { name: 'Executor', description: 'Voz robótica con autoridad', category: 'XentriX' },
    { name: 'Flux', description: 'Voz temporal con ecos dimensionales', category: 'ALVAE' }
  ];

  return (
    <div className="clone-station-container">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="module-header">
            <h1 className="text-4xl font-bold text-cyan mb-2">
              🎭 Clone Station
            </h1>
            <div className="module-faction">
              <span className={`faction-badge ${factionInfo?.color}`}>
                {factionInfo?.name}
              </span>
            </div>
          </div>
          <p className="text-accent text-lg mb-4">
            {moduleLore?.purpose}
          </p>
          <div className="module-history">
            <p className="text-sm text-gray-400 italic">
              "{moduleLore?.history}"
            </p>
          </div>
        </motion.div>

        {/* Quick Clone Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="glass" glow>
            <h2 className="text-2xl font-bold text-cyan mb-6">Clonación Rápida</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Seleccionar Voz"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  icon="🎤"
                >
                  <select className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:ring-cyan-500">
                  <option value="">Selecciona una voz...</option>
                  {voicePresets.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} - {voice.category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Input
                  label="Texto a Clonar"
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  placeholder="Escribe el texto que quieres clonar..."
                  icon="📝"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleCloneVoice}
                disabled={isCloning || !voiceText.trim() || !selectedVoice}
                loading={isCloning}
                variant="nexus"
                size="lg"
                icon="🎭"
              >
                {isCloning ? 'Clonando Voz...' : 'Iniciar Clonación'}
              </Button>
            </div>
            
            {currentVoice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg"
              >
                <p className="text-green-400 font-bold">
                  ✅ Clonación Exitosa
                </p>
                <p className="text-green-300 mt-2">
                  {currentVoice}
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Voice Presets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-cyan mb-6">Biblioteca de Voces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voicePresets.map((voice, index) => (
              <Card key={index} hover>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{voice.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    voice.category === 'ALVAE' ? 'bg-purple-900/30 text-purple-300' :
                    voice.category === 'Resistencia' ? 'bg-green-900/30 text-green-300' :
                    'bg-red-900/30 text-red-300'
                  }`}>
                    {voice.category}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{voice.description}</p>
                <Button
                  onClick={() => setSelectedVoice(voice.name)}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Seleccionar
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Lore Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Card variant="nexus">
            <h3 className="text-xl font-bold text-purple-400 mb-4">
              🎭 Historia de la Clonación Vocal
            </h3>
            <div className="space-y-4 text-gray-300">
              <p>
                La Clone Station representa uno de los avances más controvertidos de la Resistencia. 
                Mientras XentriX Corp desarrollaba androides puente con voces algorítmicamente perfectas, 
                la Resistencia perfeccionó la clonación de voces auténticas.
              </p>
              <p>
                Cada voz clonada es un fragmento de humanidad preservada, una resistencia contra 
                la homogenización sonora del imperio algorítmico. No se trata de imitar, sino de 
                preservar la esencia única de cada creador.
              </p>
              <p className="text-purple-400 font-bold">
                "La voz es el alma audible. Clonarla es preservar la humanidad misma."
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
