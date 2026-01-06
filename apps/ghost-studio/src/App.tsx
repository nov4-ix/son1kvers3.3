import { Suspense, lazy } from 'react';
import { ModeSelector, usePersistedMode } from './components/ModeSelector/ModeSelector';

// Lazy load modes for better performance
const MiniDAWMode = lazy(() => import('./modes/MiniDAW/MiniDAWMode').then(m => ({ default: m.GhostStudio })));
const ProDAWMode = lazy(() => import('./modes/ProDAW/SonicDAW').then(m => ({ default: m.SonicDAW })).catch(() => ({ default: () => <div className="text-white p-8">Pro DAW Mode - Coming Soon</div> })));
const VoiceCloneMode = lazy(() => import('./modes/VoiceClone/CloneStation').then(m => ({ default: m.default })).catch(() => ({ default: () => <div className="text-white p-8">Voice Clone Mode - Coming Soon</div> })));

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-carbon flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/70">Loading...</p>
            </div>
        </div>
    );
}

export function App() {
    const [mode, setMode] = usePersistedMode('ghost-studio-mode', 'mini');

    return (
        <div className="min-h-screen bg-carbon">
            <ModeSelector mode={mode} onChange={setMode} />

            <Suspense fallback={<LoadingFallback />}>
                {mode === 'mini' && <MiniDAWMode />}
                {mode === 'pro' && <ProDAWMode />}
                {mode === 'clone' && <VoiceCloneMode />}
            </Suspense>
        </div>
    );
}

export default App;
