import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getModuleLore, getFactionInfo, getConnectedModules } from '../lib/lore';

export const Projects: React.FC = () => {
  const { projects, addProject, updateProject } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'music' | 'voice' | 'social' | 'collaboration'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    type: 'music' as const,
    description: '',
    faction: 'Neutral' as const
  });

  const handleCreateProject = () => {
    if (newProject.name.trim()) {
      addProject({
        name: newProject.name,
        type: newProject.type,
        status: 'active'
      });
      setNewProject({ name: '', type: 'music', description: '', faction: 'Neutral' });
      setShowCreateForm(false);
    }
  };

  const filteredProjects = projects.filter(project => 
    activeFilter === 'all' || project.type === activeFilter
  );

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'music': return '🎵';
      case 'voice': return '🎭';
      case 'social': return '🚀';
      case 'collaboration': return '🏛️';
      default: return '📁';
    }
  };

  const getProjectFaction = (type: string) => {
    switch (type) {
      case 'music': return 'ALVAE';
      case 'voice': return 'Resistencia';
      case 'social': return 'ALVAE';
      case 'collaboration': return 'Neutral';
      default: return 'Neutral';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'archived': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="projects-container">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="projects-header">
            <div>
              <h1 className="text-4xl font-bold text-cyan mb-2">
                📁 Mis Proyectos
              </h1>
              <p className="text-accent text-lg">
                Gestiona tus creaciones en el Son1kVerse
              </p>
            </div>
            <button
              className="create-project-btn"
              onClick={() => setShowCreateForm(true)}
            >
              ➕ Nuevo Proyecto
            </button>
          </div>
        </motion.div>

        {/* Project Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="project-stats-grid">
            <div className="stat-card">
              <h3 className="stat-title">Proyectos Activos</h3>
              <div className="stat-value">{projects.filter(p => p.status === 'active').length}</div>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Completados</h3>
              <div className="stat-value">{projects.filter(p => p.status === 'completed').length}</div>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Colaboraciones</h3>
              <div className="stat-value">{projects.filter(p => p.type === 'collaboration').length}</div>
            </div>
            <div className="stat-card">
              <h3 className="stat-title">Total</h3>
              <div className="stat-value">{projects.length}</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="project-filters">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Todos
            </button>
            <button
              className={`filter-btn ${activeFilter === 'music' ? 'active' : ''}`}
              onClick={() => setActiveFilter('music')}
            >
              🎵 Música
            </button>
            <button
              className={`filter-btn ${activeFilter === 'voice' ? 'active' : ''}`}
              onClick={() => setActiveFilter('voice')}
            >
              🎭 Voz
            </button>
            <button
              className={`filter-btn ${activeFilter === 'social' ? 'active' : ''}`}
              onClick={() => setActiveFilter('social')}
            >
              🚀 Social
            </button>
            <button
              className={`filter-btn ${activeFilter === 'collaboration' ? 'active' : ''}`}
              onClick={() => setActiveFilter('collaboration')}
            >
              🏛️ Colaboración
            </button>
          </div>
        </motion.div>

        {/* Create Project Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="create-project-form"
          >
            <h2 className="text-2xl font-bold text-cyan mb-4">
              Crear Nuevo Proyecto
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre del Proyecto</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Ej: Mi Álbum Cyberpunk"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de Proyecto</label>
                <select
                  value={newProject.type}
                  onChange={(e) => setNewProject({ ...newProject, type: e.target.value as any })}
                  className="form-select"
                >
                  <option value="music">🎵 Música</option>
                  <option value="voice">🎭 Voz</option>
                  <option value="social">🚀 Social</option>
                  <option value="collaboration">🏛️ Colaboración</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe tu proyecto..."
                  className="form-textarea"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Alineación de Facción</label>
                <select
                  value={newProject.faction}
                  onChange={(e) => setNewProject({ ...newProject, faction: e.target.value as any })}
                  className="form-select"
                >
                  <option value="Neutral">⚖️ Neutral</option>
                  <option value="ALVAE">🤖 ALVAE</option>
                  <option value="Resistencia">👥 Resistencia</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button
                className="form-btn primary"
                onClick={handleCreateProject}
              >
                Crear Proyecto
              </button>
              <button
                className="form-btn secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="projects-grid">
            {filteredProjects.map((project, index) => {
              const moduleLore = getModuleLore(project.type === 'music' ? 'ghost-studio' : 
                                             project.type === 'voice' ? 'clone-station' :
                                             project.type === 'social' ? 'nova-post-pilot' : 'sanctuary-social');
              const factionInfo = getFactionInfo(getProjectFaction(project.type));
              
              return (
                <motion.div
                  key={project.id}
                  className="project-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="project-header">
                    <div className="project-icon">{getProjectIcon(project.type)}</div>
                    <div className="project-status">
                      <span className={`status-text ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="project-content">
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-type">{project.type}</p>
                    
                    {moduleLore && (
                      <div className="project-lore">
                        <div className="lore-faction">
                          <span className={`faction-badge ${factionInfo?.color}`}>
                            {factionInfo?.name}
                          </span>
                        </div>
                        <p className="lore-description">
                          {moduleLore.purpose}
                        </p>
                      </div>
                    )}
                    
                    <div className="project-meta">
                      <span className="project-date">
                        Creado: {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <span className="project-updated">
                        Actualizado: {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="project-actions">
                    <button className="action-btn primary">✏️ Editar</button>
                    <button className="action-btn secondary">👁️ Ver</button>
                    <button className="action-btn secondary">🗑️ Eliminar</button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="empty-projects">
              <div className="empty-icon">📁</div>
              <h3 className="empty-title">No hay proyectos</h3>
              <p className="empty-description">
                {activeFilter === 'all' 
                  ? 'Crea tu primer proyecto para comenzar tu viaje creativo en el Son1kVerse'
                  : `No tienes proyectos de tipo ${activeFilter}`
                }
              </p>
              <button
                className="empty-action-btn"
                onClick={() => setShowCreateForm(true)}
              >
                Crear Proyecto
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
