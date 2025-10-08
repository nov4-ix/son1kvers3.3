# 📋 CAMPOS REQUERIDOS - Suno Extension

## ✅ **CAMPOS OBLIGATORIOS**

### **1. Título** ⭐
- **Campo:** `title`
- **Tipo:** Texto
- **Requerido:** ✅ SÍ
- **Descripción:** Nombre de tu canción
- **Ejemplo:** "Mi Vida", "Noche de Verano", "Futuro Digital"
- **Validación:** No puede estar vacío

### **2. Estilo** ⭐
- **Campo:** `style`
- **Tipo:** Texto
- **Requerido:** ✅ SÍ
- **Descripción:** Género musical
- **Ejemplos:** "rock", "pop", "electronic", "jazz", "classical", "hip-hop"
- **Validación:** No puede estar vacío

### **3. Letra** ⭐
- **Campo:** `lyrics`
- **Tipo:** Texto largo
- **Requerido:** ✅ SÍ
- **Descripción:** Texto de la canción
- **Ejemplo:** "Esta es la letra de mi canción..."
- **Validación:** No puede estar vacío

---

## 🔧 **CAMPOS OPCIONALES**

### **4. Token**
- **Campo:** `passport`
- **Tipo:** Password
- **Requerido:** ❌ NO
- **Descripción:** Token de autenticación personalizado
- **Por defecto:** Token incluido en el código
- **Uso:** Dejar vacío para usar token por defecto

### **5. Duración**
- **Campo:** `duration`
- **Tipo:** Número
- **Requerido:** ❌ NO
- **Descripción:** Duración en segundos
- **Rango:** 10-120 segundos
- **Por defecto:** 30 segundos

### **6. Instrumental**
- **Campo:** `instrumental`
- **Tipo:** Checkbox
- **Requerido:** ❌ NO
- **Descripción:** Solo instrumental (sin voces)
- **Valores:** `true` (solo instrumental) / `false` (con voces)
- **Por defecto:** `false` (con voces)

---

## 📊 **PAYLOAD COMPLETO**

### **Estructura del Payload:**
```json
{
  "title": "Mi Canción",           // REQUERIDO
  "style": "rock",                 // REQUERIDO
  "lyrics": "Esta es la letra...", // REQUERIDO
  "prompt": "Style: rock\n\nLyrics:\nEsta es la letra...",
  "customMode": true,              // SIEMPRE true
  "instrumental": false,           // OPCIONAL
  "tags": ["rock"],               // OPCIONAL
  "duration": 30,                 // OPCIONAL
  "meta": {
    "source": "chrome-extension",
    "ts": 1694123456789
  }
}
```

---

## 🎯 **EJEMPLOS DE USO**

### **Ejemplo 1: Canción Rock Completa**
```json
{
  "title": "Mi Vida",
  "style": "rock",
  "lyrics": "Esta es mi vida, esta es mi historia, rock and roll forever...",
  "prompt": "Style: rock\n\nLyrics:\nEsta es mi vida, esta es mi historia, rock and roll forever...",
  "customMode": true,
  "instrumental": false,
  "tags": ["rock"],
  "duration": 45
}
```

### **Ejemplo 2: Solo Instrumental**
```json
{
  "title": "Melodía de Paz",
  "style": "ambient",
  "lyrics": "Melodía suave que calma el alma...",
  "prompt": "Style: ambient\n\nLyrics:\nMelodía suave que calma el alma...",
  "customMode": true,
  "instrumental": true,
  "tags": ["ambient"],
  "duration": 60
}
```

### **Ejemplo 3: Canción Corta**
```json
{
  "title": "Hook Rápido",
  "style": "pop",
  "lyrics": "Hook, hook, hook, catchy hook...",
  "prompt": "Style: pop\n\nLyrics:\nHook, hook, hook, catchy hook...",
  "customMode": true,
  "instrumental": false,
  "tags": ["pop"],
  "duration": 15
}
```

---

## 🔍 **VALIDACIONES IMPLEMENTADAS**

### **Validación de Campos Requeridos:**
- ✅ **Título:** `if (!title) { error: "El título es requerido" }`
- ✅ **Estilo:** `if (!style) { error: "El estilo es requerido" }`
- ✅ **Letra:** `if (!lyrics) { error: "La letra es requerida" }`

### **Validación de Formato:**
- ✅ **Duración:** `parseInt(duration) || 30` (10-120 segundos)
- ✅ **JSON:** Payload debe ser JSON válido
- ✅ **Token:** Se usa el token por defecto si está vacío

### **Validación de API:**
- ✅ **customMode:** Siempre `true`
- ✅ **instrumental:** `false` o `true`
- ✅ **tags:** Array con el estilo
- ✅ **meta:** Metadatos incluidos

---

## 🚨 **ERRORES COMUNES**

### **Error 422 - Campos Faltantes:**
```json
{
  "response": {
    "code": 422,
    "data": null,
    "msg": "customMode cannot be null"
  }
}
```
**Solución:** ✅ Resuelto - `customMode: true` incluido

### **Error 422 - Instrumental:**
```json
{
  "response": {
    "code": 422,
    "data": null,
    "msg": "instrumental cannot be null"
  }
}
```
**Solución:** ✅ Resuelto - `instrumental: false/true` incluido

### **Error de Validación:**
```json
{
  "response": {
    "code": 422,
    "data": null,
    "msg": "El título es requerido"
  }
}
```
**Solución:** ✅ Resuelto - Validación de campos implementada

---

## 💾 **FUNCIONALIDAD DE GUARDAR/CARGAR**

### **Guardar Datos:**
- **Botón:** 💾 Guardar
- **Función:** `saveData()`
- **Almacena:** Título, Estilo, Duración, Letra, Instrumental, Token
- **Ubicación:** `chrome.storage.local`

### **Cargar Datos:**
- **Botón:** 📁 Cargar
- **Función:** `loadData()`
- **Carga:** Todos los campos guardados
- **Actualiza:** Payload automáticamente

### **Datos Guardados:**
```json
{
  "savedData": {
    "title": "Mi Canción",
    "style": "rock",
    "duration": "30",
    "lyrics": "Esta es la letra...",
    "instrumental": false,
    "passport": ""
  }
}
```

---

## 🎉 **¡COMPLETAMENTE FUNCIONAL!**

**La extensión ahora incluye:**
- ✅ **Información clara** de campos requeridos
- ✅ **Validación completa** de campos
- ✅ **Funcionalidad de guardar/cargar** datos
- ✅ **UI mejorada** con indicadores visuales
- ✅ **Manejo de errores** robusto
- ✅ **Documentación completa** de campos

**¡Recarga la extensión y prueba! 🎵✨**

---

## 📝 **INSTRUCCIONES RÁPIDAS:**

1. **Recarga la extensión** (chrome://extensions/ → 🔄)
2. **Completa los campos requeridos** (marcados con *)
3. **Guarda tus datos** (💾 Guardar)
4. **Genera música** (Click en "Generar")
5. **Carga datos guardados** (📁 Cargar) cuando necesites

**¡A generar música! 🎵✨**
