# 🎵 Suno Music Generator - Chrome Extension

## 📋 **DESCRIPCIÓN**

Extensión de Chrome que permite generar música con IA usando la API de Suno. Incluye token de autenticación preconfigurado y funcionalidad de contexto para texto seleccionado.

---

## 🚀 **INSTALACIÓN**

### **1. Cargar en Chrome:**

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa "Modo de desarrollador" (Developer mode)
3. Click en "Cargar extensión sin empaquetar" (Load unpacked)
4. Selecciona la carpeta `suno-extension`
5. ¡La extensión estará instalada!

### **2. Verificar instalación:**

- Deberías ver el icono de la extensión en la barra de herramientas
- Click derecho en cualquier texto debería mostrar "IA: generar música con el texto seleccionado"

---

## 🎯 **CÓMO USAR**

### **Método 1: Desde el icono**
1. Click en el icono de la extensión
2. Se abrirá una nueva pestaña con la interfaz
3. Completa los campos:
   - **Título:** Nombre de la canción
   - **Estilo:** Género musical (ej: "rock", "pop", "electronic")
   - **Letra:** Texto de la canción
4. Click en "Generar"

### **Método 2: Desde texto seleccionado**
1. Selecciona texto en cualquier página web
2. Click derecho → "IA: generar música con el texto seleccionado"
3. Se abrirá la interfaz con el texto ya cargado en "Letra"
4. Completa título y estilo
5. Click en "Generar"

---

## ⚙️ **CONFIGURACIÓN**

### **Token de Autenticación:**
- **Por defecto:** Ya incluido (`TKMTA0Mzk3MjU3NzgwNDE1NDc3NzQ1OmJjODM2ZDI0MGNiOWM3NWM2YzBjNzhlZmU5NzFkZjhl`)
- **Personalizado:** Puedes cambiar el token en el campo "Token (opcional)"

### **API Endpoint:**
- **URL:** `https://usa.imgkits.com/node-api/suno/generate`
- **Método:** POST
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer [token]`
  - `channel: chrome-extension`

---

## 📁 **ESTRUCTURA DE ARCHIVOS**

```
suno-extension/
├── manifest.json           # Configuración de la extensión
├── background.js           # Service worker (lógica principal)
├── index.html              # Interfaz de usuario
├── index.js                # Lógica del frontend
├── index.css               # Estilos
├── _locales/
│   └── en/
│       └── messages.json   # Textos de la extensión
└── images/
    ├── 16.png              # Icono 16x16
    ├── 48.png              # Icono 48x48
    └── 128.png             # Icono 128x128
```

---

## 🔧 **FUNCIONALIDADES**

### **✅ Implementado:**
- ✅ Context menu para texto seleccionado
- ✅ Interfaz de usuario completa
- ✅ Token de autenticación preconfigurado
- ✅ Generación de música con Suno API
- ✅ Almacenamiento local de resultados
- ✅ Manejo de errores
- ✅ Timeout de 60 segundos
- ✅ Payload automático con metadatos

### **🎨 UI Features:**
- ✅ Diseño dark theme
- ✅ Glassmorphism effects
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Result display

---

## 📊 **PAYLOAD EJEMPLO**

```json
{
  "title": "Mi Canción",
  "style": "rock",
  "lyrics": "Esta es la letra de mi canción...",
  "prompt": "Style: rock\n\nLyrics:\nEsta es la letra de mi canción...",
  "meta": {
    "source": "chrome-extension",
    "ts": 1694123456789
  }
}
```

---

## 🐛 **TROUBLESHOOTING**

### **La extensión no aparece:**
1. Verifica que esté habilitada en `chrome://extensions/`
2. Revisa que no haya errores en la consola
3. Recarga la extensión

### **Error de API:**
1. Verifica que el token sea válido
2. Revisa la consola para errores específicos
3. Verifica la conexión a internet

### **No funciona el context menu:**
1. Verifica permisos en `chrome://extensions/`
2. Recarga la extensión
3. Reinicia Chrome

---

## 🔒 **PERMISOS**

La extensión requiere:
- **`contextMenus`** - Para el menú contextual
- **`storage`** - Para guardar resultados localmente

---

## 📝 **LOGS Y DEBUG**

### **Ver logs:**
1. Ve a `chrome://extensions/`
2. Click en "Detalles" de la extensión
3. Click en "Inspeccionar vistas: background page"
4. Revisa la consola para logs

### **Debug del frontend:**
1. Abre la pestaña de la extensión
2. F12 para abrir DevTools
3. Revisa la consola para errores

---

## 🚀 **PRÓXIMAS MEJORAS**

- [ ] Descarga directa de audio
- [ ] Historial de generaciones
- [ ] Múltiples estilos predefinidos
- [ ] Integración con Ghost Studio
- [ ] Notificaciones de progreso

---

## 📞 **SOPORTE**

Si tienes problemas:
1. Revisa la consola de Chrome
2. Verifica que el token sea válido
3. Comprueba la conexión a internet
4. Recarga la extensión

---

## 🎉 **¡LISTO PARA USAR!**

**La extensión está completamente funcional con:**
- ✅ Token de autenticación incluido
- ✅ Interfaz de usuario completa
- ✅ Context menu funcionando
- ✅ API de Suno integrada
- ✅ Manejo de errores
- ✅ Almacenamiento local

**¡A generar música! 🎵✨**

---

**Creado por Son1kVerse**  
**Powered by Suno AI**
