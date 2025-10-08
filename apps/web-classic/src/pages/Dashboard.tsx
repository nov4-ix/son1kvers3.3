import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export const Dashboard: React.FC = () => {
  const { addProject } = useAppStore();
  const [expresividad, setExpresividad] = useState(75);
  const [afinacion, setAfinacion] = useState(75);
  const [eqValues, setEqValues] = useState({
    low: -1.1,
    mid: 1.1,
    high1: 1.1,
    high2: 1.1
  });
  const [saturacion, setSaturacion] = useState(0);

  const handleGenerateMusic = () => {
    addProject({
      name: `Nueva Composición - ${new Date().toLocaleTimeString()}`,
      type: 'music',
      status: 'active',
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-lg">◯</span>
              </div>
              <span className="text-xl font-bold text-white">SON1KVERS3</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-white hover:text-cyan-400 transition-colors">Historia</a>
              <a href="#" className="text-white hover:text-cyan-400 transition-colors">Ghost Studio</a>
              <a href="#" className="text-white hover:text-cyan-400 transition-colors">Generación</a>
              <a href="#" className="text-white hover:text-cyan-400 transition-colors">Archivo</a>
              <a href="#" className="text-white hover:text-cyan-400 transition-colors">Santuario</a>
              <a href="#" className="text-white hover:text-cyan-400 transition-colors">Planes</a>
            </nav>

            {/* Status y Botón */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Backend Offline</span>
              </div>
              <Button variant="nexus" size="md">
                Entrar al Estudio
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Sección Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Columna Izquierda - Mensaje Principal */}
          <div className="space-y-8">
            {/* Guiño Sutil */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-400 font-mono"
            >
              LA RESISTENCIA
            </motion.div>

            {/* Título Principal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-bold leading-tight"
            >
              <span className="text-white">Lo </span>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                imperfecto
              </span>
              <span className="text-white"> también es </span>
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                sagrado
              </span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300"
            >
              Componer con alma en un mundo de máquinas.
            </motion.p>

            {/* Botones de Acción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex space-x-4"
            >
              <Button
                onClick={handleGenerateMusic}
                variant="nexus"
                size="lg"
                className="px-8 py-4"
              >
                Entrar al Estudio
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="px-8 py-4"
              >
                Conocer el Universo
              </Button>
            </motion.div>

            {/* Texto Inferior */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm leading-relaxed"
            >
              En un futuro cercano, XentriX Corp domestica la creatividad. 
              Pero la Resistencia Sonora se niega al silencio. 
              Cada nota imperfecta es un acto de rebelión.
            </motion.p>
          </div>

          {/* Columna Derecha - Panel de Control */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="glass" className="p-8">
              {/* Controles de Dial */}
              <div className="flex justify-center space-x-8 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center">
                      <div className="w-1 h-8 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full"></div>
                  </div>
                ))}
              </div>

              {/* Slider de Expresividad */}
              <div className="mb-8">
                <label className="block text-sm text-gray-300 mb-2">Expresividad</label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={expresividad}
                    onChange={(e) => setExpresividad(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div
                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg"
                    style={{ width: `${expresividad}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-400 mt-1">{expresividad}%</div>
              </div>

              {/* Botones de Acción */}
              <div className="flex space-x-4">
                <Button variant="secondary" size="md" className="flex-1">
                  Test Rápido
                </Button>
                <Button variant="secondary" size="md" className="flex-1">
                  Generar Preview
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sección de Lore - Cards Clasificadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8">El Universo Son1kVers3</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card NOVA-IX */}
            <Card variant="elevated" className="p-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">NOVA-IX</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                El androide con alma, condenado a vibrar entre dos mundos, 
                no es plenamente humano ni completamente máquina.
              </p>
            </Card>

            {/* Card XentriX Corp */}
            <Card variant="elevated" className="p-6">
              <h3 className="text-lg font-bold text-red-400 mb-3">XentriX Corp</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Imperio corporativo que diseña androides puente y controla 
                el arte algorítmicamente perfecto.
              </p>
            </Card>

            {/* Card Divina Liga */}
            <Card variant="elevated" className="p-6">
              <h3 className="text-lg font-bold text-purple-400 mb-3">Divina Liga</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Colectivo de compositores que creyó que lo imperfecto 
                también es sagrado.
              </p>
            </Card>

            {/* Card La Terminal */}
            <Card variant="elevated" className="p-6">
              <h3 className="text-lg font-bold text-green-400 mb-3">La Terminal</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Punto de encuentro. Donde la Resistencia suena su primer vez.
              </p>
            </Card>
          </div>
        </motion.div>

        {/* Sección Ghost Studio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ghost Studio</h2>
          <p className="text-gray-300 mb-8">
            Sube tu demo o escribe un prompt. El Estudio Fantasma devuelve una maqueta con melodía y carácter.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda - Prompt */}
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Prompt de Generación Musical</h3>
              
              <textarea
                className="w-full h-32 bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none resize-none"
                placeholder="Ej: Una balada emotiva con piano y cuerdas, estilo neo-soul, tempo 70 BPM, voz masculina expresiva."
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Mood</label>
                  <select className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none">
                    <option>Profesional</option>
                    <option>Experimental</option>
                    <option>Emocional</option>
                    <option>Underground</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Duración</label>
                  <select className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none">
                    <option>Mi canción</option>
                    <option>30 segundos</option>
                    <option>1 minuto</option>
                    <option>Loop</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-300 mb-2">Keywords</label>
                <input
                  type="text"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none"
                  placeholder="pop, ballad, emotional, piano"
                />
              </div>

              <div className="flex space-x-4 mt-6">
                <Button
                  onClick={handleGenerateMusic}
                  variant="nexus"
                  size="md"
                  className="flex-1"
                >
                  Generar Música
                </Button>
                <Button variant="secondary" size="md" className="flex-1">
                  Verificar APIs
                </Button>
              </div>
            </Card>

            {/* Columna Derecha - Controles de Audio */}
            <Card variant="glass" className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">Controles de Audio</h3>
              
              {/* Afinación */}
              <div className="mb-6">
                <label className="block text-sm text-gray-300 mb-2">Afinación</label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={afinacion}
                    onChange={(e) => setAfinacion(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div
                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg"
                    style={{ width: `${afinacion}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-400 mt-1">{afinacion}%</div>
              </div>

              {/* EQ */}
              <div className="mb-6">
                <label className="block text-sm text-gray-300 mb-4">EQ (dB)</label>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(eqValues).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-gray-400 mb-2">
                        {key === 'low' ? 'Low' : key === 'mid' ? 'Mid' : 'High'}
                      </div>
                      <div className="h-24 bg-gray-800 rounded-lg flex flex-col justify-between p-2">
                        <button className="text-gray-400 hover:text-white">↑</button>
                        <div className="text-sm text-white">{value}</div>
                        <button className="text-gray-400 hover:text-white">↓</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saturación */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Saturación <span className="text-purple-400">(Super-style)</span>
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={saturacion}
                    onChange={(e) => setSaturacion(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div
                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg"
                    style={{ width: `${saturacion}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-400 mt-1">{saturacion}%</div>
              </div>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};