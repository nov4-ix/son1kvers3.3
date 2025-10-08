#!/bin/bash

# 🎵 Suno Music Generator - Chrome Extension
# Script de instalación automática

echo "🎵 Instalando Suno Music Generator Extension..."

# Verificar que estamos en el directorio correcto
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: No se encontró manifest.json"
    echo "   Asegúrate de estar en el directorio suno-extension"
    exit 1
fi

# Verificar estructura de archivos
echo "📁 Verificando estructura de archivos..."

required_files=(
    "manifest.json"
    "background.js"
    "index.html"
    "index.js"
    "index.css"
    "_locales/en/messages.json"
    "images/16.png"
    "images/48.png"
    "images/128.png"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: Archivo faltante: $file"
        exit 1
    fi
done

echo "✅ Todos los archivos están presentes"

# Verificar que Chrome esté instalado
if ! command -v google-chrome &> /dev/null && ! command -v chromium-browser &> /dev/null; then
    echo "⚠️  Advertencia: Chrome no detectado"
    echo "   Instala Chrome desde: https://www.google.com/chrome/"
fi

# Mostrar instrucciones de instalación
echo ""
echo "🚀 INSTRUCCIONES DE INSTALACIÓN:"
echo ""
echo "1. Abre Chrome y ve a: chrome://extensions/"
echo "2. Activa 'Modo de desarrollador' (Developer mode)"
echo "3. Click en 'Cargar extensión sin empaquetar' (Load unpacked)"
echo "4. Selecciona esta carpeta: $(pwd)"
echo "5. ¡La extensión estará instalada!"
echo ""
echo "📋 FUNCIONALIDADES:"
echo "   ✅ Context menu para texto seleccionado"
echo "   ✅ Token de autenticación incluido"
echo "   ✅ Interfaz de usuario completa"
echo "   ✅ API de Suno integrada"
echo ""
echo "🎯 CÓMO USAR:"
echo "   • Click en el icono de la extensión"
echo "   • O selecciona texto y click derecho → 'IA: generar música'"
echo ""
echo "🔧 CONFIGURACIÓN:"
echo "   • Token por defecto: TKMTA0Mzk3MjU3NzgwNDE1NDc3NzQ1OmJjODM2ZDI0MGNiOWM3NWM2YzBjNzhlZmU5NzFkZjhl"
echo "   • API: https://usa.imgkits.com/node-api/suno/generate"
echo ""
echo "📚 Para más información, lee README.md"
echo ""
echo "🎉 ¡Listo para instalar! 🎵"

# Opcional: Abrir Chrome automáticamente
if command -v google-chrome &> /dev/null; then
    echo ""
    read -p "¿Abrir Chrome automáticamente? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        google-chrome "chrome://extensions/" &
        echo "🌐 Chrome abierto en chrome://extensions/"
    fi
elif command -v chromium-browser &> /dev/null; then
    echo ""
    read -p "¿Abrir Chromium automáticamente? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        chromium-browser "chrome://extensions/" &
        echo "🌐 Chromium abierto en chrome://extensions/"
    fi
fi

echo ""
echo "🎵 ¡A generar música! ✨"
