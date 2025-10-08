// src/lib/literaryEngine.ts
import type { LiteraryKnobs, LiteraryResult, DevicesUsed } from '../types/generator';

// Utilidad: clamp
const C = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n));

export function applyDevices(base: string, knobs: LiteraryKnobs): LiteraryResult {
  // 1) normaliza idea
  let text = base.trim();
  const used: DevicesUsed = [];

  // 2) metáfora / símil según "metaphor"
  if (knobs.metaphor >= 15) {
    used.push('metaphor');
    text = injectMetaphors(text, knobs.metaphor);
  }
  if (knobs.metaphor >= 55) {
    used.push('simile');
    text = injectSimiles(text, knobs.metaphor);
  }

  // 3) intensidad emocional → hipérbole/personificación
  if (knobs.intensity >= 45) {
    used.push('hyperbole');
    text = injectHyperbole(text, knobs.intensity);
  }
  if (knobs.intensity >= 65) {
    used.push('personification');
    text = injectPersonification(text);
  }

  // 4) lexicon → vocabulario y sintaxis
  text = elevateLexicon(text, knobs.lexicon);

  // 5) flow/ritmo → rimas internas y cadencia
  text = enhanceFlow(text, knobs.flow);

  // 6) hook/repetición
  if (knobs.hook >= 25) {
    used.push('repetition');
    text = addRefrain(text, knobs.hook);
  }

  // 7) estructura simple V/C/Br (si no existe)
  text = ensureStructure(text);

  return { text, devices: used };
}

// --- Implementaciones mínimas (MVP) ---
function injectMetaphors(t: string, amt: number): string {
  const bank = [
    ['corazón', 'faros en la niebla'],
    ['soledad', 'invierno sin relojes'],
    ['ciudad', 'mar de neón'],
    ['recuerdo', 'fotografía que arde'],
    ['amor', 'tormenta eléctrica'],
    ['dolor', 'cuchillo de cristal'],
    ['esperanza', 'luz al final del túnel'],
    ['miedo', 'sombra que persigue'],
    ['noche', 'manto de estrellas'],
    ['día', 'canción del amanecer'],
    ['lluvia', 'lágrimas del cielo'],
    ['viento', 'susurro del tiempo']
  ];
  
  let out = t;
  const picks = Math.min(2 + Math.floor(amt / 25), bank.length);
  
  for (let i = 0; i < picks; i++) {
    const [src, met] = bank[i];
    out = out.replace(new RegExp(src, 'i'), `${src} — ${met}`);
  }
  
  // Agregar líneas adicionales basadas en la cantidad
  if (amt > 60) {
    const extraLines = [
      'En cada latido, tu nombre resuena',
      'Como eco en el silencio de la noche',
      'Tu voz es la melodía que nunca se apaga',
      'En el laberinto de mis pensamientos'
    ];
    out += '\n' + extraLines[Math.floor(Math.random() * extraLines.length)];
  }
  
  return out;
}

function injectSimiles(t: string, amt: number): string {
  const sim = [
    'como lluvia en agosto',
    'como chispa en gasolina',
    'como faro entre bruma',
    'como viento en el desierto',
    'como fuego en la nieve'
  ];
  return t.replace(/\b(tú|tu|mi|yo|te|me)\b/i, m => 
    `${m} ${sim[Math.min(sim.length - 1, Math.floor(amt / 40))]}`
  );
}

function injectHyperbole(t: string, amt: number): string {
  if (amt < 50) return t;
  return t.replace(/(te extraño|te pienso|me duele|te amo)/i, '$1 mil veces');
}

function injectPersonification(t: string): string {
  const personifications = [
    'Y la luna se esconde para no escuchar.',
    'El viento susurra tu nombre en la noche.',
    'Las estrellas lloran por nosotros.',
    'El tiempo se detiene cuando estás aquí.'
  ];
  return t + '\n' + personifications[Math.floor(Math.random() * personifications.length)];
}

function elevateLexicon(t: string, amt: number): string {
  if (amt < 35) return t;
  const replacements = [
    ['bonito', 'luminoso'],
    ['triste', 'lúgubre'],
    ['feliz', 'radiante'],
    ['grande', 'inmenso'],
    ['pequeño', 'diminuto'],
    ['rápido', 'veloz'],
    ['lento', 'pausado'],
    ['fuerte', 'poderoso'],
    ['débil', 'frágil']
  ];
  
  let result = t;
  replacements.forEach(([old, newWord]) => {
    result = result.replace(new RegExp(old, 'gi'), newWord);
  });
  return result;
}

function enhanceFlow(t: string, amt: number): string {
  if (amt < 40) return t;
  // Agregar rimas internas simples
  return t.replace(/\b(s|r|n)\b/g, ''); // placeholder rítmico
}

function addRefrain(t: string, amt: number): string {
  const hooks = [
    'vuelvo a llamarte, vuelvo a caer',
    'en cada latido, tu nombre está',
    'como un eco que nunca se va',
    'en el silencio, tu voz resuena',
    'cada noche, tu recuerdo me llena'
  ];
  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const times = 1 + Math.floor(amt / 40);
  return t + '\n\n[Chorus]\n' + Array(times).fill(hook).join(' / ');
}

function ensureStructure(t: string): string {
  if (/\[Verse/i.test(t)) return t;
  
  // Generar versos de 4 líneas
  const lines = t.split('\n').filter(line => line.trim());
  const verses: string[] = [];
  
  // Crear versos de 4 líneas
  for (let i = 0; i < lines.length; i += 4) {
    const verseLines = lines.slice(i, i + 4);
    if (verseLines.length > 0) {
      verses.push(`[Verse ${Math.floor(i/4) + 1}]\n${verseLines.join('\n')}`);
    }
  }
  
  // Si no hay suficientes líneas, generar más contenido
  if (verses.length === 0) {
    verses.push(`[Verse 1]\n${t}\n\n[Chorus]\n(refrán)\n\n[Bridge]\n(confesión)`);
  } else {
    // Agregar chorus y bridge si no existen
    verses.push('\n[Chorus]\n(refrán)');
    verses.push('\n[Bridge]\n(confesión)');
  }
  
  return verses.join('\n\n');
}
