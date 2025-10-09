// Servicio para generar letra y estilo musical
export class ContentGeneratorService {
  private static instance: ContentGeneratorService;

  private constructor() {}

  public static getInstance(): ContentGeneratorService {
    if (!ContentGeneratorService.instance) {
      ContentGeneratorService.instance = new ContentGeneratorService();
    }
    return ContentGeneratorService.instance;
  }

  // Generar letra usando OpenAI con perillas literarias
  async generateLyrics(prompt: string, knobs?: {metaphor: number, intensity: number, lexicon: number, hook: number, flow: number}): Promise<string> {
    try {
      // Construir prompt basado en las perillas
      let enhancedPrompt = prompt;
      
      if (knobs) {
        const metaphorLevel = knobs.metaphor > 70 ? 'alta' : knobs.metaphor > 40 ? 'media' : 'baja';
        const intensityLevel = knobs.intensity > 70 ? 'alta' : knobs.intensity > 40 ? 'media' : 'baja';
        const lexiconLevel = knobs.lexicon > 70 ? 'sofisticado' : knobs.lexicon > 40 ? 'moderado' : 'simple';
        const hookLevel = knobs.hook > 70 ? 'muy pegajoso' : knobs.hook > 40 ? 'pegajoso' : 'sutil';
        const flowLevel = knobs.flow > 70 ? 'fluido' : knobs.flow > 40 ? 'moderado' : 'pausado';

        enhancedPrompt = `${prompt}

Configuración literaria:
- Metáfora: ${metaphorLevel} (${knobs.metaphor}%)
- Intensidad: ${intensityLevel} (${knobs.intensity}%)
- Léxico: ${lexiconLevel} (${knobs.lexicon}%)
- Gancho: ${hookLevel} (${knobs.hook}%)
- Flujo: ${flowLevel} (${knobs.flow}%)`;
      }

      // Simular generación de letra con estructura completa (reemplazar con OpenAI real)
      const sampleLyrics = [
        `[ESTROFA 1]
En las calles de la ciudad, donde la noche nunca duerme,
Caminando entre la multitud, buscando algo que me pertenezca.
Los faroles brillan como estrellas, iluminando mi camino,
Mientras el viento susurra secretos que solo yo puedo entender.

[ESTROFA 2]
Corazón roto, alma perdida, pero el espíritu sigue fuerte,
Cada paso es una nueva oportunidad, cada respiración es vida.
No me rendiré, no me detendré, seguiré adelante,
Porque sé que al final del túnel, la luz me está esperando.

[ESTROFA 3]
En el horizonte se dibuja un nuevo amanecer,
Con colores que pintan la esperanza en mi ser.
Las cicatrices del ayer son lecciones del mañana,
Y cada día es una oportunidad de empezar de nuevo.

[ESTROFA 4]
No hay muros que puedan detener este corazón,
No hay sombras que puedan apagar esta pasión.
Soy libre como el viento, fuerte como el mar,
Y nada ni nadie podrá mi destino cambiar.`,

        `[ESTROFA 1]
Bajo el cielo estrellado, donde los sueños nacen,
Cada momento es una historia, cada historia es un verso.
La música fluye por mis venas, como sangre en mi corazón,
Creando melodías que solo el alma puede entender.

[ESTROFA 2]
Desde el amanecer hasta el ocaso, la vida sigue su curso,
Pero en cada instante hay magia, en cada instante hay amor.
No importa cuán oscuro sea el camino, siempre hay esperanza,
Porque la música es el lenguaje universal del alma.

[ESTROFA 3]
En el silencio de la noche, cuando todos duermen,
Los pensamientos bailan libremente, creando su propia canción.
Cada recuerdo es una nota, cada emoción es una melodía,
Tejiendo la trama de mi vida con hilos de música y poesía.

[ESTROFA 4]
El tiempo pasa, pero la música permanece eterna,
Como un eco que resuena en los rincones del alma.
No hay fronteras para los sentimientos, no hay límites para el amor,
Solo hay música, solo hay vida, solo hay esta canción.`,

        `[ESTROFA 1]
En el jardín de mis memorias, donde crecen las ilusiones,
Cada flor representa un momento, cada pétalo una emoción.
El perfume del pasado me envuelve en su abrazo,
Mientras el futuro me susurra promesas de un nuevo espacio.

[ESTROFA 2]
Las estaciones cambian, pero mi esencia permanece,
Como un árbol que crece firme, sin importar el viento.
Las raíces de mi ser se extienden hacia lo profundo,
Buscando la sabiduría que habita en el mundo.

[ESTROFA 3]
En el espejo del tiempo, veo reflejos de mi alma,
Cada arruga cuenta una historia, cada sonrisa una calma.
No temo al paso de los años, porque sé que envejezco bien,
Con la experiencia como compañera y el amor como sostén.

[ESTROFA 4]
Soy el arquitecto de mi destino, el poeta de mi vida,
Cada día escribo un verso, cada noche una melodía.
No hay final para esta historia, solo nuevos comienzos,
Porque la vida es un ciclo infinito de momentos tiernos.`
      ];

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Retornar letra aleatoria
      const randomIndex = Math.floor(Math.random() * sampleLyrics.length);
      return sampleLyrics[randomIndex];

    } catch (error) {
      console.error('Error generating lyrics:', error);
      throw new Error('Error al generar letra');
    }
  }

  // Generar estilo musical usando OpenAI con perillas literarias
  async generateStyle(prompt: string, knobs?: {metaphor: number, intensity: number, lexicon: number, hook: number, flow: number}): Promise<string> {
    try {
      // Construir prompt basado en las perillas
      let enhancedPrompt = prompt;
      
      if (knobs) {
        const intensityLevel = knobs.intensity > 70 ? 'alta' : knobs.intensity > 40 ? 'media' : 'baja';
        const flowLevel = knobs.flow > 70 ? 'rápido' : knobs.flow > 40 ? 'moderado' : 'lento';
        const hookLevel = knobs.hook > 70 ? 'muy pegajoso' : knobs.hook > 40 ? 'pegajoso' : 'sutil';

        enhancedPrompt = `${prompt}

Configuración musical:
- Intensidad: ${intensityLevel} (${knobs.intensity}%)
- Flujo: ${flowLevel} (${knobs.flow}%)
- Gancho: ${hookLevel} (${knobs.hook}%)`;
      }

      // Simular generación de estilo (reemplazar con OpenAI real)
      const sampleStyles = [
        'Rock alternativo con influencias de grunge, ritmo medio-alto, guitarras distorsionadas y voces potentes',
        'Pop electrónico con elementos de synthwave, beat pegajoso y melodías melancólicas',
        'Hip-hop experimental con samples de jazz, ritmo complejo y letras introspectivas',
        'Indie folk con guitarras acústicas, armonías vocales y atmósfera íntima',
        'Electronic dance con elementos de house, beat energético y sintetizadores brillantes',
        'R&B moderno con influencias de soul, ritmo suave y voces emotivas',
        'Reggae fusion con elementos de dub, ritmo relajado y mensaje positivo',
        'Ambient experimental con texturas sonoras, atmósfera espacial y ritmo minimalista'
      ];

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Retornar estilo aleatorio
      const randomIndex = Math.floor(Math.random() * sampleStyles.length);
      return sampleStyles[randomIndex];

    } catch (error) {
      console.error('Error generating style:', error);
      throw new Error('Error al generar estilo musical');
    }
  }

  // Generar contenido completo (letra + estilo)
  async generateCompleteContent(theme: string): Promise<{lyrics: string, style: string}> {
    try {
      const [lyrics, style] = await Promise.all([
        this.generateLyrics(theme),
        this.generateStyle(theme)
      ]);

      return { lyrics, style };
    } catch (error) {
      console.error('Error generating complete content:', error);
      throw new Error('Error al generar contenido completo');
    }
  }
}

// Exportar instancia singleton
export const contentGeneratorService = ContentGeneratorService.getInstance();
