// AI Generator - Generador de contenido IA de Nova Post Pilot del universo Son1kVerse

import React, { useState } from 'react';
import { useNovaStore } from '../store/useNovaStore';

export function AIGenerator() {
  const { aiGenerators, generateContent } = useNovaStore();
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'text' | 'image' | 'video' | 'hashtag' | 'caption' | 'story'>('text');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    await generateContent(type, prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      stopSequences: [],
    });
  };

  return (
    <div className="ai-generator">
      <h2>🤖 AI Content Generator</h2>
      <p>Generate content using artificial intelligence</p>
      
      <div className="generator-form">
        <div className="form-group">
          <label>Content Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="text">Text Post</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="hashtag">Hashtags</option>
            <option value="caption">Caption</option>
            <option value="story">Story</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            rows={4}
          />
        </div>
        
        <button onClick={handleGenerate} className="generate-button">
          Generate Content
        </button>
      </div>
      
      <div className="generated-content">
        <h3>Generated Content</h3>
        <div className="content-list">
          {aiGenerators.map((generator) => (
            <div key={generator.id} className="content-item">
              <div className="content-header">
                <span className="content-type">{generator.type}</span>
                <span className={`content-status ${generator.status}`}>{generator.status}</span>
              </div>
              <div className="content-output">{generator.output}</div>
              <div className="content-meta">
                <span>Quality: {generator.quality}</span>
                <span>Time: {generator.processingTime}ms</span>
                <span>Cost: ${generator.cost.toFixed(4)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .ai-generator {
          padding: var(--spacing-lg);
        }
        
        .generator-form {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          margin: var(--spacing-lg) 0;
        }
        
        .form-group {
          margin-bottom: var(--spacing-md);
        }
        
        .form-group label {
          display: block;
          margin-bottom: var(--spacing-sm);
          color: var(--text-primary);
          font-weight: 500;
        }
        
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          font-family: var(--font-primary);
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .generate-button {
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%);
          border: none;
          border-radius: var(--border-radius-md);
          color: var(--bg-primary);
          cursor: pointer;
          font-weight: 600;
          padding: var(--spacing-md) var(--spacing-lg);
          transition: all var(--transition-fast);
        }
        
        .generate-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 255, 231, 0.4);
        }
        
        .generated-content {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
        }
        
        .generated-content h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
        }
        
        .content-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .content-item {
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md);
          border: 1px solid rgba(0, 255, 231, 0.2);
        }
        
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }
        
        .content-type {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: rgba(0, 255, 231, 0.2);
          border: 1px solid rgba(0, 255, 231, 0.4);
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          color: var(--accent-primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .content-status {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .content-status.completed {
          background: rgba(0, 255, 0, 0.2);
          color: #00ff00;
        }
        
        .content-status.processing {
          background: rgba(255, 170, 0, 0.2);
          color: #ffaa00;
        }
        
        .content-status.failed {
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }
        
        .content-output {
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md);
          margin: var(--spacing-sm) 0;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-secondary);
          white-space: pre-wrap;
        }
        
        .content-meta {
          display: flex;
          gap: var(--spacing-md);
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}