// apps/the-generator/src/components/UserInstanceInfo.tsx
import { useState, useEffect } from 'react';
import { userInstanceManager, UserInstance } from '../services/userInstance';

export function UserInstanceInfo() {
  const [instance, setInstance] = useState<UserInstance | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const userInstance = userInstanceManager.getInstance();
    const userStats = userInstanceManager.getStats();
    
    setInstance(userInstance);
    setStats(userStats);
  }, []);

  const handleAddToken = () => {
    const newToken = prompt('Ingresa un nuevo token:');
    if (newToken && newToken.trim()) {
      userInstanceManager.addToken(newToken.trim());
      // Recargar datos
      const updatedInstance = userInstanceManager.getInstance();
      const updatedStats = userInstanceManager.getStats();
      setInstance(updatedInstance);
      setStats(updatedStats);
    }
  };

  const handleResetInstance = () => {
    if (confirm('¿Estás seguro de que quieres resetear tu instancia? Esto eliminará todos los datos.')) {
      userInstanceManager.resetInstance();
      const newInstance = userInstanceManager.getInstance();
      const newStats = userInstanceManager.getStats();
      setInstance(newInstance);
      setStats(newStats);
    }
  };

  if (!instance || !stats) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-white/10 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-cyan text-lg">👤</div>
          <div>
            <h3 className="text-white font-semibold text-sm">Instancia de Usuario</h3>
            <p className="text-white/60 text-xs">ID: {instance.installationId.substring(0, 12)}...</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-white/60 hover:text-white text-xs"
        >
          {showDetails ? '👁️ Ocultar' : '👁️ Ver'}
        </button>
      </div>

      {/* Estadísticas básicas */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-cyan text-xs font-medium">Generaciones</div>
          <div className="text-white text-sm font-bold">{stats.totalGenerations}</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-green-400 text-xs font-medium">Éxito</div>
          <div className="text-white text-sm font-bold">{stats.successRate}%</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-magenta text-xs font-medium">Tokens</div>
          <div className="text-white text-sm font-bold">{stats.tokensAvailable}</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-yellow-400 text-xs font-medium">Días</div>
          <div className="text-white text-sm font-bold">{stats.daysSinceInstallation}</div>
        </div>
      </div>

      {/* Detalles expandidos */}
      {showDetails && (
        <div className="space-y-3 border-t border-white/10 pt-3">
          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm">Información de Instalación</h4>
            <div className="text-white/70 text-xs space-y-1">
              <p><strong>Usuario ID:</strong> {instance.userId}</p>
              <p><strong>Instalación ID:</strong> {instance.installationId}</p>
              <p><strong>Creado:</strong> {new Date(instance.createdAt).toLocaleDateString()}</p>
              <p><strong>Último uso:</strong> {new Date(instance.stats.lastUsed).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm">Preferencias</h4>
            <div className="text-white/70 text-xs space-y-1">
              <p><strong>Estilo por defecto:</strong> {instance.preferences.defaultStyle}</p>
              <p><strong>Duración máxima:</strong> {instance.preferences.maxDuration}s</p>
              <p><strong>Auto-guardado:</strong> {instance.preferences.autoSave ? 'Sí' : 'No'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm">Estadísticas Detalladas</h4>
            <div className="text-white/70 text-xs space-y-1">
              <p><strong>Total generaciones:</strong> {stats.totalGenerations}</p>
              <p><strong>Exitosas:</strong> {stats.successfulGenerations}</p>
              <p><strong>Fallidas:</strong> {stats.failedGenerations}</p>
              <p><strong>Tasa de éxito:</strong> {stats.successRate}%</p>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleAddToken}
              className="px-3 py-1 bg-cyan text-black rounded text-xs hover:bg-cyan/80 transition-colors"
            >
              ➕ Agregar Token
            </button>
            
            <button
              onClick={handleResetInstance}
              className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
            >
              🔄 Resetear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
