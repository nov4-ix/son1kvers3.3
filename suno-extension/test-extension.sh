#!/bin/bash

echo "🧪 PRUEBA DE LA EXTENSIÓN SON1KVERSE"
echo "===================================="

# Verificar archivos críticos
echo "📁 Verificando archivos críticos..."

critical_files=(
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

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ FALTANTE: $file"
        exit 1
    fi
done

echo ""
echo "🔍 Verificando contenido crítico..."

# Verificar que el token esté en background.js
if grep -q "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9" background.js; then
    echo "✅ Token actualizado en background.js"
else
    echo "❌ Token no encontrado en background.js"
    exit 1
fi

# Verificar que el endpoint esté correcto
if grep -q "https://ai.imgkits.com/suno/generate" background.js; then
    echo "✅ Endpoint correcto en background.js"
else
    echo "❌ Endpoint incorrecto en background.js"
    exit 1
fi

# Verificar manifest.json
if grep -q "manifest_version.*3" manifest.json; then
    echo "✅ Manifest v3 correcto"
else
    echo "❌ Manifest incorrecto"
    exit 1
fi

echo ""
echo "🎯 PRUEBA DE FUNCIONALIDAD:"
echo ""
echo "1. Abre Chrome y ve a: chrome://extensions/"
echo "2. Activa 'Modo de desarrollador'"
echo "3. Haz clic en 'Cargar extensión sin empaquetar'"
echo "4. Selecciona esta carpeta: $(pwd)"
echo "5. Verifica que aparezca 'Son1kVerse AI Music Engine'"
echo ""
echo "🧪 PRUEBAS A REALIZAR:"
echo ""
echo "A) PRUEBA BÁSICA:"
echo "   • Haz clic en el ícono de la extensión"
echo "   • Debería abrirse la interfaz"
echo "   • Verifica que aparezca el disclaimer legal"
echo "   • Acepta los términos"
echo ""
echo "B) PRUEBA DE TOKEN:"
echo "   • Haz clic en '🔍 Verificar Token'"
echo "   • Debería mostrar '✅ Token válido'"
echo ""
echo "C) PRUEBA DE GENERACIÓN:"
echo "   • Llena los campos:"
echo "     - Título: 'Prueba Test'"
echo "     - Estilo: 'rock'"
echo "     - Letra: 'Esta es una prueba de la extensión'"
echo "   • Haz clic en 'Generar'"
echo "   • Debería mostrar 'Generando...' y luego el resultado"
echo ""
echo "D) PRUEBA DE CONTEXT MENU:"
echo "   • Selecciona texto en cualquier página web"
echo "   • Haz clic derecho"
echo "   • Debería aparecer 'IA: generar música con el texto seleccionado'"
echo "   • Haz clic en esa opción"
echo "   • Debería abrir la extensión con el texto pre-cargado"
echo ""
echo "🚨 SI ALGO FALLA:"
echo "   • Abre las herramientas de desarrollador (F12)"
echo "   • Ve a la pestaña 'Console'"
echo "   • Busca errores en rojo"
echo "   • Copia los errores y compártelos"
echo ""
echo "✅ ¡EXTENSIÓN LISTA PARA PROBAR!"
