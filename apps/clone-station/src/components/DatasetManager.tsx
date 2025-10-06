// Dataset Manager - Gestor de datasets de Clone Station del universo Son1kVerse

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useCloneStore } from '../store/useCloneStore';
import { Dataset, DatasetMetadata } from '../types/cloneStation';

export function DatasetManager() {
  const {
    datasets,
    selectedDataset,
    selectDataset,
    addDataset,
    updateDataset,
    deleteDataset,
    uploadDataset,
    validateDataset,
  } = useCloneStore();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterType, setFilterType] = useState<Dataset['type'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'duration' | 'uploadDate'>('uploadDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort datasets
  const filteredDatasets = datasets
    .filter(dataset => {
      const matchesType = filterType === 'all' || dataset.type === filterType;
      const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Handle file drop
  const onDrop = async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (const file of acceptedFiles) {
        const metadata: Partial<DatasetMetadata> = {
          sampleRate: 44100,
          bitDepth: 24,
          channels: 2,
          format: file.name.split('.').pop() || 'wav',
        };

        await uploadDataset(file, metadata);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setShowUploadModal(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.flac', '.ogg', '.m4a'],
    },
    multiple: true,
  });

  const handleDatasetClick = (dataset: Dataset) => {
    selectDataset(dataset.id);
    setShowDetailsModal(true);
  };

  const handleDeleteDataset = (dataset: Dataset) => {
    if (confirm(`Are you sure you want to delete "${dataset.name}"?`)) {
      deleteDataset(dataset.id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityColor = (quality: Dataset['quality']) => {
    switch (quality) {
      case 'ultra': return '#00ff00';
      case 'high': return '#00d4ff';
      case 'medium': return '#ffaa00';
      case 'low': return '#ff6b6b';
      default: return '#a0a0a0';
    }
  };

  const getTypeIcon = (type: Dataset['type']) => {
    switch (type) {
      case 'voice': return '🎤';
      case 'music': return '🎵';
      case 'speech': return '🗣️';
      case 'instrument': return '🎹';
      default: return '📁';
    }
  };

  return (
    <div className="dataset-manager">
      {/* Header */}
      <div className="dataset-manager__header">
        <h2 className="dataset-manager__title">
          <span className="title__icon">📊</span>
          Dataset Manager
        </h2>
        
        <div className="dataset-manager__actions">
          <button
            className="action__button action__button--primary"
            onClick={() => setShowUploadModal(true)}
          >
            <span className="button__icon">📤</span>
            Upload Dataset
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="dataset-manager__filters">
        <div className="filters__search">
          <input
            type="text"
            placeholder="Search datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search__input"
          />
        </div>
        
        <div className="filters__controls">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="filter__select"
          >
            <option value="all">All Types</option>
            <option value="voice">Voice</option>
            <option value="music">Music</option>
            <option value="speech">Speech</option>
            <option value="instrument">Instrument</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="filter__select"
          >
            <option value="uploadDate">Upload Date</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="duration">Duration</option>
          </select>
          
          <button
            className="sort__button"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="dataset-manager__grid">
        <AnimatePresence>
          {filteredDatasets.map((dataset) => (
            <motion.div
              key={dataset.id}
              className={`dataset-card ${selectedDataset?.id === dataset.id ? 'selected' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleDatasetClick(dataset)}
            >
              <div className="dataset-card__header">
                <div className="dataset-card__type">
                  <span className="type__icon">{getTypeIcon(dataset.type)}</span>
                  <span className="type__label">{dataset.type}</span>
                </div>
                
                <div className="dataset-card__quality">
                  <span 
                    className="quality__indicator"
                    style={{ backgroundColor: getQualityColor(dataset.quality) }}
                  />
                  <span className="quality__label">{dataset.quality}</span>
                </div>
              </div>
              
              <div className="dataset-card__content">
                <h3 className="dataset-card__name">{dataset.name}</h3>
                <p className="dataset-card__description">{dataset.description}</p>
                
                <div className="dataset-card__stats">
                  <div className="stat">
                    <span className="stat__icon">📏</span>
                    <span className="stat__value">{formatFileSize(dataset.size * 1024 * 1024)}</span>
                  </div>
                  
                  <div className="stat">
                    <span className="stat__icon">⏱️</span>
                    <span className="stat__value">{formatDuration(dataset.duration)}</span>
                  </div>
                  
                  <div className="stat">
                    <span className="stat__icon">🎵</span>
                    <span className="stat__value">{dataset.format.toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="dataset-card__tags">
                  {dataset.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                  {dataset.tags.length > 3 && (
                    <span className="tag tag--more">
                      +{dataset.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="dataset-card__footer">
                <div className="dataset-card__status">
                  <span className={`status__indicator status__indicator--${dataset.status}`} />
                  <span className="status__label">{dataset.status}</span>
                </div>
                
                <div className="dataset-card__actions">
                  <button
                    className="action__button action__button--small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDataset(dataset);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              className="upload-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="upload-modal__header">
                <h3>Upload Dataset</h3>
                <button
                  className="modal__close"
                  onClick={() => setShowUploadModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="upload-modal__content">
                <div
                  {...getRootProps()}
                  className={`upload-dropzone ${isDragActive ? 'active' : ''}`}
                >
                  <input {...getInputProps()} />
                  
                  {isUploading ? (
                    <div className="upload-progress">
                      <div className="progress__bar">
                        <div 
                          className="progress__fill"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="progress__text">Uploading... {uploadProgress}%</span>
                    </div>
                  ) : (
                    <div className="upload-content">
                      <div className="upload-icon">📤</div>
                      <p className="upload-text">
                        {isDragActive
                          ? 'Drop the files here...'
                          : 'Drag & drop audio files here, or click to select files'
                        }
                      </p>
                      <p className="upload-hint">
                        Supports WAV, MP3, FLAC, OGG, M4A
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dataset Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedDataset && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              className="details-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="details-modal__header">
                <h3>{selectedDataset.name}</h3>
                <button
                  className="modal__close"
                  onClick={() => setShowDetailsModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="details-modal__content">
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Type</label>
                    <span>{selectedDataset.type}</span>
                  </div>
                  
                  <div className="detail-item">
                    <label>Size</label>
                    <span>{formatFileSize(selectedDataset.size * 1024 * 1024)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <label>Duration</label>
                    <span>{formatDuration(selectedDataset.duration)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <label>Quality</label>
                    <span>{selectedDataset.quality}</span>
                  </div>
                  
                  <div className="detail-item">
                    <label>Format</label>
                    <span>{selectedDataset.format.toUpperCase()}</span>
                  </div>
                  
                  <div className="detail-item">
                    <label>Language</label>
                    <span>{selectedDataset.language || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <label>Gender</label>
                    <span>{selectedDataset.gender || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <label>Emotion</label>
                    <span>{selectedDataset.emotion || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="details-tags">
                  <label>Tags</label>
                  <div className="tags-list">
                    {selectedDataset.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="details-description">
                  <label>Description</label>
                  <p>{selectedDataset.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles */}
      <style jsx>{`
        .dataset-manager {
          padding: var(--spacing-lg);
          height: 100%;
          overflow-y: auto;
        }

        .dataset-manager__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .dataset-manager__title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: 24px;
          font-weight: 700;
          color: var(--accent-primary);
          margin: 0;
        }

        .title__icon {
          font-size: 28px;
        }

        .dataset-manager__actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .action__button {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%);
          border: none;
          border-radius: var(--border-radius-md);
          color: var(--bg-primary);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .action__button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 255, 231, 0.4);
        }

        .action__button--primary {
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%);
        }

        .action__button--small {
          padding: var(--spacing-xs);
          background: rgba(255, 107, 107, 0.2);
          color: var(--text-primary);
        }

        .action__button--small:hover {
          background: rgba(255, 107, 107, 0.3);
        }

        .button__icon {
          font-size: 16px;
        }

        .dataset-manager__filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
          gap: var(--spacing-md);
        }

        .filters__search {
          flex: 1;
          max-width: 400px;
        }

        .search__input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          font-family: var(--font-primary);
        }

        .search__input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 10px rgba(0, 255, 231, 0.3);
        }

        .filters__controls {
          display: flex;
          gap: var(--spacing-sm);
        }

        .filter__select {
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          font-family: var(--font-primary);
        }

        .sort__button {
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .sort__button:hover {
          background: rgba(0, 255, 231, 0.1);
        }

        .dataset-manager__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .dataset-card {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
          backdrop-filter: blur(10px);
        }

        .dataset-card:hover {
          border-color: var(--accent-primary);
          box-shadow: 0 8px 25px rgba(0, 255, 231, 0.2);
          transform: translateY(-4px);
        }

        .dataset-card.selected {
          border-color: var(--accent-primary);
          box-shadow: 0 8px 25px rgba(0, 255, 231, 0.4);
        }

        .dataset-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .dataset-card__type {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .type__icon {
          font-size: 20px;
        }

        .type__label {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dataset-card__quality {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .quality__indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .quality__label {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dataset-card__content {
          margin-bottom: var(--spacing-md);
        }

        .dataset-card__name {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 var(--spacing-sm) 0;
        }

        .dataset-card__description {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0 0 var(--spacing-md) 0;
          line-height: 1.5;
        }

        .dataset-card__stats {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .stat {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .stat__icon {
          font-size: 14px;
        }

        .stat__value {
          font-size: 12px;
          color: var(--text-secondary);
          font-family: var(--font-mono);
        }

        .dataset-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
        }

        .tag {
          padding: 2px var(--spacing-sm);
          background: rgba(0, 255, 231, 0.2);
          border: 1px solid rgba(0, 255, 231, 0.4);
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          color: var(--accent-primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tag--more {
          background: rgba(184, 77, 255, 0.2);
          border-color: rgba(184, 77, 255, 0.4);
          color: var(--accent-secondary);
        }

        .dataset-card__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dataset-card__status {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .status__indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status__indicator--ready {
          background: #00ff00;
        }

        .status__indicator--processing {
          background: #ffaa00;
        }

        .status__indicator--error {
          background: #ff6b6b;
        }

        .status__label {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dataset-card__actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .upload-modal,
        .details-modal {
          background: rgba(26, 29, 38, 0.95);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          max-width: 500px;
          width: 90%;
          backdrop-filter: blur(10px);
        }

        .upload-modal__header,
        .details-modal__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .upload-modal__header h3,
        .details-modal__header h3 {
          margin: 0;
          color: var(--accent-primary);
        }

        .modal__close {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 20px;
          padding: var(--spacing-xs);
        }

        .modal__close:hover {
          color: var(--text-primary);
        }

        .upload-dropzone {
          border: 2px dashed rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-2xl);
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .upload-dropzone:hover,
        .upload-dropzone.active {
          border-color: var(--accent-primary);
          background: rgba(0, 255, 231, 0.05);
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-md);
        }

        .upload-icon {
          font-size: 48px;
        }

        .upload-text {
          font-size: 16px;
          color: var(--text-primary);
          margin: 0;
        }

        .upload-hint {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0;
        }

        .upload-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-md);
        }

        .progress__bar {
          width: 100%;
          height: 8px;
          background: rgba(0, 255, 231, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress__fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary));
          transition: width var(--transition-normal);
        }

        .progress__text {
          font-size: 14px;
          color: var(--text-primary);
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .detail-item label {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-item span {
          font-size: 14px;
          color: var(--text-primary);
          font-family: var(--font-mono);
        }

        .details-tags {
          margin-bottom: var(--spacing-lg);
        }

        .details-tags label {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: var(--spacing-sm);
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
        }

        .details-description label {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: var(--spacing-sm);
        }

        .details-description p {
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 768px) {
          .dataset-manager {
            padding: var(--spacing-md);
          }
          
          .dataset-manager__filters {
            flex-direction: column;
            gap: var(--spacing-md);
          }
          
          .filters__search {
            max-width: none;
          }
          
          .dataset-manager__grid {
            grid-template-columns: 1fr;
          }
          
          .upload-modal,
          .details-modal {
            width: 95%;
            padding: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
}