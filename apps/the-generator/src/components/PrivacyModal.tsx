import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export function PrivacyModal({ isOpen, onAccept, onReject }: PrivacyModalProps) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Verificar si ya fue aceptado previamente
    const accepted = localStorage.getItem('son1kverse_privacy_accepted');
    if (accepted === 'true') {
      setIsAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('son1kverse_privacy_accepted', 'true');
    localStorage.setItem('son1kverse_privacy_date', new Date().toISOString());
    localStorage.setItem('son1kverse_browser_client', generateBrowserClient());
    onAccept();
  };

  const generateBrowserClient = () => {
    const userAgent = navigator.userAgent;
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    
    // Detectar navegador
    let browser = 'unknown';
    if (userAgent.includes('Chrome')) browser = 'chrome';
    else if (userAgent.includes('Firefox')) browser = 'firefox';
    else if (userAgent.includes('Safari')) browser = 'safari';
    else if (userAgent.includes('Edge')) browser = 'edge';
    
    const clientId = `${browser}_${timestamp}_${randomId}`;
    return clientId;
  };

  if (!isOpen && isAccepted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan/20"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-cyan text-4xl mb-3">⚖️</div>
              <h2 className="text-white text-2xl font-bold mb-2">
                Términos de Uso
              </h2>
              <p className="text-white/70 text-sm">
                Son1kVerse AI Music Engine
              </p>
            </div>

            {/* Contenido principal */}
            <div className="space-y-6 text-white/80 text-sm leading-relaxed">
              <div>
                <h3 className="text-cyan font-semibold mb-2">🎵 Servicio de Generación Musical</h3>
                <p>
                  Al utilizar Son1kVerse AI Music Engine, aceptas que generamos contenido musical 
                  utilizando inteligencia artificial avanzada. El usuario es completamente responsable 
                  del uso legal de las pistas generadas.
                </p>
              </div>

              <div>
                <h3 className="text-cyan font-semibold mb-2">📋 Términos de Uso</h3>
                <p className="mb-2">
                  Al aceptar estos términos, el usuario acepta el uso de Son1kVerse AI Music Engine 
                  y se compromete a utilizarlo de manera responsable y legal.
                </p>
                <p>
                  El usuario es el único responsable del contenido generado y su uso posterior.
                </p>
              </div>

              <div>
                <h3 className="text-cyan font-semibold mb-2">🌐 Cliente por Navegador</h3>
                <p>
                  Cada navegador genera un cliente único para garantizar el mejor rendimiento y 
                  aislamiento de datos. Esto permite escalabilidad y funcionamiento óptimo.
                </p>
              </div>

              <div>
                <h3 className="text-cyan font-semibold mb-2">📊 Recopilación de Datos</h3>
                <p>
                  Recopilamos datos mínimos necesarios para el funcionamiento del servicio, 
                  incluyendo preferencias de usuario, configuración del navegador y métricas de uso.
                </p>
              </div>

              <div>
                <h3 className="text-cyan font-semibold mb-2">🛡️ Seguridad</h3>
                <p>
                  Implementamos medidas de seguridad avanzadas para proteger tu información 
                  y garantizar el funcionamiento seguro de la plataforma.
                </p>
              </div>

              {/* Detalles expandibles */}
              <div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-cyan hover:text-cyan/80 transition-colors font-semibold flex items-center space-x-2"
                >
                  <span>{showDetails ? '📖' : '📋'}</span>
                  <span>{showDetails ? 'Ocultar detalles técnicos' : 'Ver detalles técnicos'}</span>
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 p-4 bg-black/20 rounded-lg border border-white/10"
                    >
                      <h4 className="text-cyan font-semibold mb-3">Detalles Técnicos:</h4>
                      <ul className="space-y-2 text-xs">
                        <li>• Instalación automática de extensiones optimizadas</li>
                        <li>• Generación de ID único por navegador</li>
                        <li>• Monitoreo de rendimiento en tiempo real</li>
                        <li>• Cache local para optimización</li>
                        <li>• Herramientas de debugging y análisis</li>
                        <li>• Sistema de tokens para autenticación</li>
                        <li>• Polling automático para resultados</li>
                        <li>• Gestión de errores y recuperación</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Disclaimer importante */}
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <h4 className="text-red-400 font-semibold mb-2">⚠️ Disclaimer Importante</h4>
              <p className="text-red-300 text-sm">
                Son1kVerse no se hace responsable del uso indebido de las pistas generadas por el sistema. 
                El usuario acepta estos términos al continuar con el uso de la plataforma.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={onReject}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                ❌ Rechazar
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan to-magenta text-black rounded-lg hover:from-cyan/80 hover:to-magenta/80 transition-all font-semibold shadow-lg shadow-cyan/20"
              >
                ✅ Aceptar Términos
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-white/50 text-xs">
              <p>Última actualización: {new Date().toLocaleDateString()}</p>
              <p>Son1kVerse AI Music Engine v1.0.0</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
