import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const StatusWidget: React.FC = () => {
  const { projects, modules } = useAppStore();

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const onlineModules = modules.filter(m => m.status === 'online').length;

  return (
    <div className="widget-section">
      <h3 className="widget-title">Estado del Sistema</h3>
      <div className="widget-content space-y-3">
        <div className="flex justify-between">
          <span>Módulos Online:</span>
          <span className="text-success">{onlineModules}/{modules.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Proyectos Activos:</span>
          <span className="text-warning">{activeProjects}</span>
        </div>
        <div className="flex justify-between">
          <span>Última Actividad:</span>
          <span className="text-info">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};