import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getModuleLore, getFactionInfo } from '../lib/lore';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import LoadingSpinner from './ui/LoadingSpinner';

export const NovaPostPilot: React.FC = () => {
  const { addProject } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPost, setCurrentPost] = useState<string | null>(null);
  const [postContent, setPostContent] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');

  // Obtener información de lore del módulo
  const moduleLore = getModuleLore('nova-post-pilot');
  const factionInfo = moduleLore ? getFactionInfo(moduleLore.faction) : null;

  const handleGeneratePost = async () => {
    if (!postContent.trim() || !selectedPlatform) return;

    setIsGenerating(true);
    // Simular generación de post
    setTimeout(() => {
      setCurrentPost(`Post generado para ${selectedPlatform}: "${postContent}"`);
      addProject({
        name: `Post ${selectedPlatform} - ${new Date().toLocaleTimeString()}`,
        type: 'social',
        status: 'active',
        metadata: { platform: selectedPlatform, content: postContent, style: selectedStyle }
      });
      setIsGenerating(false);
    }, 2000);
  };

  const platforms = [
    { name: 'Instagram', icon: '📸', color: 'bg-pink-900/30 text-pink-300' },
    { name: 'TikTok', icon: '🎵', color: 'bg-black/30 text-white' },
    { name: 'Twitter', icon: '🐦', color: 'bg-blue-900/30 text-blue-300' },
    { name: 'YouTube', icon: '📺', color: 'bg-red-900/30 text-red-300' },
    { name: 'LinkedIn', icon: '💼', color: 'bg-blue-800/30 text-blue-200' }
  ];

  const contentStyles = [
    { name: 'Resistencia', description: 'Contenido auténtico y rebelde', category: 'Resistencia' },
    { name: 'ALVAE', description: 'Contenido creativo y espiritual', category: 'ALVAE' },
    { name: 'Neutral', description: 'Contenido equilibrado y profesional', category: 'Neutral' },
    { name: 'Underground', description: 'Contenido alternativo y experimental', category: 'Resistencia' }
  ];

  return (
    <div className="nova-post-pilot-container">
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
              🚀 Nova Post Pilot
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

        {/* Quick Post Generation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="glass" glow>
            <h2 className="text-2xl font-bold text-cyan mb-6">Generación Inteligente de Contenido</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">📱 Plataforma</label>
                <select
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:ring-cyan-500"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <option value="">Selecciona plataforma...</option>
                  {platforms.map((platform) => (
                    <option key={platform.name} value={platform.name}>
                      {platform.icon} {platform.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">🎨 Estilo de Contenido</label>
                <select
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:ring-cyan-500"
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                >
                  <option value="">Selecciona estilo...</option>
                  {contentStyles.map((style) => (
                    <option key={style.name} value={style.name}>
                      {style.name} - {style.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Input
                  label="Prompt de Contenido"
                  value={postContent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostContent(e.target.value)}
                  placeholder="Describe el contenido que quieres crear..."
                  icon="✍️"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleGeneratePost}
                disabled={isGenerating || !postContent.trim() || !selectedPlatform}
                loading={isGenerating}
                variant="nexus"
                size="lg"
                icon="🚀"
              >
                {isGenerating ? 'Generando Contenido...' : 'Generar Post'}
              </Button>
            </div>

            {currentPost && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg"
              >
                <p className="text-green-400 font-bold">
                  ✅ Contenido Generado
                </p>
                <p className="text-green-300 mt-2">
                  {currentPost}
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Platform Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-cyan mb-6">Plataformas Soportadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <Card key={index} hover>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl">{platform.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{platform.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${platform.color}`}>
                      Optimizado
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Contenido optimizado para {platform.name} con algoritmos de la Resistencia
                </p>
                <Button
                  onClick={() => setSelectedPlatform(platform.name)}
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

        {/* Graffiti Scene Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Card variant="nexus">
            <h3 className="text-xl font-bold text-purple-400 mb-4">
              🎨 La Escena del Grafiti
            </h3>
            <div className="space-y-4 text-gray-300">
              <p>
                En las calles de Neo-Tokyo, donde la propaganda de XentriX Corp cubre cada muro,
                la Resistencia responde con arte callejero auténtico. Cada post generado por Nova Post Pilot
                es como un grafiti digital: una declaración de resistencia contra el control algorítmico.
              </p>
              <p>
                Los algoritmos de XentriX buscan homogenizar el contenido, pero Nova Post Pilot
                preserva la imperfección sagrada de la creatividad humana. Cada post es único,
                cada mensaje es una grieta en el sistema.
              </p>
              <p className="text-purple-400 font-bold">
                "Cada post es un grafiti digital. Cada mensaje es resistencia."
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
