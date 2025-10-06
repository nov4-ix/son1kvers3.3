// apps/ghost-studio/src/lib/prompt/prompt-builder.ts
import type { KnobSettings } from '../../types/suno';
import type { AudioAnalysis } from '../../types/audio';
import { interpretKnobs } from './knob-interpreter';
import { mapStyle } from './style-mapper';

export function buildPromptData(knobs: KnobSettings, analysis: AudioAnalysis, userDescription: string) {
  const mood = interpretKnobs.mood(knobs.expressivity);
  const style = mapStyle(knobs, analysis);

  const promptParts = [
    userDescription?.trim() || 'Modern, cinematic re-production with tasteful space',
    mood,
    `in ${analysis.key} ${analysis.scale}`,
  ];

  if (analysis.detectedInstruments?.length) {
    promptParts.push(`featuring ${analysis.detectedInstruments.slice(0,4).join(', ')}`);
  }

  const prompt = promptParts.join(', ');
  const title = userDescription?.trim() ? userDescription.split(' ').slice(0,4).join(' ') : `${analysis.genre} Cover`;
  const negativePrompt = interpretKnobs.negative(knobs);

  return { style, prompt, title, negativePrompt };
}
