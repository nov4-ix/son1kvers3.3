# 🤖 PIXEL - Setup Completo

## 📋 **RESUMEN**

**Pixel** es tu compañero digital AI integrado en Son1kVerse. Funciona con **Qwen 2.5** (AI local via Ollama) y está disponible en todas las aplicaciones.

---

## ✅ **COMPLETADO**

### **1. Nova Post Pilot** ✨
- ✅ **Auth completo** - Login/Signup con Supabase
- ✅ **Dashboard funcional** - Stats, posts, analytics
- ✅ **Protected routes** - Rutas protegidas
- ✅ **Deployado en Vercel** - https://nova-post-pilot-7qmhfuzi9-son1kvers3s-projects-c3cdfb54.vercel.app

### **2. Pixel AI Core** 🧠
- ✅ **Qwen Client** - Conexión con Ollama local
- ✅ **Pixel AI Engine** - Personalidad + Memoria + Contexto
- ✅ **Pixel Chat Advanced** - Chat flotante con UI completa
- ✅ **Integrado en Dashboard** - Botón flotante + atajo de teclado
- ✅ **Sistema de outfits** - Diferentes personalidades por app

---

## 🚀 **SETUP RÁPIDO**

### **1. Instalar Ollama**

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Verificar instalación
ollama --version
```

### **2. Descargar Qwen 2.5**

```bash
# Descargar modelo (puede tardar unos minutos)
ollama pull qwen2.5:latest

# Verificar que esté instalado
ollama list
```

### **3. Iniciar Ollama**

```bash
# Iniciar servidor Ollama
ollama serve

# Debería estar corriendo en http://localhost:11434
```

### **4. Probar Pixel**

```bash
# Iniciar Web Classic
cd apps/web-classic
npm run dev

# Abre http://localhost:5173
# Presiona Cmd+Shift+P o click en el botón flotante
# ¡Pixel debería estar online! 🎉
```

---

## 📁 **ARCHIVOS CREADOS**

### **Pixel Core**
```
apps/web-classic/src/
├── lib/
│   ├── qwenClient.ts           # Cliente Ollama/Qwen
│   ├── pixelAI.ts              # Engine principal de Pixel
│   ├── pixelMemory.ts          # Memoria y lore de Son1kVerse
│   ├── pixelPersonality.ts     # Personalidad de Pixel
│   └── pixelOutfit.ts          # Outfits por app
└── components/
    ├── PixelChatAdvanced.tsx   # Chat flotante
    └── PixelOutfit.tsx         # Visual de outfits
```

### **Nova Post Pilot**
```
apps/nova-post-pilot/src/
├── lib/
│   ├── supabase.ts             # Cliente Supabase
│   └── utils.ts                # Utilidades
├── store/
│   └── authStore.ts            # Zustand auth store
├── components/
│   ├── ProtectedRoute.tsx      # Rutas protegidas
│   ├── ui/                     # Componentes UI
│   └── layout/                 # Layout components
└── pages/
    ├── Login.tsx               # Página login
    ├── Signup.tsx              # Página signup
    └── Dashboard.tsx           # Dashboard principal
```

---

## 🎯 **CÓMO USAR PIXEL**

### **Abrir Pixel:**
- **Atajo de teclado:** `Cmd+Shift+P` (Mac) o `Ctrl+Shift+P` (Windows/Linux)
- **Botón flotante:** Click en el botón con ✨ (bottom-right)

### **Conversaciones:**
Pixel tiene memoria de Son1kVerse y contexto de la app actual:

```
Usuario: "¿Qué es Ghost Studio?"
Pixel: "Ghost Studio es la plataforma de producción musical con AI. 
        Aquí puedes generar covers con Suno AI..."

Usuario: "Dame consejos técnicos"
Pixel: "Claro, para optimizar tu código React, considera usar..."
```

### **Outfits por App:**
Pixel cambia de outfit según la app:
- **Ghost Studio:** 🎸 Chaqueta de músico
- **Nova Post Pilot:** 👔 Lentes ejecutivos
- **The Generator:** 🎨 Boina de poeta
- **Nexus Visual:** 🥽 Visor holográfico
- **Web Classic:** 👕 Outfit base

---

## 🔧 **CONFIGURACIÓN AVANZADA**

### **Cambiar Modelo de Qwen:**

```typescript
// apps/web-classic/src/lib/qwenClient.ts
export const qwenClient = new QwenClient(
  'http://localhost:11434', 
  'qwen2.5:latest'  // Cambia aquí
)
```

Modelos disponibles:
- `qwen2.5:0.5b` - Más rápido, menos preciso
- `qwen2.5:latest` - Balance perfecto ✅
- `qwen2.5:14b` - Más inteligente, más lento

### **Personalizar Pixel:**

```typescript
// apps/web-classic/src/lib/pixelPersonality.ts
export const pixelPersonality = {
  core: {
    description: "Tu descripción...",
    tone: "Tu tono...",
    style: "Tu estilo..."
  },
  traits: [
    "Tu rasgo 1",
    "Tu rasgo 2",
    // ...
  ]
}
```

---

## 🐛 **TROUBLESHOOTING**

### **Pixel muestra "Offline"**
```bash
# Verificar que Ollama esté corriendo
curl http://localhost:11434/api/tags

# Si no responde, reiniciar Ollama
ollama serve
```

### **Respuestas lentas**
```bash
# Usar modelo más pequeño
ollama pull qwen2.5:0.5b

# Cambiar en qwenClient.ts:
model: 'qwen2.5:0.5b'
```

### **Error de CORS**
```bash
# Ollama permite CORS por defecto
# Si hay problemas, reiniciar Ollama:
pkill ollama && ollama serve
```

---

## 📊 **MÉTRICAS**

### **Performance:**
- **Tiempo de respuesta:** ~2-5 segundos (Qwen 2.5 latest)
- **Memoria usada:** ~4GB RAM (Qwen 2.5 latest)
- **Costo:** $0 (100% local, 100% gratis) 🎉

### **Capacidades:**
- ✅ **Conversaciones naturales** - Tono cálido y witty
- ✅ **Memoria de proyecto** - Conoce todo Son1kVerse
- ✅ **Contexto de app** - Sabe dónde está
- ✅ **Asistencia técnica** - Ayuda con código
- ✅ **Consejos personales** - Como un amigo digital

---

## 🎨 **CUSTOMIZACIÓN UI**

### **Colores del Chat:**
```tsx
// apps/web-classic/src/components/PixelChatAdvanced.tsx

// Mensaje del usuario:
className="bg-primary/20 text-white border border-primary/30"

// Mensaje de Pixel:
className="bg-white/5 text-white/90 border border-white/10"

// Botón flotante:
className="bg-gradient-to-r from-primary to-magenta"
```

### **Posición del Chat:**
```tsx
// Cambiar posición:
className="fixed bottom-4 right-4"  // Default
className="fixed bottom-4 left-4"   // Izquierda
className="fixed top-4 right-4"     // Arriba derecha
```

---

## 🔮 **PRÓXIMOS PASOS**

### **Pendiente:**
- [ ] Netlify deployment
- [ ] Supabase storage para historial
- [ ] Pixel en Ghost Studio
- [ ] Pixel en The Generator
- [ ] Pixel en Nexus Visual
- [ ] Pixel Mobile app

### **Mejoras futuras:**
- [ ] Voice chat (Text-to-Speech)
- [ ] Pixel aprende de cada usuario
- [ ] Múltiples Pixels (colección)
- [ ] Pixel Packs (diferentes versiones)
- [ ] Pixel Marketplace

---

## 🎉 **¡LISTO!**

**Pixel está vivo y funcionando.** 🤖✨

### **Quick Test:**
```bash
# 1. Iniciar Ollama
ollama serve

# 2. Iniciar Web Classic
cd apps/web-classic && npm run dev

# 3. Abrir navegador
http://localhost:5173

# 4. Presionar Cmd+Shift+P
# 5. Chatear con Pixel!
```

---

**Creado con ❤️ por Son1kVerse**
**Powered by Qwen 2.5 + Ollama**

