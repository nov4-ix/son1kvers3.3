# 🎵 INTEGRACIÓN COMPLETA: THE GENERATOR + GHOST STUDIO + SUNO

## 🎯 **ARQUITECTURA DE INTEGRACIÓN**

### **Flujo de Trabajo Completo:**

```
📝 THE GENERATOR (Text-to-Music)
    ↓ (via Chrome Extension)
🎵 SUNO API (Generate)
    ↓ (audio result)
🎤 GHOST STUDIO (Audio Processing)
    ↓ (via Suno Cover API)
🎼 SUNO COVER API (Cover Generation)
    ↓ (final result)
🎧 USER (Download/Production)
```

---

## 🔗 **1. INTEGRACIÓN THE GENERATOR + EXTENSIÓN**

### **A. Modificar The Generator para usar la extensión:**

```typescript
// apps/the-generator/src/hooks/useSunoExtension.ts
export function useSunoExtension() {
  const generateWithExtension = async (lyrics: string, style: string) => {
    // Verificar si la extensión está disponible
    if (!window.chrome?.runtime?.id) {
      throw new Error('Son1kVerse AI Music Engine extension not found');
    }

    // Enviar datos a la extensión
    const response = await chrome.runtime.sendMessage({
      action: 'generateMusic',
      payload: {
        title: 'Generated Track',
        style: style,
        lyrics: lyrics,
        customMode: true,
        instrumental: false,
        tags: [style],
        duration: 30
      }
    });

    if (!response.ok) {
      throw new Error(response.error);
    }

    return response.data;
  };

  return { generateWithExtension };
}
```

### **B. Actualizar The Generator UI:**

```typescript
// apps/the-generator/src/components/SunoIntegration.tsx
export function SunoIntegration() {
  const { generateWithExtension } = useSunoExtension();
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateWithExtension(lyrics, style);
      setResult(result);
    } catch (error) {
      console.error('Error generating music:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={handleGenerate}
        disabled={isGenerating}
        className="px-6 py-3 bg-cyan text-black rounded-lg hover:bg-cyan/80 transition-colors"
      >
        {isGenerating ? 'Generando...' : '🎵 Generar con Son1kVerse AI'}
      </button>
      
      {result && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Resultado:</h3>
          <pre className="text-white/70 text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

---

## 🎤 **2. INTEGRACIÓN GHOST STUDIO + SUNO COVER**

### **A. Crear hook para Suno Cover:**

```typescript
// apps/ghost-studio/src/hooks/useSunoCover.ts
export function useSunoCover() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const generateCover = async (audioFile: File, prompt: string) => {
    setIsGenerating(true);
    try {
      // 1. Subir audio a Supabase
      const uploadResult = await supabaseStorage.uploadAudio(audioFile, 'cover-input');
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      // 2. Llamar a Suno Cover API
      const response = await fetch('https://usa.imgkits.com/node-api/suno/cover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUNO_API_KEY}`,
          'channel': 'ghost-studio'
        },
        body: JSON.stringify({
          audio_url: uploadResult.url,
          prompt: prompt,
          customMode: true,
          style: 'cover'
        })
      });

      const data = await response.json();
      setTaskId(data.data?.taskId || data.taskId);
      
      // 3. Polling para obtener resultado
      pollForResult(data.data?.taskId || data.taskId);
      
    } catch (error) {
      console.error('Error generating cover:', error);
      setIsGenerating(false);
    }
  };

  const pollForResult = async (taskId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`https://usa.imgkits.com/node-api/suno/status/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUNO_API_KEY}`,
            'channel': 'ghost-studio'
          }
        });
        
        const data = await response.json();
        
        if (data.status === 'completed') {
          setResult(data);
          setIsGenerating(false);
          clearInterval(pollInterval);
        } else if (data.status === 'failed') {
          throw new Error(data.error || 'Cover generation failed');
        }
      } catch (error) {
        console.error('Error polling result:', error);
        clearInterval(pollInterval);
        setIsGenerating(false);
      }
    }, 5000); // Poll every 5 seconds
  };

  return { generateCover, isGenerating, taskId, result };
}
```

### **B. Actualizar Ghost Studio UI:**

```typescript
// apps/ghost-studio/src/components/CoverGenerator.tsx
export function CoverGenerator() {
  const { generateCover, isGenerating, result } = useSunoCover();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleGenerateCover = async () => {
    if (!audioFile) return;
    
    await generateCover(audioFile, prompt);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Generar Cover</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm">Archivo de Audio:</label>
            <input 
              type="file" 
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className="w-full mt-1"
            />
          </div>
          
          <div>
            <label className="text-white/70 text-sm">Prompt para el Cover:</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe el estilo del cover que quieres generar..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/50 focus:border-cyan focus:outline-none"
            />
          </div>
          
          <button 
            onClick={handleGenerateCover}
            disabled={isGenerating || !audioFile}
            className="px-6 py-3 bg-magenta text-white rounded-lg hover:bg-magenta/80 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Generando Cover...' : '🎤 Generar Cover'}
          </button>
        </div>
      </div>
      
      {result && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Cover Generado:</h3>
          <div className="space-y-2">
            {result.audio_url && (
              <audio controls className="w-full">
                <source src={result.audio_url} type="audio/mpeg" />
              </audio>
            )}
            <div className="text-white/70 text-sm">
              <p>Estado: {result.status}</p>
              {result.taskId && <p>Task ID: {result.taskId}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 **3. SISTEMA DE COMUNICACIÓN ENTRE APPS**

### **A. Crear bridge de comunicación:**

```typescript
// packages/shared/src/bridge/SonoBridge.ts
export class SonoBridge {
  private static instance: SonoBridge;
  
  static getInstance(): SonoBridge {
    if (!SonoBridge.instance) {
      SonoBridge.instance = new SonoBridge();
    }
    return SonoBridge.instance;
  }

  // Enviar desde The Generator a Ghost Studio
  async sendToGhostStudio(data: {
    lyrics: string;
    style: string;
    generatedAudio?: string;
  }) {
    // Guardar en localStorage para comunicación entre apps
    localStorage.setItem('son1kverse_generator_data', JSON.stringify({
      ...data,
      timestamp: Date.now(),
      source: 'the-generator'
    }));
    
    // Abrir Ghost Studio en nueva pestaña
    window.open('/ghost-studio', '_blank');
  }

  // Recibir en Ghost Studio desde The Generator
  getFromGenerator(): any {
    const data = localStorage.getItem('son1kverse_generator_data');
    if (data) {
      const parsed = JSON.parse(data);
      // Limpiar después de leer
      localStorage.removeItem('son1kverse_generator_data');
      return parsed;
    }
    return null;
  }

  // Enviar resultado de Ghost Studio de vuelta
  async sendResult(data: {
    coverUrl: string;
    originalAudio: string;
    prompt: string;
  }) {
    localStorage.setItem('son1kverse_ghost_result', JSON.stringify({
      ...data,
      timestamp: Date.now(),
      source: 'ghost-studio'
    }));
  }
}
```

### **B. Integrar bridge en ambas apps:**

```typescript
// apps/the-generator/src/components/IntegrationPanel.tsx
export function IntegrationPanel() {
  const bridge = SonoBridge.getInstance();
  const [ghostData, setGhostData] = useState(null);

  const sendToGhostStudio = () => {
    bridge.sendToGhostStudio({
      lyrics: generatedLyrics,
      style: generatedStyle,
      generatedAudio: audioResult?.url
    });
  };

  // Escuchar resultados de Ghost Studio
  useEffect(() => {
    const checkForResults = () => {
      const result = localStorage.getItem('son1kverse_ghost_result');
      if (result) {
        setGhostData(JSON.parse(result));
        localStorage.removeItem('son1kverse_ghost_result');
      }
    };

    const interval = setInterval(checkForResults, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <button 
        onClick={sendToGhostStudio}
        className="px-6 py-3 bg-cyan text-black rounded-lg hover:bg-cyan/80 transition-colors"
      >
        🎤 Enviar a Ghost Studio
      </button>
      
      {ghostData && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Cover desde Ghost Studio:</h3>
          <audio controls className="w-full">
            <source src={ghostData.coverUrl} type="audio/mpeg" />
          </audio>
        </div>
      )}
    </div>
  );
}
```

---

## 🎛️ **4. FLUJO DE TRABAJO COMPLETO**

### **Paso a Paso:**

1. **The Generator:**
   - Usuario escribe idea base
   - Ajusta perillas literarias
   - Genera letra con IA
   - Genera prompt musical
   - **OPCIÓN A:** Genera música con extensión Suno
   - **OPCIÓN B:** Envía a Ghost Studio para cover

2. **Ghost Studio:**
   - Recibe datos de The Generator
   - Usuario sube audio original (o usa el generado)
   - Ajusta parámetros de cover
   - Genera cover con Suno Cover API
   - Envía resultado de vuelta a The Generator

3. **Resultado Final:**
   - Audio original (si aplica)
   - Música generada (desde The Generator)
   - Cover generado (desde Ghost Studio)
   - Usuario puede descargar y usar en producción

---

## 🚀 **5. IMPLEMENTACIÓN PRÁCTICA**

### **A. Actualizar The Generator:**

```bash
# Agregar dependencias
cd apps/the-generator
npm install @types/chrome
```

### **B. Actualizar Ghost Studio:**

```bash
# Agregar dependencias
cd apps/ghost-studio
npm install @types/chrome
```

### **C. Crear archivo de configuración compartido:**

```typescript
// packages/shared/src/config/sonoConfig.ts
export const SONO_CONFIG = {
  // Suno Generate API (para The Generator)
  GENERATE_API: 'https://usa.imgkits.com/node-api/suno/generate',
  
  // Suno Cover API (para Ghost Studio)
  COVER_API: 'https://usa.imgkits.com/node-api/suno/cover',
  
  // Status API
  STATUS_API: 'https://usa.imgkits.com/node-api/suno/status',
  
  // Headers comunes
  HEADERS: {
    'Content-Type': 'application/json',
    'channel': 'son1kverse'
  }
};
```

---

## 🎯 **RESULTADO FINAL**

### **Flujo Integrado:**

```
📝 THE GENERATOR
├── 🎵 Genera letra con IA
├── 🎼 Genera prompt musical
├── 🔗 Opción 1: Genera música con extensión
└── 🔗 Opción 2: Envía a Ghost Studio

🎤 GHOST STUDIO
├── 📁 Recibe datos de The Generator
├── 🎵 Sube audio original
├── 🎛️ Ajusta parámetros de cover
├── 🎼 Genera cover con Suno Cover API
└── 📤 Envía resultado de vuelta

🎧 USUARIO FINAL
├── 🎵 Música generada (text-to-music)
├── 🎤 Cover generado (audio-to-audio)
└── 💾 Descarga para producción
```

**¡Sistema completamente integrado para text-to-music y audio covers! 🎵✨**
