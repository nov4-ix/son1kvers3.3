// Training Manager - Gestor de entrenamiento de Clone Station del universo Son1kVerse

import React from 'react';
import { useCloneStore } from '../store/useCloneStore';

export function TrainingManager() {
  const { trainingJobs } = useCloneStore();

  return (
    <div className="training-manager">
      <h2>🏋️ Training Manager</h2>
      <p>Monitor and manage your training jobs</p>
      <div className="training-jobs">
        {trainingJobs.map((job) => (
          <div key={job.id} className="training-job">
            <h3>{job.modelName}</h3>
            <p>Status: {job.status}</p>
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
        .training-manager {
          padding: var(--spacing-lg);
        }
        
        .training-jobs {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .training-job {
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