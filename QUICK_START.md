# ⚡ QUICK START - Sistema Comunitario Son1kVers3

**Tiempo estimado:** 15-20 minutos  
**Nivel:** Intermedio  

---

## 🎯 EN 5 PASOS

### **PASO 1: Aplicar Migración SQL** (5 min)

```bash
# 1. Ve a Supabase Dashboard
open https://supabase.com/dashboard

# 2. Selecciona tu proyecto → SQL Editor

# 3. Copia el contenido de:
cat apps/the-generator/database/migrations/003_community_system.sql

# 4. Pégalo en el editor y ejecuta (botón RUN)

# 5. Verifica que se crearon las tablas:
# SELECT * FROM credit_transactions LIMIT 1;
```

---

### **PASO 2: Configurar Variables de Entorno** (3 min)

```bash
# Edita .env.local (ya existe en el root)
nano .env.local

# Asegúrate de tener:
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
GROQ_API_KEY=gsk_xxx...
SUNO_TOKENS=token1,token2,token3,token4

# Guarda (Ctrl+O, Enter, Ctrl+X)
```

**En Vercel (the-generator):**
1. Ve a: https://vercel.com/dashboard
2. Proyecto: `the-generator`
3. Settings → Environment Variables
4. Agrega las mismas variables de .env.local

---

### **PASO 3: Migrar Tokens Existentes** (2 min)

```bash
# Ejecuta el script de migración
cd apps/the-generator
npm run migrate-tokens

# Deberías ver:
# ✅ 4 tokens migrados exitosamente
```

---

### **PASO 4: Desplegar** (5 min)

```bash
# Backend
cd apps/the-generator
vercel --prod

# Frontend
cd ../web-classic
vercel --prod

# Verificar
curl https://the-generator.son1kvers3.com/api/health
# Debe responder: {"status":"healthy",...}
```

---

### **PASO 5: Instalar Extensión** (5 min)

```bash
# 1. Abre Chrome
# 2. Ve a: chrome://extensions/
# 3. Activa "Modo de desarrollador" (esquina superior derecha)
# 4. Click en "Cargar extensión sin empaquetar"
# 5. Selecciona la carpeta:
#    /Users/nov4-ix/Downloads/SSV-ALFA/suno-token-capture-extension

# 6. Ve a: https://son1kvers3.com/community
# 7. Deberías ver un badge verde: "Extensión Activa"
```

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### **Test 1: Health Check**

```bash
curl https://the-generator.son1kvers3.com/api/health

# Debe retornar:
# {
#   "status": "healthy",
#   "services": {
#     "supabase": { "status": "healthy" }
#   }
# }
```

### **Test 2: Estadísticas del Pool**

```bash
curl https://the-generator.son1kvers3.com/api/pool/stats

# Debe retornar:
# {
#   "pool": {
#     "totalTokens": 4,
#     "activeTokens": 4
#   }
# }
```

### **Test 3: Extensión**

1. Ve a: `https://son1kvers3.com/community`
2. Verifica que aparezca: "✅ Extensión Activa"
3. Verifica que se vean las estadísticas del pool

### **Test 4: Contribuir Token**

1. En `/community`, scroll down a "Contribuir Token"
2. Pega un token de prueba (obtenerlo de Suno)
3. Click en "Contribuir"
4. Deberías ver: "✅ Token agregado. Has ganado 100 créditos!"

---

## 🐛 SI ALGO FALLA

### **Error: "SUPABASE_URL not configured"**

```bash
# Verifica que las variables estén en Vercel
vercel env ls

# Si no están, agrégalas:
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY

# Redeploy
vercel --prod
```

### **Error: "No tokens available"**

```bash
# Ejecuta migración de tokens nuevamente
cd apps/the-generator
npm run migrate-tokens

# Verifica en Supabase SQL Editor:
SELECT * FROM suno_auth_tokens WHERE is_active = true;
```

### **Extensión no se conecta**

```bash
# 1. Abre DevTools en Chrome (F12)
# 2. Ve a Console
# 3. Busca mensajes de "Son1kVers3 Connector"
# 4. Si no hay mensajes:
#    - Recarga la extensión en chrome://extensions
#    - Recarga la página de Son1kVers3
```

---

## 📚 SIGUIENTE PASO

### **Crear Iconos de la Extensión** ⚠️ PENDIENTE

La extensión funciona pero necesita iconos PNG:

1. **Opción A: IA (Rápido)**
   ```
   Prompt para DALL-E/Midjourney:
   "Modern minimalist app icon, sound wave symbol, 
   neon cyan and magenta gradient, dark background, 
   glassmorphism effect, tech style, 128x128px"
   ```

2. **Opción B: Figma**
   - Crear artboard 128x128
   - Diseñar con colores: #00FFE7 (cyan) y #B84DFF (magenta)
   - Exportar en 3 tamaños (16, 48, 128)

3. **Guardar en:**
   ```
   suno-token-capture-extension/icons/
   ├── icon16.png
   ├── icon48.png
   └── icon128.png
   ```

---

## 🎉 ¡LISTO!

Tu sistema comunitario está funcionando. Los usuarios ahora pueden:

✅ Generar música ilimitada  
✅ Contribuir tokens y ganar créditos  
✅ Ver estadísticas del pool  
✅ Usar la extensión de forma transparente  

---

## 📞 AYUDA

- **Documentación Completa:** `IMPLEMENTACION_COMPLETA.md`
- **Arquitectura:** `MODELO_FINAL_EXTENSION.md`
- **Troubleshooting:** `IMPLEMENTACION_COMPLETA.md` → Sección "TROUBLESHOOTING"

---

**⏱️ Tiempo total:** ~15-20 minutos  
**🎯 Resultado:** Sistema comunitario completamente funcional  

¡Disfruta tu sistema de generación musical ilimitada! 🎵
