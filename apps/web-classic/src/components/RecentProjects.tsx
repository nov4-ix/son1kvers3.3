import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const RecentProjects: React.FC = () => {
  const { projects } = useAppStore();

  const recentProjects = projects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'music': return '🎵';
      case 'voice': return '🎭';
      case 'social': return '🚀';
      case 'collaboration': return '🏛️';
      default: return '📁';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'completed': return 'text-info';
      case 'archived': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="widget-section">
      <h3 className="widget-title">Proyectos Recientes</h3>
      <div className="widget-content">
        {recentProjects.length === 0 ? (
          <p className="text-gray-500">No hay proyectos recientes</p>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getProjectIcon(project.type)}</span>
                  <div>
                    <div className="font-medium text-sm">{project.name}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <span className={`text-xs ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};