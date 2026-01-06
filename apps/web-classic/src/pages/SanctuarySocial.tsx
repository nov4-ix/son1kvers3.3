import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getModuleLore, getFactionInfo } from '../lib/lore';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import LoadingSpinner from './ui/LoadingSpinner';

export const SanctuarySocial: React.FC = () => {
  const { addProject } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentConnection, setCurrentConnection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Obtener información de lore del módulo
  const moduleLore = getModuleLore('sanctuary-social');
  const factionInfo = moduleLore ? getFactionInfo(moduleLore.faction) : null;

  const handleConnect = async () => {
    if (!searchQuery.trim()) return;

    setIsConnecting(true);
    // Simular conexión
    setTimeout(() => {
      setCurrentConnection(`Conectado con: ${searchQuery}`);
      addProject({
        name: `Conexión Sanctuary - ${searchQuery}`,
        type: 'social',
        status: 'active',
        metadata: { connection: searchQuery, category: selectedCategory }
      });
      setIsConnecting(false);
    }, 2000);
  };

  const creatorCategories = [
    { name: 'Músicos', icon: '🎵', count: 1247, description: 'Compositores y productores auténticos' },
    { name: 'Artistas Visuales', icon: '🎨', count: 892, description: 'Diseñadores y creadores visuales' },
    { name: 'Escritores', icon: '✍️', count: 634, description: 'Poetas y narradores digitales' },
    { name: 'Desarrolladores', icon: '💻', count: 445, description: 'Programadores creativos' },
    { name: 'Fotógrafos', icon: '📸', count: 789, description: 'Capturadores de momentos únicos' },
    { name: 'Performers', icon: '🎭', count: 567, description: 'Artistas escénicos y performers' }
  ];

  const featuredCreators = [
    { name: 'Nova', role: 'Voz de la Resistencia', avatar: '👩‍🎤', status: 'online', faction: 'Resistencia' },
    { name: 'Pixel', role: 'Custodio Digital', avatar: '🤖', status: 'online', faction: 'ALVAE' },
    { name: 'Cipher', role: 'Maestro del Cifrado', avatar: '👨‍💻', status: 'away', faction: 'Resistencia' },
    { name: 'Bella', role: 'Activista Musical', avatar: '👩‍🎵', status: 'online', faction: 'Resistencia' },
    { name: 'Executor', role: 'Motor de Acción', avatar: '⚡', status: 'offline', faction: 'XentriX' },
    { name: 'Flux', role: 'Manipulador Temporal', avatar: '🌀', status: 'online', faction: 'ALVAE' }
  ];

  return (
    <div className="sanctuary-social-container">
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
              🏛️ Sanctuary Social
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

        {/* Search and Connect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card variant="glass" glow>
            <h2 className="text-2xl font-bold text-cyan mb-6">Conectar con Creadores</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Input
                  label="Buscar Creador"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nombre, especialidad o proyecto..."
                  icon="🔍"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">📂 Categoría</label>
                <select
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:ring-cyan-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Todas las categorías...</option>
                  {creatorCategories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting || !searchQuery.trim()}
                  loading={isConnecting}
                  variant="nexus"
                  size="lg"
                  icon="🤝"
                  className="w-full"
                >
                  {isConnecting ? 'Conectando...' : 'Conectar'}
                </Button>
              </div>
            </div>

            {currentConnection && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg"
              >
                <p className="text-green-400 font-bold">
                  ✅ Conexión Establecida
                </p>
                <p className="text-green-300 mt-2">
                  {currentConnection}
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Creator Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-cyan mb-6">Comunidades de Creadores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatorCategories.map((category, index) => (
              <Card key={index} hover>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{category.name}</h3>
                    <p className="text-cyan-400 text-sm">{category.count} miembros</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                <Button
                  onClick={() => setSelectedCategory(category.name)}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Explorar
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Featured Creators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-cyan mb-6">Creadores Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCreators.map((creator, index) => (
              <Card key={index} hover>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-3xl">{creator.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{creator.name}</h3>
                    <p className="text-gray-400 text-sm">{creator.role}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`w-2 h-2 rounded-full ${creator.status === 'online' ? 'bg-green-400' :
                          creator.status === 'away' ? 'bg-yellow-400' :
                            'bg-gray-400'
                        }`} />
                      <span className="text-xs text-gray-400">{creator.status}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${creator.faction === 'ALVAE' ? 'bg-purple-900/30 text-purple-300' :
                      creator.faction === 'Resistencia' ? 'bg-green-900/30 text-green-300' :
                        'bg-red-900/30 text-red-300'
                    }`}>
                    {creator.faction}
                  </span>
                </div>
                <Button
                  onClick={() => setSearchQuery(creator.name)}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  Conectar
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Sanctuary Lore */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Card variant="nexus">
            <h3 className="text-xl font-bold text-purple-400 mb-4">
              🏛️ El Santuario Digital
            </h3>
            <div className="space-y-4 text-gray-300">
              <p>
                El Sanctuary Social es el último refugio de la creatividad auténtica en el mundo digital.
                Aquí, los creadores se conectan no por algoritmos, sino por pasión compartida y visión común.
              </p>
              <p>
                Cada conexión es una grieta en el sistema de XentriX, cada colaboración es un acto de resistencia.
                En el Santuario, la imperfección es sagrada y la autenticidad es la única moneda válida.
              </p>
              <p className="text-purple-400 font-bold">
                "En el Santuario, cada creador es un guardián de la humanidad."
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
