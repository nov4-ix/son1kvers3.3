// src/lib/styleHeuristics.ts
import type { StyleAnalysis, StyleProposal } from '../types/generator';

export function analyzeStyleFromLyrics(text: string): StyleAnalysis {
  const low = /noche|ciudad|lluvia|bruma|sombra|dolor|triste|solo/i.test(text);
  const high = /sol|cielo|fuego|bailar|correr|feliz|alegre|vida/i.test(text);
  const mood = low ? 'melancholic' : high ? 'uplifting' : 'intimate';
  
  const pace = /corre|late|rápido|grita|veloz|fuerte/i.test(text) ? 'fast' : 
               /sueña|calma|silencio|lento|pausado/i.test(text) ? 'slow' : 'mid';
  
  const imageryTags = (text.match(/noche|ciudad|neón|lluvia|mar|faro|humo|estrella|luna|sol|fuego/gi) || [])
    .map(s => s.toLowerCase());
  
  return { mood, pace, imageryTags };
}

export function proposeStyle(analysis: StyleAnalysis): StyleProposal {
  const bpm = analysis.pace === 'fast' ? 138 : analysis.pace === 'slow' ? 82 : 98;
  
  let genre: string;
  let subgenre: string | undefined;
  let instruments: string[];
  let mix: string[];
  let eraTag: string | undefined;
  
  if (analysis.mood === 'uplifting') {
    genre = 'synthpop';
    subgenre = analysis.imageryTags.includes('neón') ? 'dreampop' : undefined;
    instruments = ['analog polysynth', 'punchy drums', 'warm bass', 'bright leads'];
    mix = ['glossy top-end', 'wide chorus', 'plate reverb', 'compressed vocals'];
    eraTag = 'late-2000s alt-pop';
  } else if (analysis.mood === 'melancholic') {
    genre = 'indie';
    subgenre = analysis.imageryTags.includes('lluvia') ? 'dreamy' : undefined;
    instruments = ['clean electric guitar', 'room drums', 'subtle pads', 'soft vocals'];
    mix = ['console drive', 'room reverb', 'tape warmth', 'analog saturation'];
    eraTag = 'mid-2010s indie';
  } else {
    genre = 'lofi';
    subgenre = 'chill';
    instruments = ['dusty drums', 'warm bass', 'plucked keys', 'soft synths'];
    mix = ['tape hiss', 'soft saturation', 'short room', 'vinyl crackle'];
    eraTag = 'modern lofi';
  }
  
  const references = analysis.imageryTags.includes('ciudad') ? ['neon cityscape'] : 
                   analysis.imageryTags.includes('mar') ? ['ocean waves'] : [];
  
  return { 
    genre, 
    subgenre, 
    bpm, 
    instruments, 
    mix, 
    eraTag, 
    references 
  };
}

export function renderStylePrompt(proposal: StyleProposal): string {
  const sub = proposal.subgenre ? `-${proposal.subgenre}` : '';
  const ref = proposal.references?.length ? `; references: ${proposal.references.join(', ')}` : '';
  const era = proposal.eraTag ? ` Aesthetic: ${proposal.eraTag}.` : '';
  
  return `${proposal.genre}${sub} around ~${proposal.bpm} BPM.\n` +
         `Instrumentation: ${proposal.instruments.join(', ')}.\n` +
         `Mix: ${proposal.mix.join(', ')}.${era}${ref}`;
}
