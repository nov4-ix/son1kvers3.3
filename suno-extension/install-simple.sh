#!/bin/bash

echo "🎵 Son1kVerse AI Music Engine - Instalación"
echo "============================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: No se encontró manifest.json"
    echo "   Asegúrate de estar en el directorio suno-extension"
    exit 1
fi

# Verificar archivos requeridos
echo "📁 Verificando archivos..."
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
echo ""
echo "🚀 INSTRUCCIONES DE INSTALACIÓN:"
echo ""
echo "1. Abre Chrome y ve a: chrome://extensions/"
echo "2. Activa 'Modo de desarrollador' (Developer mode)"
echo "3. Haz clic en 'Cargar extensión sin empaquetar' (Load unpacked)"
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
echo "   • Haz clic en el ícono de la extensión"
echo "   • O selecciona texto y haz clic derecho → 'IA: generar música'"
echo ""
echo "🔧 CONFIGURACIÓN:"
echo "   • Token por defecto: TKMTA0Mzk3MjU3NzgwNDE1NDc3NzQ1OmJjODM2ZDI0MGNiOWM3NWM2YzBjNzhlZmU5NzFkZjhl"
echo "   • API: https://usa.imgkits.com/node-api/suno/generate"
echo ""
echo "🎉 ¡Listo para instalar!"
