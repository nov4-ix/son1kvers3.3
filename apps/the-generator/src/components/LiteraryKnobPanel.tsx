// src/components/LiteraryKnobPanel.tsx
import { useGeneratorStore } from '../store/generatorStore';
import { LiteraryKnob } from './LiteraryKnob';

export function LiteraryKnobPanel() {
  const { knobs, setKnobs } = useGeneratorStore();
  
  return (
    <div className="glass p-6 rounded-2xl grid grid-cols-5 gap-4">
      <LiteraryKnob 
        label="METÁFORA" 
        color="#B84DFF" 
        value={knobs.metaphor} 
        onChange={v => setKnobs({ metaphor: v })} 
      />
      <LiteraryKnob 
        label="INTENSIDAD" 
        color="#FF6B6B" 
        value={knobs.intensity} 
        onChange={v => setKnobs({ intensity: v })} 
      />
      <LiteraryKnob 
        label="LÉXICO" 
        color="#00FFE7" 
        value={knobs.lexicon} 
        onChange={v => setKnobs({ lexicon: v })} 
      />
      <LiteraryKnob 
        label="GANCHO" 
        color="#F5D76E" 
        value={knobs.hook} 
        onChange={v => setKnobs({ hook: v })} 
      />
      <LiteraryKnob 
        label="FLUJO" 
        color="#9AF7EE" 
        value={knobs.flow} 
        onChange={v => setKnobs({ flow: v })} 
      />
    </div>
  );
}
