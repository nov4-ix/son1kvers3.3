// src/hooks/useStyleGenerator.ts
import { useGeneratorStore } from '../store/generatorStore';
import { analyzeStyleFromLyrics, proposeStyle } from '../lib/styleHeuristics';
import { renderStylePrompt } from '../lib/styleHeuristics';

export function useStyleGenerator() {
  const { lyrics, generatedLyrics, setGeneratedStyle, setStatus } = useGeneratorStore();
  
  return async function generate() {
    setStatus('thinking');
    const base = (generatedLyrics?.trim()?.length ? generatedLyrics : lyrics) || '';
    const analysis = analyzeStyleFromLyrics(base);
    const draft = proposeStyle(analysis);
    const prompt = renderStylePrompt(draft);
    setGeneratedStyle(prompt);
    setStatus('ready');
    return prompt;
  };
}
