// src/pages/TheGenerator.tsx
import { useState, useEffect } from 'react';
import { LyricInput } from '../components/LyricInput';
import { LiteraryKnobPanel } from '../components/LiteraryKnobPanel';
import { CombinedLyricPrompt } from '../components/CombinedLyricPrompt';
import { StylePromptInput } from '../components/StylePromptInput';
import { CreativeStyleButton } from '../components/CreativeStyleButton';
import { AudioPreview } from '../components/AudioPreview';
import { SunoIntegration } from '../components/SunoIntegration';
import { PrivacyModal } from '../components/PrivacyModal';
import { contentGeneratorService } from '../services/contentGenerator';
import { useGeneratorStore } from '../store/generatorStore';

export default function TheGenerator() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState('');
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [isGeneratingStyle, setIsGeneratingStyle] = useState(false);
  
  // Obtener perillas del store
  const { knobs } = useGeneratorStore();

  useEffect(() => {
    // Verificar si ya se aceptaron los términos
    const privacyAccepted = localStorage.getItem('son1kverse_privacy_accepted');
    
    if (privacyAccepted !== 'true') {
      // Mostrar modal de privacidad
      setShowPrivacyModal(true);
    }
  }, []);

  const handlePrivacyAccept = () => {
    localStorage.setItem('son1kverse_privacy_accepted', 'true');
    setShowPrivacyModal(false);
  };

  const handlePrivacyReject = () => {
    setShowPrivacyModal(false);
    // Mostrar mensaje de que se requieren los términos
    alert('Para usar Son1kVerse AI Music Engine debes aceptar los términos de privacidad.');
  };

  const handleGenerateLyrics = async () => {
    setIsGeneratingLyrics(true);
    try {
      const generatedLyrics = await contentGeneratorService.generateLyrics('Genera una letra creativa', knobs);
      setLyrics(generatedLyrics);
    } catch (error) {
      console.error('Error generating lyrics:', error);
      alert('Error al generar letra');
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  const handleGenerateStyle = async () => {
    setIsGeneratingStyle(true);
    try {
      const generatedStyle = await contentGeneratorService.generateStyle('Genera un estilo musical', knobs);
      setStyle(generatedStyle);
    } catch (error) {
      console.error('Error generating style:', error);
      alert('Error al generar estilo musical');
    } finally {
      setIsGeneratingStyle(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-carbon">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan/5 via-transparent to-magenta/5" />
      
      <div className="relative z-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">THE GENERATOR</h1>
          <p className="text-white/60">Escribe tu idea, ajusta las perillas y genera letra y audio ✨</p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Perillas Literarias */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Perillas Literarias</h2>
            <LiteraryKnobPanel />
          </div>
          
          {/* CUADRO 1: Letra */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Letra</h2>
            <div className="space-y-3">
              <textarea 
                placeholder="Escribe tu letra aquí o genera una nueva con el botón..."
                className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/50 focus:border-cyan focus:outline-none"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
              />
              <button 
                onClick={handleGenerateLyrics}
                disabled={isGeneratingLyrics}
                className="px-4 py-2 bg-cyan text-black rounded-lg hover:bg-cyan/80 transition-colors disabled:opacity-50"
              >
                {isGeneratingLyrics ? 'Generando...' : 'Generar Letra'}
              </button>
            </div>
          </div>
          
          {/* CUADRO 2: Prompt Musical */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Prompt Musical</h2>
            <div className="space-y-3">
              <textarea 
                placeholder="Escribe tu prompt musical aquí o genera uno con el botón..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/50 focus:border-cyan focus:outline-none"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
              <button 
                onClick={handleGenerateStyle}
                disabled={isGeneratingStyle}
                className="px-4 py-2 bg-magenta text-white rounded-lg hover:bg-magenta/80 transition-colors disabled:opacity-50"
              >
                {isGeneratingStyle ? 'Generando...' : 'Generar Prompt Musical'}
              </button>
            </div>
          </div>
          
          {/* Botón Generar Audio */}
          <div className="text-center">
            <SunoIntegration />
          </div>
          
          {/* Preview de Audio */}
          <AudioPreview />
        </div>
      </div>

      {/* Modal de Privacidad */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onAccept={handlePrivacyAccept}
        onReject={handlePrivacyReject}
      />
    </div>
  );
}