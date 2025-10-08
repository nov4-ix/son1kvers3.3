# 🎵 Suno Extension - Instrucciones Rápidas

## ✅ **PROBLEMA RESUELTO**

El error `"customMode cannot be null"` ha sido corregido. Ahora la extensión incluye el campo `customMode: true` en el payload.

---

## 🚀 **CÓMO USAR (ACTUALIZADO)**

### **1. Instalación:**
```bash
cd suno-extension
./install.sh
# O manual: chrome://extensions/ → Load unpacked
```

### **2. Uso:**
1. **Click en el icono** de la extensión
2. **Completa los campos:**
   - **Título:** Nombre de tu canción
   - **Estilo:** Género (rock, pop, electronic, etc.)
   - **Letra:** Texto de la canción
   - **Token:** Dejar vacío (usa el token por defecto)
3. **Click en "Generar"**

### **3. Context Menu:**
1. **Selecciona texto** en cualquier página
2. **Click derecho** → "IA: generar música con el texto seleccionado"
3. **Se abre la extensión** con el texto ya cargado
4. **Completa título y estilo**
5. **Click en "Generar"**

---

## 🔧 **CONFIGURACIÓN**

### **Token:**
- **Por defecto:** Ya incluido en el código
- **Personalizado:** Puedes cambiar el token en el campo "Token"
- **Recomendación:** Dejar vacío para usar el token por defecto

### **Payload Corregido:**
```json
{
  "title": "Mi Canción",
  "style": "rock",
  "lyrics": "Esta es la letra...",
  "prompt": "Style: rock\n\nLyrics:\nEsta es la letra...",
  "customMode": true,
  "meta": {
    "source": "chrome-extension",
    "ts": 1694123456789
  }
}
```

---

## 🎯 **EJEMPLOS DE USO**

### **Ejemplo 1: Canción Rock**
- **Título:** "Mi Vida"
- **Estilo:** "rock"
- **Letra:** "Esta es mi vida, esta es mi historia..."

### **Ejemplo 2: Canción Pop**
- **Título:** "Noche de Verano"
- **Estilo:** "pop"
- **Letra:** "En una noche de verano, bajo las estrellas..."

### **Ejemplo 3: Canción Electronic**
- **Título:** "Futuro Digital"
- **Estilo:** "electronic"
- **Letra:** "En el futuro digital, donde todo es posible..."

---

## 🐛 **TROUBLESHOOTING**

### **Error "customMode cannot be null":**
- ✅ **RESUELTO** - Ahora incluye `customMode: true`

### **Error 422:**
- Verifica que todos los campos estén completos
- Asegúrate de que el token sea válido
- Revisa que la letra no esté vacía

### **Error de conexión:**
- Verifica tu conexión a internet
- Revisa que la API esté funcionando
- Intenta con un token diferente

---

## 📊 **RESPUESTA ESPERADA**

### **Éxito:**
```json
{
  "response": {
    "code": 200,
    "data": {
      "taskId": "abc123def456"
    },
    "msg": "success"
  },
  "status": "running",
  "task_id": "abc123def456"
}
```

### **Error:**
```json
{
  "response": {
    "code": 422,
    "data": null,
    "msg": "customMode cannot be null"
  },
  "status": "error",
  "task_id": null
}
```

---

## 🎉 **¡LISTO!**

**La extensión ahora funciona correctamente con:**
- ✅ Campo `customMode` incluido
- ✅ Token por defecto funcionando
- ✅ Placeholders mejorados
- ✅ UI más clara
- ✅ Instrucciones actualizadas

**¡A generar música! 🎵✨**
