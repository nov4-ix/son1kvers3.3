// src/pages/TheGenerator.tsx
import { LyricInput } from '../components/LyricInput';
import { LiteraryKnobPanel } from '../components/LiteraryKnobPanel';
import { CombinedLyricPrompt } from '../components/CombinedLyricPrompt';
import { StylePromptInput } from '../components/StylePromptInput';
import { CreativeStyleButton } from '../components/CreativeStyleButton';
import { AudioPreview } from '../components/AudioPreview';
import { SunoIntegration } from '../components/SunoIntegration';

export default function TheGenerator() {
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
          {/* Input de Idea Base */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Tu Idea Base</h2>
            <LyricInput />
          </div>
          
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
              />
              <button className="px-4 py-2 bg-cyan text-black rounded-lg hover:bg-cyan/80 transition-colors">
                Generar Letra
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
              />
              <button className="px-4 py-2 bg-magenta text-white rounded-lg hover:bg-magenta/80 transition-colors">
                Generar Prompt Musical
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
    </div>
  );
}
