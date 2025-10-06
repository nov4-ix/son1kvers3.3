// Conversion Manager - Gestor de conversión de Clone Station del universo Son1kVerse

import React from 'react';
import { useCloneStore } from '../store/useCloneStore';

export function ConversionManager() {
  const { conversionJobs } = useCloneStore();

  return (
    <div className="conversion-manager">
      <h2>🔄 Conversion Manager</h2>
      <p>Convert audio and text using your trained models</p>
      <div className="conversion-jobs">
        {conversionJobs.map((job) => (
          <div key={job.id} className="conversion-job">
            <h3>{job.modelName}</h3>
            <p>Type: {job.inputType} → {job.outputType}</p>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${job.progress}%` }}
              />
            </div>
            <span>{job.progress}%</span>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .conversion-manager {
          padding: var(--spacing-lg);
        }
        
        .conversion-jobs {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .conversion-job {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(0, 255, 231, 0.2);
          border-radius: 4px;
          overflow: hidden;
          margin: var(--spacing-sm) 0;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary));
          transition: width var(--transition-normal);
        }
      `}</style>
    </div>
  );
}