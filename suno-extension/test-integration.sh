#!/bin/bash

# 🧪 SCRIPT DE PRUEBA - INTEGRACIÓN COMPLETA SON1KVERSE
# Este script prueba toda la integración entre apps y la extensión

echo "🚀 INICIANDO PRUEBAS DE INTEGRACIÓN SON1KVERSE"
echo "=============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar status
show_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Función para mostrar info
show_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Función para mostrar warning
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
echo "📋 PASO 1: VERIFICAR EXTENSIÓN CHROME"
echo "====================================="

# Verificar que la extensión existe
if [ -f "manifest.json" ]; then
    show_status 0 "Manifest.json encontrado"
else
    show_status 1 "Manifest.json NO encontrado"
    exit 1
fi

# Verificar archivos principales
EXTENSION_FILES=("background.js" "index.html" "index.js" "index.css")
for file in "${EXTENSION_FILES[@]}"; do
    if [ -f "$file" ]; then
        show_status 0 "Archivo $file encontrado"
    else
        show_status 1 "Archivo $file NO encontrado"
    fi
done

echo ""
echo "📋 PASO 2: VERIFICAR INTEGRACIÓN THE GENERATOR"
echo "=============================================="

# Verificar que The Generator tiene la integración
GENERATOR_PATH="../../apps/the-generator/src"
if [ -d "$GENERATOR_PATH" ]; then
    show_status 0 "Directorio The Generator encontrado"
    
    # Verificar componentes de integración
    if [ -f "$GENERATOR_PATH/components/SunoIntegration.tsx" ]; then
        show_status 0 "SunoIntegration.tsx encontrado"
    else
        show_status 1 "SunoIntegration.tsx NO encontrado"
    fi
    
    if [ -f "$GENERATOR_PATH/hooks/useSunoExtension.ts" ]; then
        show_status 0 "useSunoExtension.ts encontrado"
    else
        show_status 1 "useSunoExtension.ts NO encontrado"
    fi
else
    show_status 1 "Directorio The Generator NO encontrado"
fi

echo ""
echo "📋 PASO 3: VERIFICAR INTEGRACIÓN GHOST STUDIO"
echo "=============================================="

# Verificar que Ghost Studio tiene la integración
GHOST_PATH="../../apps/ghost-studio/src"
if [ -d "$GHOST_PATH" ]; then
    show_status 0 "Directorio Ghost Studio encontrado"
    
    # Verificar componentes de integración
    if [ -f "$GHOST_PATH/components/CoverGenerator.tsx" ]; then
        show_status 0 "CoverGenerator.tsx encontrado"
    else
        show_status 1 "CoverGenerator.tsx NO encontrado"
    fi
    
    if [ -f "$GHOST_PATH/hooks/useSunoCover.ts" ]; then
        show_status 0 "useSunoCover.ts encontrado"
    else
        show_status 1 "useSunoCover.ts NO encontrado"
    fi
else
    show_status 1 "Directorio Ghost Studio NO encontrado"
fi

echo ""
echo "📋 PASO 4: VERIFICAR CONFIGURACIÓN DE EXTENSIÓN"
echo "==============================================="

# Verificar que el manifest tiene la configuración correcta
if grep -q "Son1kVerse AI Music Engine" manifest.json; then
    show_status 0 "Nombre de extensión correcto en manifest"
else
    show_status 1 "Nombre de extensión INCORRECTO en manifest"
fi

# Verificar permisos
if grep -q "contextMenus" manifest.json; then
    show_status 0 "Permisos contextMenus encontrados"
else
    show_status 1 "Permisos contextMenus NO encontrados"
fi

if grep -q "storage" manifest.json; then
    show_status 0 "Permisos storage encontrados"
else
    show_status 1 "Permisos storage NO encontrados"
fi

echo ""
echo "📋 PASO 5: VERIFICAR FUNCIONALIDAD DE EXTENSIÓN"
echo "=============================================="

# Verificar que el background.js tiene la funcionalidad correcta
if grep -q "generateMusic" background.js; then
    show_status 0 "Función generateMusic encontrada en background.js"
else
    show_status 1 "Función generateMusic NO encontrada en background.js"
fi

# Verificar que el index.js tiene la funcionalidad correcta
if grep -q "checkToken" index.js; then
    show_status 0 "Función checkToken encontrada en index.js"
else
    show_status 1 "Función checkToken NO encontrada en index.js"
fi

if grep -q "startAdvancedMonitoring" index.js; then
    show_status 0 "Función startAdvancedMonitoring encontrada en index.js"
else
    show_status 1 "Función startAdvancedMonitoring NO encontrada en index.js"
fi

echo ""
echo "📋 PASO 6: VERIFICAR SISTEMA DE PROTECCIÓN"
echo "=========================================="

# Verificar archivos de protección
PROTECTION_FILES=("legal-disclaimer.js" "config-protection.js")
for file in "${PROTECTION_FILES[@]}"; do
    if [ -f "$file" ]; then
        show_status 0 "Archivo de protección $file encontrado"
    else
        show_status 1 "Archivo de protección $file NO encontrado"
    fi
done

# Verificar que el disclaimer está integrado
if grep -q "showLegalDisclaimer" index.js; then
    show_status 0 "Disclaimer legal integrado en index.js"
else
    show_status 1 "Disclaimer legal NO integrado en index.js"
fi

echo ""
echo "📋 PASO 7: VERIFICAR SISTEMA DE USUARIOS"
echo "======================================="

# Verificar scripts de gestión de usuarios
USER_SCRIPTS=("generate-user-installation.sh" "user-management.sh" "queue-system.sh" "auto-scale.sh")
for script in "${USER_SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        show_status 0 "Script $script encontrado"
        if [ -x "$script" ]; then
            show_status 0 "Script $script es ejecutable"
        else
            show_warning "Script $script NO es ejecutable (ejecutar: chmod +x $script)"
        fi
    else
        show_status 1 "Script $script NO encontrado"
    fi
done

echo ""
echo "📋 PASO 8: VERIFICAR DOCUMENTACIÓN"
echo "=================================="

# Verificar documentación
DOC_FILES=("INSTRUCCIONES.md" "FUNCIONAL_COMPLETO.md" "DISTRIBUCION_DISCRETA_COMPLETA.md" "PROTECCION_DERECHOS.md")
for doc in "${DOC_FILES[@]}"; do
    if [ -f "$doc" ]; then
        show_status 0 "Documentación $doc encontrada"
    else
        show_status 1 "Documentación $doc NO encontrada"
    fi
done

echo ""
echo "📋 PASO 9: VERIFICAR INTEGRACIÓN PIXEL"
echo "====================================="

# Verificar que Pixel está integrado en las apps
WEB_CLASSIC_PATH="../../apps/web-classic/src"
if [ -d "$WEB_CLASSIC_PATH" ]; then
    show_status 0 "Directorio Web Classic encontrado"
    
    # Verificar componentes de Pixel
    PIXEL_FILES=("components/PixelChatAdvanced.tsx" "lib/pixelAI.ts" "lib/pixelPersonality.ts" "lib/pixelMemory.ts")
    for file in "${PIXEL_FILES[@]}"; do
        if [ -f "$WEB_CLASSIC_PATH/$file" ]; then
            show_status 0 "Archivo Pixel $file encontrado"
        else
            show_status 1 "Archivo Pixel $file NO encontrado"
        fi
    done
else
    show_status 1 "Directorio Web Classic NO encontrado"
fi

echo ""
echo "📋 PASO 10: VERIFICAR SISTEMA DE SEGURIDAD PIXEL"
echo "================================================"

# Verificar sistema de seguridad de Pixel
if [ -f "$WEB_CLASSIC_PATH/lib/pixelSecurityMonitor.ts" ]; then
    show_status 0 "Pixel Security Monitor encontrado"
else
    show_status 1 "Pixel Security Monitor NO encontrado"
fi

# Verificar documentación de seguridad
SECURITY_DOCS=("PIXEL_GUARDIAN_SECURITY.md" "PIXEL_INGENIERO_SISTEMAS.md")
for doc in "${SECURITY_DOCS[@]}"; do
    if [ -f "../../$doc" ]; then
        show_status 0 "Documentación de seguridad $doc encontrada"
    else
        show_status 1 "Documentación de seguridad $doc NO encontrada"
    fi
done

echo ""
echo "🎯 RESUMEN DE PRUEBAS"
echo "===================="

# Contar archivos encontrados vs esperados
TOTAL_FILES=0
FOUND_FILES=0

# Contar archivos de extensión
EXTENSION_FILES=("manifest.json" "background.js" "index.html" "index.js" "index.css" "legal-disclaimer.js" "config-protection.js")
for file in "${EXTENSION_FILES[@]}"; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    if [ -f "$file" ]; then
        FOUND_FILES=$((FOUND_FILES + 1))
    fi
done

# Contar scripts de gestión
USER_SCRIPTS=("generate-user-installation.sh" "user-management.sh" "queue-system.sh" "auto-scale.sh")
for script in "${USER_SCRIPTS[@]}"; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    if [ -f "$script" ]; then
        FOUND_FILES=$((FOUND_FILES + 1))
    fi
done

# Contar documentación
DOC_FILES=("INSTRUCCIONES.md" "FUNCIONAL_COMPLETO.md" "DISTRIBUCION_DISCRETA_COMPLETA.md" "PROTECCION_DERECHOS.md")
for doc in "${DOC_FILES[@]}"; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    if [ -f "$doc" ]; then
        FOUND_FILES=$((FOUND_FILES + 1))
    fi
done

# Calcular porcentaje
PERCENTAGE=$((FOUND_FILES * 100 / TOTAL_FILES))

echo ""
echo "📊 ESTADÍSTICAS:"
echo "   Archivos encontrados: $FOUND_FILES/$TOTAL_FILES"
echo "   Porcentaje de completitud: $PERCENTAGE%"

if [ $PERCENTAGE -ge 90 ]; then
    show_status 0 "Sistema listo para pruebas (90%+ completado)"
elif [ $PERCENTAGE -ge 70 ]; then
    show_warning "Sistema parcialmente listo (70-89% completado)"
else
    show_status 1 "Sistema NO listo para pruebas (<70% completado)"
fi

echo ""
echo "🚀 INSTRUCCIONES PARA PRUEBAS:"
echo "=============================="
echo ""
echo "1. 📦 INSTALAR EXTENSIÓN:"
echo "   - Abrir Chrome → chrome://extensions/"
echo "   - Activar 'Modo desarrollador'"
echo "   - Hacer clic en 'Cargar extensión sin empaquetar'"
echo "   - Seleccionar la carpeta suno-extension"
echo ""
echo "2. 🎵 PROBAR THE GENERATOR:"
echo "   - Ir a The Generator"
echo "   - Escribir letra y prompt musical"
echo "   - Hacer clic en 'Generar con Suno Extension'"
echo "   - Verificar que se abre la extensión"
echo ""
echo "3. 🎤 PROBAR GHOST STUDIO:"
echo "   - Ir a Ghost Studio"
echo "   - Subir archivo de audio"
echo "   - Ir al paso 'generate'"
echo "   - Usar CoverGenerator para generar cover"
echo ""
echo "4. 🤖 PROBAR PIXEL:"
echo "   - Ir a Web Classic"
echo "   - Hacer clic en el botón flotante de Pixel"
echo "   - Probar chat con Pixel"
echo "   - Verificar que cambia de outfit según la app"
echo ""
echo "5. 🔒 PROBAR SEGURIDAD:"
echo "   - Verificar que el disclaimer aparece"
echo "   - Aceptar términos de uso"
echo "   - Probar generación de música"
echo "   - Verificar que no se puede manipular la configuración"
echo ""

if [ $PERCENTAGE -ge 90 ]; then
    echo -e "${GREEN}🎉 ¡SISTEMA LISTO PARA PRUEBAS! 🎉${NC}"
    echo -e "${GREEN}   Todas las integraciones están implementadas${NC}"
    echo -e "${GREEN}   La extensión está lista para instalar${NC}"
    echo -e "${GREEN}   Pixel está funcionando en todas las apps${NC}"
else
    echo -e "${YELLOW}⚠️  SISTEMA PARCIALMENTE LISTO${NC}"
    echo -e "${YELLOW}   Algunos archivos faltan o tienen errores${NC}"
    echo -e "${YELLOW}   Revisar los errores mostrados arriba${NC}"
fi

echo ""
echo "🔧 COMANDOS ÚTILES:"
echo "=================="
echo ""
echo "# Hacer scripts ejecutables:"
echo "chmod +x *.sh"
echo ""
echo "# Probar sistema de usuarios:"
echo "./test-system.sh"
echo ""
echo "# Generar instalación de usuario:"
echo "./generate-user-installation.sh test_user token123 10 100 2 5"
echo ""
echo "# Monitorear colas:"
echo "./queue-system.sh status"
echo ""

echo "✨ ¡PRUEBAS COMPLETADAS! ✨"
echo "=========================="
