// apps/ghost-studio/src/lib/prompt/knob-interpreter.ts
import type { KnobSettings } from '../../types/suno';

export const interpretKnobs = {
  mood(v: number) {
    if (v <= 12) return 'deeply depressive and dark';
    if (v <= 25) return 'melancholic and sad';
    if (v <= 37) return 'somber and reflective';
    if (v <= 50) return 'calm and balanced';
    if (v <= 62) return 'hopeful and uplifting';
    if (v <= 75) return 'happy and energetic';
    if (v <= 87) return 'euphoric and intense';
    return 'ecstatic and explosive';
  },
  negative(knobs: KnobSettings) {
    const avoid: string[] = [];
    if (knobs.garage < 30) avoid.push('lo-fi', 'tape hiss', 'vinyl crackle');
    if (knobs.trash < 30) avoid.push('distortion', 'harsh', 'aggressive', 'screaming');
    if (knobs.expressivity < 30) avoid.push('upbeat', 'happy', 'cheerful', 'party');
    if (knobs.expressivity > 70) avoid.push('sad', 'melancholic', 'depressing', 'somber');
    return avoid.join(', ');
  },
  weights(knobs: KnobSettings) {
    const creativityWeight = +(0.3 + (knobs.rareza / 100) * 0.6).toFixed(2);
    const styleWeight = +(0.9 - (knobs.rareza / 100) * 0.4).toFixed(2);
    const audioWeight = +(0.8 - (knobs.rareza / 100) * 0.3).toFixed(2);
    return { creativityWeight, styleWeight, audioWeight };
  }
};
