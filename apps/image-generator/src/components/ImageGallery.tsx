import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageStore } from '../store/useImageStore';
import { GeneratedImage, ImageGallery } from '../types/imageGenerator';

export const ImageGallery: React.FC = () => {
  const {
    generatedImages,
    galleries,
    selectedImageId,
    selectedGalleryId,
    setSelectedImage,
    deleteImage,
    downloadImage,
    createGallery,
    addImageToGallery,
    removeImageFromGallery,
    deleteGallery,
    getGalleryById
  } = useImageStore();

  const [showCreateGallery, setShowCreateGallery] = useState(false);
  const [newGalleryName, setNewGalleryName] = useState('');
  const [newGalleryDescription, setNewGalleryDescription] = useState('');

  const selectedImage = generatedImages.find(img => img.id === selectedImageId);
  const selectedGallery = getGalleryById(selectedGalleryId || '');

  const handleCreateGallery = () => {
    if (newGalleryName.trim()) {
      createGallery(newGalleryName, newGalleryDescription);
      setNewGalleryName('');
      setNewGalleryDescription('');
      setShowCreateGallery(false);
    }
  };

  const handleAddToGallery = (imageId: string) => {
    if (selectedGalleryId) {
      addImageToGallery(selectedGalleryId, imageId);
    }
  };

  const handleRemoveFromGallery = (imageId: string) => {
    if (selectedGalleryId) {
      removeImageFromGallery(selectedGalleryId, imageId);
    }
  };

  const imagesToShow = selectedGallery ? selectedGallery.images : generatedImages;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="image-gallery"
    >
      {/* Gallery Header */}
      <div className="gallery-header">
        <h3 className="gallery-title">🖼️ Image Gallery</h3>
        <div className="gallery-actions">
          <button
            className="action-btn"
            onClick={() => setShowCreateGallery(true)}
            title="Create Gallery"
          >
            ➕ New Gallery
          </button>
        </div>
      </div>

      {/* Gallery Selection */}
      <div className="gallery-selection">
        <div className="gallery-list">
          <button
            className={`gallery-item ${!selectedGalleryId ? 'active' : ''}`}
            onClick={() => setSelectedGalleryId(null)}
          >
            <div className="gallery-icon">📸</div>
            <div className="gallery-info">
              <div className="gallery-name">All Images</div>
              <div className="gallery-count">{generatedImages.length} images</div>
            </div>
          </button>
          
          {galleries.map(gallery => (
            <button
              key={gallery.id}
              className={`gallery-item ${selectedGalleryId === gallery.id ? 'active' : ''}`}
              onClick={() => setSelectedGalleryId(gallery.id)}
            >
              <div className="gallery-icon">🖼️</div>
              <div className="gallery-info">
                <div className="gallery-name">{gallery.name}</div>
                <div className="gallery-count">{gallery.images.length} images</div>
              </div>
              <button
                className="gallery-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteGallery(gallery.id);
                }}
                title="Delete Gallery"
              >
                🗑️
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Create Gallery Modal */}
      <AnimatePresence>
        {showCreateGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowCreateGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="modal-title">Create New Gallery</h4>
              
              <div className="modal-form">
                <div className="form-group">
                  <label className="form-label">Gallery Name</label>
                  <input
                    type="text"
                    value={newGalleryName}
                    onChange={(e) => setNewGalleryName(e.target.value)}
                    placeholder="Enter gallery name"
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={newGalleryDescription}
                    onChange={(e) => setNewGalleryDescription(e.target.value)}
                    placeholder="Enter gallery description"
                    className="form-textarea"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button
                  className="modal-btn cancel"
                  onClick={() => setShowCreateGallery(false)}
                >
                  Cancel
                </button>
                <button
                  className="modal-btn create"
                  onClick={handleCreateGallery}
                  disabled={!newGalleryName.trim()}
                >
                  Create Gallery
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Images Grid */}
      <div className="images-grid">
        {imagesToShow.length === 0 ? (
          <div className="empty-gallery">
            <div className="empty-icon">🖼️</div>
            <h3>No images yet</h3>
            <p>Generate some images to see them here</p>
          </div>
        ) : (
          imagesToShow.map((image, index) => (
            <motion.div
              key={image.id}
              className={`image-card ${selectedImageId === image.id ? 'selected' : ''}`}
              onClick={() => setSelectedImage(image.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="image-container">
                <img
                  src={image.thumbnailUrl}
                  alt={image.prompt}
                  className="image-thumbnail"
                />
                <div className="image-overlay">
                  <div className="image-actions">
                    <button
                      className="image-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image.id);
                      }}
                      title="Download"
                    >
                      📥
                    </button>
                    <button
                      className="image-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(image.id);
                      }}
                      title="Delete"
                    >
                      🗑️
                    </button>
                    {selectedGallery && (
                      <button
                        className="image-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromGallery(image.id);
                        }}
                        title="Remove from Gallery"
                      >
                        ➖
                      </button>
                    )}
                    {!selectedGallery && (
                      <button
                        className="image-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedGalleryId) {
                            handleAddToGallery(image.id);
                          }
                        }}
                        title="Add to Gallery"
                      >
                        ➕
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="image-info">
                <div className="image-prompt">{image.prompt}</div>
                <div className="image-meta">
                  <span className="image-style">{image.style.name}</span>
                  <span className="image-quality">{image.quality}</span>
                  <span className="image-date">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Selected Image Details */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="image-details"
        >
          <h4 className="details-title">Image Details</h4>
          
          <div className="details-content">
            <div className="detail-group">
              <label className="detail-label">Prompt</label>
              <div className="detail-value">{selectedImage.prompt}</div>
            </div>
            
            <div className="detail-group">
              <label className="detail-label">Style</label>
              <div className="detail-value">{selectedImage.style.name}</div>
            </div>
            
            <div className="detail-group">
              <label className="detail-label">Quality</label>
              <div className="detail-value">{selectedImage.quality}</div>
            </div>
            
            <div className="detail-group">
              <label className="detail-label">Aspect Ratio</label>
              <div className="detail-value">{selectedImage.aspectRatio}</div>
            </div>
            
            <div className="detail-group">
              <label className="detail-label">Seed</label>
              <div className="detail-value">{selectedImage.seed}</div>
            </div>
            
            <div className="detail-group">
              <label className="detail-label">Generated</label>
              <div className="detail-value">
                {new Date(selectedImage.createdAt).toLocaleString()}
              </div>
            </div>
            
            <div className="detail-group">
              <label className="detail-label">File Size</label>
              <div className="detail-value">
                {(selectedImage.metadata.fileSize / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
          
          <div className="details-actions">
            <button
              className="details-btn primary"
              onClick={() => downloadImage(selectedImage.id)}
            >
              📥 Download Full Size
            </button>
            <button
              className="details-btn secondary"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};