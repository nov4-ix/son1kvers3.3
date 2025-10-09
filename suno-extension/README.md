# 🎵 Son1kVerse AI Music Engine - Chrome Extension

## 📋 **DESCRIPCIÓN**

Extensión de Chrome que permite generar música con IA usando la API de Suno. Incluye token de autenticación preconfigurado y funcionalidad de contexto para texto seleccionado.

---

## 🚀 **INSTALACIÓN RÁPIDA**

### **1. Instalar en Chrome:**

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa "Modo de desarrollador" (Developer mode)
3. Haz clic en "Cargar extensión sin empaquetar" (Load unpacked)
4. Selecciona la carpeta `suno-extension`
5. ¡La extensión estará instalada!

### **2. Verificar instalación:**

- Deberías ver el ícono de la extensión en la barra de herramientas
- Haz clic derecho en cualquier texto debería mostrar "IA: generar música con el texto seleccionado"

---

## 🎯 **CÓMO USAR**

### **Método 1: Desde el ícono**
1. Haz clic en el ícono de la extensión
2. Se abrirá una nueva pestaña con la interfaz
3. Completa los campos:
   - **Título:** Nombre de la canción
   - **Estilo:** Género musical (ej: "rock", "pop", "electronic")
   - **Letra:** Texto de la canción
4. Haz clic en "Generar"

### **Método 2: Desde texto seleccionado**
1. Selecciona texto en cualquier página web
2. Haz clic derecho → "IA: generar música con el texto seleccionado"
3. Se abrirá la interfaz con el texto ya cargado en "Letra"
4. Completa título y estilo
5. Haz clic en "Generar"

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
│       └── messages.json    # Textos localizados
└── images/
    ├── 16.png              # Ícono pequeño
    ├── 48.png              # Ícono mediano
    └── 128.png             # Ícono grande
```

---

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **La extensión no aparece**
- Verifica que todos los archivos están presentes
- Revisa la consola de Chrome para errores
- Recarga la extensión desde chrome://extensions/

### **Error de token**
- Verifica que el token es válido
- Usa "🔍 Verificar Token" para diagnosticar
- Agrega token personalizado si es necesario

### **La música no se genera**
- Verifica conexión a internet
- Revisa el estado de salud de la API
- Intenta con un token diferente

---

## ⚖️ **DISCLAIMER LEGAL**

Las pistas generadas por Son1kVerse AI Music Engine pueden estar sujetas a derechos de autor. El usuario es completamente responsable del uso legal de las pistas generadas.

Son1kVerse no se hace responsable del uso indebido de las pistas generadas por el sistema.

Al usar este sistema, el usuario acepta estos términos.

---

## 🎉 **¡LISTO PARA USAR!**

La extensión está completamente funcional y lista para generar música con IA. ¡Disfruta creando música!