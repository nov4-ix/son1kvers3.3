import { useState } from 'react';

type Mode = 'mini' | 'pro' | 'clone';

interface ModeSelectorProps {
    mode: Mode;
    onChange: (mode: Mode) => void;
}

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
    return (
        <div className="flex gap-2 p-4 bg-gray-900/50 backdrop-blur-sm border-b border-white/10">
            <button
                onClick={() => onChange('mini')}
                className={`
          px-6 py-3 rounded-lg font-semibold transition-all duration-200
          ${mode === 'mini'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }
        `}
            >
                🎵 Mini DAW
            </button>

            <button
                onClick={() => onChange('pro')}
                className={`
          px-6 py-3 rounded-lg font-semibold transition-all duration-200
          ${mode === 'pro'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/50'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }
        `}
            >
                🎛️ Pro DAW
            </button>

            <button
                onClick={() => onChange('clone')}
                className={`
          px-6 py-3 rounded-lg font-semibold transition-all duration-200
          ${mode === 'clone'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-pink-500/50'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                    }
        `}
            >
                🎤 Voice Clone
            </button>
        </div>
    );
}

export function usePersistedMode(key: string, defaultMode: Mode = 'mini'): [Mode, (mode: Mode) => void] {
    const [mode, setModeState] = useState<Mode>(() => {
        try {
            const saved = localStorage.getItem(key);
            return (saved as Mode) || defaultMode;
        } catch {
            return defaultMode;
        }
    });

    const setMode = (newMode: Mode) => {
        try {
            localStorage.setItem(key, newMode);
            setModeState(newMode);
        } catch {
            setModeState(newMode);
        }
    };

    return [mode, setMode];
}
