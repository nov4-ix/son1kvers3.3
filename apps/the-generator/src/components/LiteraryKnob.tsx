// src/components/LiteraryKnob.tsx
import { useState, useEffect } from 'react';

interface LiteraryKnobProps {
  label: string;
  color: string;
  value: number;
  onChange: (v: number) => void;
}

export function LiteraryKnob({ label, color, value, onChange }: LiteraryKnobProps) {
  const [drag, setDrag] = useState(false);
  const rotation = (value / 100) * 270 - 135;
  
  const handleMove = (e: MouseEvent) => {
    if (!drag) return;
    onChange(Math.max(0, Math.min(100, value - (e.movementY || 0))));
  };
  
  useEffect(() => {
    if (!drag) return;
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', () => setDrag(false));
    return () => {
      window.removeEventListener('mousemove', handleMove);
    };
  }, [drag, value]);
  
  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <span className="text-white/80 text-xs tracking-widest">{label}</span>
      <div 
        className="relative w-24 h-24 rounded-full cursor-pointer" 
        style={{ 
          background: `conic-gradient(${color} ${value * 3.6}deg, #1a1a1a ${value * 3.6}deg)` 
        }} 
        onMouseDown={() => setDrag(true)}
      >
        <div className="absolute inset-2 rounded-full bg-black/60 border border-white/10" />
        <div 
          className="absolute top-1/2 left-1/2 w-1 h-10" 
          style={{ 
            transform: `translate(-50%,-100%) rotate(${rotation}deg)`, 
            background: color 
          }} 
        />
      </div>
      <div className="text-white/70 text-sm font-mono">{value}</div>
    </div>
  );
}
