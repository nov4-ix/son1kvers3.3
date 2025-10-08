// src/hooks/useLyricGenerator.ts
import { useGeneratorStore } from '../store/generatorStore';
import { applyDevices } from '../lib/literaryEngine';

export function useLyricGenerator() {
  const { idea, knobs, setGeneratedLyrics, setStatus } = useGeneratorStore();

  return async function generate() {
    try {
      setStatus('thinking');
      const base = idea || 'Escribe aquí tu idea base.';
      const { text } = applyDevices(base, knobs);
      setGeneratedLyrics(text);
      setStatus('ready');
      return text;
    } catch (e) {
      setStatus('error');
      throw e;
    }
  };
}
