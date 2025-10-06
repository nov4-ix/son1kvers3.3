// apps/ghost-studio/src/lib/prompt/style-mapper.ts
import type { KnobSettings } from '../../types/suno';
import type { AudioAnalysis } from '../../types/audio';

export function mapStyle(knobs: KnobSettings, analysis: AudioAnalysis): string {
  const parts: string[] = [analysis.genre];

  if (knobs.garage >= 70) parts.push('lo-fi', 'heavily saturated', 'analog warmth', 'tape hiss');
  else if (knobs.garage >= 40) parts.push('warm analog', 'subtle saturation');
  else parts.push('clean production', 'digital clarity');

  if (knobs.trash >= 70) parts.push('heavily distorted', 'aggressive', 'industrial', 'harsh');
  else if (knobs.trash >= 40) parts.push('edgy', 'gritty', 'distorted elements');
  else parts.push('polished', 'smooth');

  parts.push(`${analysis.bpm} BPM`);
  return parts.join(', ');
}
