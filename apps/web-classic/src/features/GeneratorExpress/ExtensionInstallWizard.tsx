import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Download, RefreshCw, CheckCircle, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui';

interface ExtensionInstallWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckAgain: () => void;
}

export const ExtensionInstallWizard: React.FC<ExtensionInstallWizardProps> = ({
    isOpen,
    onClose,
    onCheckAgain
}) => {
    const [step, setStep] = useState(1);
    const [isChecking, setIsChecking] = useState(false);

    if (!isOpen) return null;

    const handleCheck = async () => {
        setIsChecking(true);
        // Simulate check or real check
        await new Promise(resolve => setTimeout(resolve, 1500));
        onCheckAgain();
        setIsChecking(false);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl shadow-cyan-900/20"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 p-6 border-b border-white/5 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Shield className="w-5 h-5 text-cyan-400" />
                                Instalación Requerida
                            </h2>
                            <p className="text-white/60 text-sm mt-1">
                                Para generar música ilimitada y segura, necesitas el puente de seguridad Son1k.
                            </p>
                        </div>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Step 1: Download */}
                            <div className={`flex gap-4 p-4 rounded-xl transition-all ${step === 1 ? 'bg-white/5 border border-cyan-500/30' : 'opacity-50'}`}>
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">1</div>
                                <div>
                                    <h3 className="text-white font-medium mb-1">Descargar Extensión</h3>
                                    <p className="text-white/60 text-sm mb-3">Descarga la extensión oficial Son1kVers3 Security Bridge.</p>
                                    {step === 1 && (
                                        <Button
                                            onClick={() => {
                                                window.open('https://chrome.google.com/webstore/detail/son1kvers3-bridge/placeholder', '_blank');
                                                setStep(2);
                                            }}
                                            variant="primary"
                                            className="w-full sm:w-auto"
                                            icon={<Download className="w-4 h-4" />}
                                        >
                                            Descargar ahora
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: Install */}
                            <div className={`flex gap-4 p-4 rounded-xl transition-all ${step === 2 ? 'bg-white/5 border border-cyan-500/30' : 'opacity-50'}`}>
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold border border-purple-500/30">2</div>
                                <div>
                                    <h3 className="text-white font-medium mb-1">Activar</h3>
                                    <p className="text-white/60 text-sm">
                                        Sigue las instrucciones del navegador para activar la extensión instalada.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3: Verify */}
                            <div className={`flex gap-4 p-4 rounded-xl transition-all ${step >= 2 ? 'bg-white/5 border border-cyan-500/30' : 'opacity-50'}`}>
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold border border-green-500/30">3</div>
                                <div>
                                    <h3 className="text-white font-medium mb-1">Verificar Conexión</h3>
                                    <p className="text-white/60 text-sm mb-3">Confirma que el puente esté activo.</p>

                                    <Button
                                        onClick={handleCheck}
                                        disabled={isChecking}
                                        variant="nexus"
                                        className="w-full sm:w-auto"
                                        loading={isChecking}
                                        icon={<RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />}
                                    >
                                        {isChecking ? 'Verificando...' : 'Verificar Instalación'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-black/20 border-t border-white/5 text-center">
                        <p className="text-xs text-white/30">
                            Esta extensión solo maneja tokens de sesión seguros. No accede a tus datos personales.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExtensionInstallWizard;
