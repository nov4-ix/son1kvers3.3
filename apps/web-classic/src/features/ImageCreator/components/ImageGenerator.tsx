import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useImageStore } from '../store/useImageStore';
import { ImageGenerationRequest, ImageStyle, ImageQuality, AspectRatio, IMAGE_STYLES, QUALITY_SETTINGS, ASPECT_RATIO_SETTINGS, PROJECT_PROMPTS } from '../types/imageGenerator';

export const ImageGenerator: React.FC = () => {
  const {
    generateImage,
    isGenerating,
    generationProgress,
    setActiveView
  } = useImageStore();

  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle>(IMAGE_STYLES[0]);
  const [selectedQuality, setSelectedQuality] = useState<ImageQuality>('standard');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('1:1');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [customSeed, setCustomSeed] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    const request: ImageGenerationRequest = {
      prompt: `${prompt}, ${selectedStyle.promptModifier}`,
      style: selectedStyle,
      quality: selectedQuality,
      aspectRatio: selectedAspectRatio,
      seed: customSeed || undefined,
      steps: QUALITY_SETTINGS[selectedQuality].steps,
      guidance: QUALITY_SETTINGS[selectedQuality].guidance
    };

    await generateImage(request);
  };

  const handleProjectPrompt = (projectKey: string) => {
    const prompts = PROJECT_PROMPTS[projectKey as keyof typeof PROJECT_PROMPTS];
    if (prompts && prompts.length > 0) {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setPrompt(randomPrompt);
      setSelectedProject(projectKey);
    }
  };

  const handleStyleSelect = (style: ImageStyle) => {
    setSelectedStyle(style);
  };

  const qualityOptions = Object.entries(QUALITY_SETTINGS).map(([key, value]) => ({
    key: key as ImageQuality,
    ...value
  }));

  const aspectRatioOptions = Object.entries(ASPECT_RATIO_SETTINGS).map(([key, value]) => ({
    key: key as AspectRatio,
    ...value
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="image-generator"
    >
      {/* Generator Header */}
      <div className="generator-header">
        <h3 className="generator-title">🎨 Image Generator</h3>
        <div className="generator-actions">
          <button
            className="action-btn"
            onClick={() => setActiveView('gallery')}
            title="View Gallery"
          >
            🖼️ Gallery
          </button>
          <button
            className="action-btn"
            onClick={() => setActiveView('history')}
            title="View History"
          >
            📜 History
          </button>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="prompt-section">
        <label className="section-label">Prompt</label>
        <div className="prompt-input-container">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="prompt-input"
            rows={3}
          />
          <div className="prompt-actions">
            <button
              className="prompt-btn"
              onClick={() => setPrompt('')}
              title="Clear Prompt"
            >
              🗑️
            </button>
            <button
              className="prompt-btn"
              onClick={() => setPrompt(prompt + ', high quality, detailed, professional')}
              title="Enhance Prompt"
            >
              ✨
            </button>
          </div>
        </div>
      </div>

      {/* Project Prompts */}
      <div className="project-prompts">
        <label className="section-label">Quick Prompts</label>
        <div className="project-buttons">
          {Object.keys(PROJECT_PROMPTS).map(projectKey => (
            <button
              key={projectKey}
              className={`project-btn ${selectedProject === projectKey ? 'active' : ''}`}
              onClick={() => handleProjectPrompt(projectKey)}
              title={`Generate ${projectKey} image`}
            >
              {projectKey.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div className="style-section">
        <label className="section-label">Style</label>
        <div className="style-grid">
          {IMAGE_STYLES.map(style => (
            <motion.button
              key={style.id}
              className={`style-btn ${selectedStyle.id === style.id ? 'active' : ''}`}
              onClick={() => handleStyleSelect(style)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ borderColor: selectedStyle.id === style.id ? style.color : 'transparent' }}
            >
              <div className="style-icon" style={{ color: style.color }}>
                {style.icon}
              </div>
              <div className="style-info">
                <div className="style-name">{style.name}</div>
                <div className="style-description">{style.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quality and Aspect Ratio */}
      <div className="settings-section">
        <div className="setting-group">
          <label className="setting-label">Quality</label>
          <div className="quality-buttons">
            {qualityOptions.map(option => (
              <button
                key={option.key}
                className={`quality-btn ${selectedQuality === option.key ? 'active' : ''}`}
                onClick={() => setSelectedQuality(option.key)}
                title={option.description}
              >
                <div className="quality-name">{option.name}</div>
                <div className="quality-time">{option.timeEstimate}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">Aspect Ratio</label>
          <div className="aspect-ratio-buttons">
            {aspectRatioOptions.map(option => (
              <button
                key={option.key}
                className={`aspect-btn ${selectedAspectRatio === option.key ? 'active' : ''}`}
                onClick={() => setSelectedAspectRatio(option.key)}
                title={`${option.name} (${option.width}x${option.height})`}
              >
                <div className="aspect-ratio">{option.key}</div>
                <div className="aspect-name">{option.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="advanced-section">
        <label className="section-label">Advanced Settings</label>
        <div className="advanced-settings">
          <div className="setting-group">
            <label className="setting-label">Seed (Optional)</label>
            <input
              type="number"
              value={customSeed || ''}
              onChange={(e) => setCustomSeed(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Random seed for reproducible results"
              className="seed-input"
            />
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="generate-section">
        <button
          className={`generate-btn ${isGenerating ? 'generating' : ''}`}
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <div className="generating-spinner"></div>
              Generating... {generationProgress}%
            </>
          ) : (
            <>
              🎨 Generate Image
            </>
          )}
        </button>
        
        {isGenerating && (
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Generation Info */}
      <div className="generation-info">
        <div className="info-item">
          <span className="info-label">Style:</span>
          <span className="info-value">{selectedStyle.name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Quality:</span>
          <span className="info-value">{QUALITY_SETTINGS[selectedQuality].name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Aspect:</span>
          <span className="info-value">{selectedAspectRatio}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Est. Time:</span>
          <span className="info-value">{QUALITY_SETTINGS[selectedQuality].timeEstimate}</span>
        </div>
      </div>
    </motion.div>
  );
};