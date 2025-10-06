import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGhostStore } from '../store/useGhostStore';

export const VoiceCloner: React.FC = () => {
  const {
    currentVoiceFile,
    setCurrentVoiceFile,
    createVoiceClone,
    isGenerating
  } = useGhostStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentVoiceFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setCurrentVoiceFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    if (name && currentVoiceFile) {
      createVoiceClone(name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-cyan mb-2">Clonación de Voz</h3>
        <p className="text-accent text-sm">
          Entrena un modelo de voz usando Phantom Voice con tu audio de muestra
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan mb-2">
            Subir archivo de audio
          </label>
          <div
            className="border-2 border-dashed border-cyan rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-accent hover:bg-cyan/5"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {currentVoiceFile ? (
              <div className="space-y-2">
                <div className="text-2xl">🎵</div>
                <div className="text-cyan font-medium">{currentVoiceFile.name}</div>
                <div className="text-accent text-sm">
                  {(currentVoiceFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentVoiceFile(null);
                  }}
                  className="daw-btn daw-btn-secondary text-xs"
                >
                  Cambiar archivo
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl">📁</div>
                <div className="text-cyan font-medium">Arrastra tu archivo aquí</div>
                <div className="text-accent text-sm">o haz click para seleccionar</div>
                <div className="text-xs text-gray-500">
                  Formatos soportados: MP3, WAV, FLAC
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan mb-2">
            Nombre del modelo
          </label>
          <input
            type="text"
            name="name"
            placeholder="Mi Voz Clonada"
            className="daw-input"
            disabled={isGenerating}
            required
          />
        </div>

        <button
          type="submit"
          className="daw-btn daw-btn-primary w-full"
          disabled={isGenerating || !currentVoiceFile}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              🎭 Crear Clon de Voz
            </>
          )}
        </button>
      </form>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-cyan mb-2">📋 Requisitos del audio:</h4>
        <ul className="text-xs text-accent space-y-1">
          <li>• Duración: 10-60 segundos recomendado</li>
          <li>• Calidad: 16kHz o superior</li>
          <li>• Sin ruido de fondo</li>
          <li>• Habla clara y natural</li>
          <li>• Un solo hablante</li>
        </ul>
      </div>
    </motion.div>
  );
};