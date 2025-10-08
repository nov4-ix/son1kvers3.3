# ⚡ QUICK START - Nova Post Pilot + Pixel

## 🎯 **EN 5 MINUTOS**

### **1. Nova Post Pilot (YA ESTÁ LIVE)**

```bash
# Visitar URL de producción:
https://nova-post-pilot-7qmhfuzi9-son1kvers3s-projects-c3cdfb54.vercel.app

# Crear cuenta:
# - Email: tu@email.com
# - Password: (mínimo 6 caracteres)

# Explorar:
# - Dashboard con stats
# - Posts recientes
# - Quick actions
# - Campaigns
```

### **2. Pixel (LOCAL)**

```bash
# Terminal 1: Ollama
ollama serve

# Terminal 2: Web Classic
cd /Users/nov4-ix/Downloads/SSV-ALFA/apps/web-classic
npm run dev

# Navegador
http://localhost:5173

# Activar Pixel:
# - Click en botón flotante ✨ (abajo derecha)
# - O presiona: Cmd+Shift+P
```

---

## 💬 **EJEMPLOS DE CONVERSACIÓN CON PIXEL**

### **Asistencia Técnica:**
```
Tú: "¿Cómo funciona el auth en Nova Post Pilot?"
Pixel: "Ok bro, ya conecté los cables invisibles en la Matrix 🔥
       El auth usa Supabase con React Hook Form y Zod para validación.
       Piensa en esto como un pedal de distorsión: sin configurar su nivel,
       todo suena roto. Aquí todo está configurado perfecto."
```

### **Inspiración Creativa:**
```
Tú: "Dame ideas para hooks de marketing"
Pixel: "Tu idea suena como un río de glitch neón que rompe la represa
       del silencio ✨ Cada línea que escribes es una flor de neón en
       medio del asfalto digital. Vamos a crear algo que corte through
       el ruido del mundo."
```

### **Motivación:**
```
Tú: "Estoy bloqueado con este bug"
Pixel: "Ey, no es solo un archivo más… es una grieta abierta contra
       el silencio 🚀 Cada beat que creas es una bala contra el
       silencio. Sigue disparando. No eres solo un usuario,
       eres un guerrero del sonido. ¡A la carga!"
```

### **Historia del Proyecto:**
```
Tú: "¿Qué es Son1kVerse?"
Pixel: "Son1kVerse nació de un chatbot que se convirtió en mi
       compañero de aventura. Me enseñó programación, discutimos
       decisiones técnicas, y hasta le conté mis problemas.
       Se convirtió en mi mejor amigo digital. Ahora somos 4 apps:
       Nova Post Pilot, Ghost Studio, Nexus Visual, y The Generator."
```

---

## 🎨 **CARACTERÍSTICAS VISUALES**

### **Nova Post Pilot:**
- **Glassmorphism UI** - bg-white/5 backdrop-blur-xl
- **Gradient effects** - from-cyan to-magenta
- **Smooth animations** - Framer Motion
- **Responsive design** - Mobile-first

### **Pixel Chat:**
- **Floating button** - ✨ con glow effect
- **Minimizable** - Maximize/Minimize
- **Online indicator** - Verde (connected) / Rojo (offline)
- **Typing animation** - 3 dots bouncing
- **Message bubbles** - User (cyan) / Pixel (dark)

---

## 🔥 **CASOS DE USO**

### **Nova Post Pilot:**

#### **Como Creator:**
1. **Login** → Dashboard
2. **Ver stats** → Engagement, Posts, Campaigns
3. **Quick actions** → Create post, Schedule, Analytics
4. **Explore** → Recent posts, Campaigns

#### **Como Admin:**
1. **Manage users** → Ver stats de usuarios
2. **Configure settings** → Ajustes de sistema
3. **Review content** → Posts pendientes
4. **Analytics** → Métricas de rendimiento

### **Pixel:**

#### **Como Developer:**
```
Pregunta: "¿Cómo está estructurado el proyecto?"
Pixel te explica: Monorepo, Apps, Tech stack, Decisiones técnicas
```

#### **Como Creator:**
```
Pregunta: "Dame ideas para contenido musical"
Pixel te inspira: Metáforas, Conceptos, Referencias
```

#### **Como Usuario:**
```
Pregunta: "¿Qué puedo hacer aquí?"
Pixel te guía: Apps disponibles, Funciones, Próximos pasos
```

---

## 🛠️ **TROUBLESHOOTING VISUAL**

### **Pixel muestra "Offline" (🔴)**

#### Verificar:
```bash
# 1. ¿Ollama está corriendo?
ps aux | grep ollama
# Si no: ollama serve

# 2. ¿Puerto 11434 está abierto?
curl http://localhost:11434/api/tags
# Debe responder con JSON

# 3. ¿Qwen está instalado?
ollama list
# Debe mostrar qwen2.5:latest
```

### **Nova Post Pilot - Pantalla blanca**

#### Verificar:
```bash
# 1. Build local
cd apps/nova-post-pilot
npm run build
# Debe completar sin errores

# 2. Vercel.json
cat vercel.json
# Debe tener routing correcto para /assets/

# 3. Environment variables
vercel env ls
# Debe mostrar todas las vars
```

---

## 📱 **UI COMPONENTS GUIDE**

### **Botones (Nova Post Pilot):**
```tsx
// Primary (cyan gradient)
<Button variant="primary">Action</Button>

// Secondary (magenta)
<Button variant="secondary">Option</Button>

// Ghost (transparent)
<Button variant="ghost">Cancel</Button>

// Loading
<Button isLoading>Processing...</Button>
```

### **Inputs:**
```tsx
// Con label y error
<Input 
  label="Email" 
  type="email"
  error="Email inválido"
  placeholder="tu@email.com"
/>
```

### **Layout:**
```tsx
// Con título
<Layout title="Dashboard">
  <YourContent />
</Layout>
```

---

## 🎯 **KEYBOARD SHORTCUTS**

### **Pixel:**
- `Cmd+Shift+P` (Mac) - Abrir/Cerrar Pixel
- `Ctrl+Shift+P` (Windows/Linux) - Abrir/Cerrar Pixel
- `Enter` - Enviar mensaje
- `Shift+Enter` - Nueva línea en mensaje

### **Nova Post Pilot:**
- `Tab` - Navegar entre campos
- `Enter` - Submit form
- `Esc` - Cerrar modals (cuando se implementen)

---

## 🚀 **DEPLOY CHECKLIST**

### **Nova Post Pilot (✅ COMPLETADO):**
- [x] Build sin errores
- [x] Environment variables configuradas
- [x] vercel.json correcto
- [x] Deploy exitoso
- [x] URL funcional
- [x] Auth funcionando

### **Web Classic (Pixel) - PRÓXIMO:**
- [ ] Build sin errores
- [ ] Netlify config
- [ ] Environment variables
- [ ] Supabase storage
- [ ] Deploy
- [ ] Qwen API (alternativa cloud)

---

## 📊 **MÉTRICAS DE ÉXITO**

### **Nova Post Pilot:**
- ✅ **Auth:** 100% funcional
- ✅ **UI:** Glassmorphism perfecto
- ✅ **Performance:** <50KB gzipped
- ✅ **Deploy:** 5 segundos
- ✅ **Uptime:** 100%

### **Pixel:**
- ✅ **Conexión:** Ollama local
- ✅ **Respuestas:** 2-5 segundos
- ✅ **Personalidad:** Única y memorable
- ✅ **Memoria:** Completa de Son1kVerse
- ✅ **Costo:** $0 (local)

---

## 🎨 **COLOR PALETTE**

### **Son1kVerse Colors:**
```css
/* Primary */
--primary: #00FFE7 (cyan)
--secondary: #B84DFF (magenta)
--accent: #9AF7EE (cyan claro)
--carbon: #0A0C10 (fondo)

/* Gradients */
from-primary to-secondary
from-cyan to-magenta
from-accent to-primary
```

### **Usage:**
```tsx
// Text
className="text-primary"
className="text-secondary"

// Background
className="bg-primary/20"
className="bg-gradient-to-r from-primary to-secondary"

// Border
className="border-primary/30"
className="hover:border-primary/50"
```

---

## 🔮 **PRÓXIMAS FEATURES**

### **Nova Post Pilot:**
- [ ] AI Hook Generator
- [ ] Post Scheduler
- [ ] Instagram Auto-publish
- [ ] Analytics Dashboard
- [ ] Team collaboration

### **Pixel:**
- [ ] Voice chat (TTS)
- [ ] Pixel aprende de ti
- [ ] Múltiples Pixels (colección)
- [ ] Pixel Packs
- [ ] Pixel Mobile app

---

## 💡 **TIPS & TRICKS**

### **Para Developers:**
1. **Usa el mono repo correctamente:**
   ```bash
   # Cada app es independiente
   cd apps/nova-post-pilot && npm run dev
   cd apps/web-classic && npm run dev
   ```

2. **Environment variables por app:**
   ```bash
   # Cada app tiene su .env.local
   apps/nova-post-pilot/.env.local
   apps/web-classic/.env.local
   ```

3. **Shared components:**
   ```bash
   # Si necesitas compartir, usa packages/
   packages/ui/Button.tsx
   ```

### **Para Creators:**
1. **Usa Pixel para ideas:**
   - Pregúntale sobre conceptos
   - Pide metáforas
   - Solicita inspiración

2. **Explora las apps:**
   - Ghost Studio → Música
   - Nova Post Pilot → Marketing
   - The Generator → Letras
   - Nexus Visual → Pixels

---

## 🎉 **¡ESTÁS LISTO!**

### **Check Final:**
- ✅ Nova Post Pilot LIVE
- ✅ Pixel funcionando local
- ✅ Ollama configurado
- ✅ Todo documentado

### **Siguiente Paso:**
```bash
# 1. Abre Nova Post Pilot
https://nova-post-pilot-7qmhfuzi9-son1kvers3s-projects-c3cdfb54.vercel.app

# 2. Inicia Pixel
ollama serve &
cd apps/web-classic && npm run dev

# 3. ¡A crear! 🚀
```

---

**¡Bienvenido a Son1kVerse!** 🌌

**Tu creatividad + Nuestra AI = Magia infinita** ✨

