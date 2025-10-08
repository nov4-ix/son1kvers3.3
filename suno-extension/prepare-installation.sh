#!/bin/bash

# 🚀 SCRIPT DE INSTALACIÓN RÁPIDA - SON1KVERSE AI MUSIC ENGINE
# Este script prepara la extensión para instalación en Chrome

echo "🚀 PREPARANDO EXTENSIÓN SON1KVERSE AI MUSIC ENGINE"
echo "=================================================="

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

echo ""
echo "📋 PASO 1: VERIFICAR ARCHIVOS PRINCIPALES"
echo "=========================================="

# Verificar archivos esenciales
ESSENTIAL_FILES=("manifest.json" "background.js" "index.html" "index.js" "index.css")
for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        show_status 0 "Archivo $file encontrado"
    else
        show_status 1 "Archivo $file NO encontrado - REQUERIDO"
        exit 1
    fi
done

echo ""
echo "📋 PASO 2: VERIFICAR CONFIGURACIÓN"
echo "=================================="

# Verificar que el manifest tiene la configuración correcta
if grep -q "Son1kVerse AI Music Engine" manifest.json; then
    show_status 0 "Nombre de extensión correcto"
else
    show_status 1 "Nombre de extensión INCORRECTO"
fi

# Verificar permisos esenciales
if grep -q "contextMenus" manifest.json; then
    show_status 0 "Permisos contextMenus configurados"
else
    show_status 1 "Permisos contextMenus FALTANTES"
fi

if grep -q "storage" manifest.json; then
    show_status 0 "Permisos storage configurados"
else
    show_status 1 "Permisos storage FALTANTES"
fi

echo ""
echo "📋 PASO 3: VERIFICAR FUNCIONALIDAD CORE"
echo "======================================"

# Verificar funciones esenciales en background.js
if grep -q "generateMusic" background.js; then
    show_status 0 "Función generateMusic implementada"
else
    show_status 1 "Función generateMusic FALTANTE"
fi

# Verificar funciones esenciales en index.js
if grep -q "checkToken" index.js; then
    show_status 0 "Función checkToken implementada"
else
    show_status 1 "Función checkToken FALTANTE"
fi

if grep -q "startAdvancedMonitoring" index.js; then
    show_status 0 "Función startAdvancedMonitoring implementada"
else
    show_status 1 "Función startAdvancedMonitoring FALTANTE"
fi

echo ""
echo "📋 PASO 4: VERIFICAR SISTEMA DE PROTECCIÓN"
echo "=========================================="

# Verificar archivos de protección
if [ -f "legal-disclaimer.js" ]; then
    show_status 0 "Disclaimer legal implementado"
else
    show_status 1 "Disclaimer legal FALTANTE"
fi

if [ -f "config-protection.js" ]; then
    show_status 0 "Protección de configuración implementada"
else
    show_status 1 "Protección de configuración FALTANTE"
fi

# Verificar que el disclaimer está integrado
if grep -q "showLegalDisclaimer" index.js; then
    show_status 0 "Disclaimer integrado en la UI"
else
    show_status 1 "Disclaimer NO integrado en la UI"
fi

echo ""
echo "📋 PASO 5: CREAR ARCHIVO DE CONFIGURACIÓN DE USUARIO"
echo "==================================================="

# Crear archivo de configuración de usuario por defecto
cat > user-config.js << 'EOF'
// Configuración de usuario por defecto
const USER_CONFIG = {
  userId: 'default_user',
  token: 'YOUR_TOKEN_HERE',
  dailyLimit: 10,
  monthlyLimit: 100,
  concurrentLimit: 2,
  rateLimit: 5, // requests per minute
  userType: 'standard'
};

const USER_TOKENS = {
  primary: 'YOUR_TOKEN_HERE',
  backup: 'YOUR_BACKUP_TOKEN_HERE'
};

// Configuración de branding
const BRANDING = {
  name: 'Son1kVerse AI Music Engine',
  version: '1.0.0',
  description: 'Genera música con IA usando Son1kVerse AI Music Engine'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, BRANDING };
}
EOF

show_status 0 "Archivo user-config.js creado"

echo ""
echo "📋 PASO 6: CREAR ARCHIVO DE INSTRUCCIONES DE INSTALACIÓN"
echo "========================================================="

cat > INSTALACION.md << 'EOF'
# 🚀 INSTALACIÓN - SON1KVERSE AI MUSIC ENGINE

## 📦 Instalación en Chrome

### Paso 1: Preparar la extensión
1. Asegúrate de tener todos los archivos en la carpeta `suno-extension`
2. Configura tu token en `user-config.js`:
   ```javascript
   const USER_TOKENS = {
     primary: 'TU_TOKEN_AQUI',
     backup: 'TU_TOKEN_BACKUP_AQUI'
   };
   ```

### Paso 2: Instalar en Chrome
1. Abrir Chrome
2. Ir a `chrome://extensions/`
3. Activar "Modo desarrollador" (Developer mode)
4. Hacer clic en "Cargar extensión sin empaquetar" (Load unpacked)
5. Seleccionar la carpeta `suno-extension`
6. La extensión aparecerá como "Son1kVerse AI Music Engine"

### Paso 3: Configurar tokens
1. Hacer clic en el ícono de la extensión
2. Hacer clic en "Check Token" para verificar
3. Si es necesario, hacer clic en "Add Backup Token"
4. Aceptar el disclaimer legal

## 🎵 Uso

### Generar música desde texto seleccionado
1. Seleccionar texto en cualquier página web
2. Hacer clic derecho → "IA genera música a partir de contenido seleccionado"
3. La extensión se abrirá con el texto pre-cargado
4. Ajustar parámetros y hacer clic en "Generate Music"

### Generar música desde la extensión
1. Hacer clic en el ícono de la extensión
2. Escribir letra y estilo musical
3. Ajustar parámetros (duración, instrumental, etc.)
4. Hacer clic en "Generate Music"

## 🔒 Seguridad

- La extensión incluye protección legal automática
- Los términos de uso se muestran al primer uso
- La configuración está protegida contra manipulación
- El sistema de monitoreo verifica la salud de la API

## 🆘 Solución de problemas

### La extensión no aparece
- Verificar que todos los archivos están presentes
- Revisar la consola de Chrome para errores
- Recargar la extensión desde chrome://extensions/

### Error de token
- Verificar que el token es válido
- Usar "Check Token" para diagnosticar
- Agregar token de backup si es necesario

### La música no se genera
- Verificar conexión a internet
- Revisar el estado de salud de la API
- Verificar que todos los campos requeridos están llenos

## 📞 Soporte

Para soporte técnico, revisar la documentación completa en:
- `FUNCIONAL_COMPLETO.md`
- `INSTRUCCIONES.md`
- `PROTECCION_DERECHOS.md`
EOF

show_status 0 "Archivo INSTALACION.md creado"

echo ""
echo "📋 PASO 7: VERIFICAR INTEGRACIÓN CON APPS"
echo "=========================================="

# Verificar que las apps tienen los componentes de integración
APPS_PATH="../../apps"

if [ -d "$APPS_PATH" ]; then
    show_status 0 "Directorio apps encontrado"
    
    # Verificar The Generator
    if [ -d "$APPS_PATH/the-generator" ]; then
        show_status 0 "The Generator encontrado"
        if [ -f "$APPS_PATH/the-generator/src/components/SunoIntegration.tsx" ]; then
            show_status 0 "SunoIntegration.tsx encontrado en The Generator"
        else
            show_status 1 "SunoIntegration.tsx NO encontrado en The Generator"
        fi
    else
        show_status 1 "The Generator NO encontrado"
    fi
    
    # Verificar Ghost Studio
    if [ -d "$APPS_PATH/ghost-studio" ]; then
        show_status 0 "Ghost Studio encontrado"
        if [ -f "$APPS_PATH/ghost-studio/src/components/CoverGenerator.tsx" ]; then
            show_status 0 "CoverGenerator.tsx encontrado en Ghost Studio"
        else
            show_status 1 "CoverGenerator.tsx NO encontrado en Ghost Studio"
        fi
    else
        show_status 1 "Ghost Studio NO encontrado"
    fi
else
    show_status 1 "Directorio apps NO encontrado"
fi

echo ""
echo "🎯 RESUMEN DE PREPARACIÓN"
echo "========================="

# Contar archivos esenciales
ESSENTIAL_COUNT=0
TOTAL_ESSENTIAL=5

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        ESSENTIAL_COUNT=$((ESSENTIAL_COUNT + 1))
    fi
done

# Contar archivos de protección
PROTECTION_COUNT=0
TOTAL_PROTECTION=2

if [ -f "legal-disclaimer.js" ]; then
    PROTECTION_COUNT=$((PROTECTION_COUNT + 1))
fi

if [ -f "config-protection.js" ]; then
    PROTECTION_COUNT=$((PROTECTION_COUNT + 1))
fi

# Contar archivos de configuración
CONFIG_COUNT=0
TOTAL_CONFIG=2

if [ -f "user-config.js" ]; then
    CONFIG_COUNT=$((CONFIG_COUNT + 1))
fi

if [ -f "INSTALACION.md" ]; then
    CONFIG_COUNT=$((CONFIG_COUNT + 1))
fi

echo ""
echo "📊 ESTADÍSTICAS:"
echo "   Archivos esenciales: $ESSENTIAL_COUNT/$TOTAL_ESSENTIAL"
echo "   Archivos de protección: $PROTECTION_COUNT/$TOTAL_PROTECTION"
echo "   Archivos de configuración: $CONFIG_COUNT/$TOTAL_CONFIG"

TOTAL_SCORE=$((ESSENTIAL_COUNT + PROTECTION_COUNT + CONFIG_COUNT))
TOTAL_POSSIBLE=$((TOTAL_ESSENTIAL + TOTAL_PROTECTION + TOTAL_CONFIG))
PERCENTAGE=$((TOTAL_SCORE * 100 / TOTAL_POSSIBLE))

echo "   Puntuación total: $TOTAL_SCORE/$TOTAL_POSSIBLE ($PERCENTAGE%)"

if [ $PERCENTAGE -ge 90 ]; then
    show_status 0 "Extensión lista para instalación (90%+ completado)"
elif [ $PERCENTAGE -ge 70 ]; then
    show_warning "Extensión parcialmente lista (70-89% completado)"
else
    show_status 1 "Extensión NO lista para instalación (<70% completado)"
fi

echo ""
echo "🚀 INSTRUCCIONES DE INSTALACIÓN:"
echo "================================"
echo ""
echo "1. 📝 CONFIGURAR TOKEN:"
echo "   - Editar archivo user-config.js"
echo "   - Reemplazar 'YOUR_TOKEN_HERE' con tu token real"
echo "   - Reemplazar 'YOUR_BACKUP_TOKEN_HERE' con tu token de backup"
echo ""
echo "2. 📦 INSTALAR EN CHROME:"
echo "   - Abrir Chrome → chrome://extensions/"
echo "   - Activar 'Modo desarrollador'"
echo "   - Hacer clic en 'Cargar extensión sin empaquetar'"
echo "   - Seleccionar esta carpeta (suno-extension)"
echo ""
echo "3. ✅ VERIFICAR INSTALACIÓN:"
echo "   - La extensión debe aparecer como 'Son1kVerse AI Music Engine'"
echo "   - Hacer clic en el ícono de la extensión"
echo "   - Verificar que aparece el disclaimer legal"
echo "   - Aceptar términos de uso"
echo ""
echo "4. 🎵 PROBAR FUNCIONALIDAD:"
echo "   - Seleccionar texto en cualquier página web"
echo "   - Hacer clic derecho → 'IA genera música a partir de contenido seleccionado'"
echo "   - Verificar que se abre la extensión con el texto pre-cargado"
echo "   - Probar generación de música"
echo ""

if [ $PERCENTAGE -ge 90 ]; then
    echo -e "${GREEN}🎉 ¡EXTENSIÓN LISTA PARA INSTALACIÓN! 🎉${NC}"
    echo -e "${GREEN}   Todos los archivos están presentes${NC}"
    echo -e "${GREEN}   La configuración está completa${NC}"
    echo -e "${GREEN}   El sistema de protección está activo${NC}"
    echo ""
    echo -e "${BLUE}📋 PRÓXIMOS PASOS:${NC}"
    echo -e "${BLUE}   1. Configurar tu token en user-config.js${NC}"
    echo -e "${BLUE}   2. Instalar la extensión en Chrome${NC}"
    echo -e "${BLUE}   3. Probar la funcionalidad${NC}"
    echo -e "${BLUE}   4. Integrar con The Generator y Ghost Studio${NC}"
else
    echo -e "${YELLOW}⚠️  EXTENSIÓN PARCIALMENTE LISTA${NC}"
    echo -e "${YELLOW}   Algunos archivos faltan o tienen errores${NC}"
    echo -e "${YELLOW}   Revisar los errores mostrados arriba${NC}"
fi

echo ""
echo "🔧 COMANDOS ÚTILES:"
echo "=================="
echo ""
echo "# Verificar estado de la extensión:"
echo "./test-integration.sh"
echo ""
echo "# Probar sistema completo:"
echo "./test-system.sh"
echo ""
echo "# Generar instalación de usuario específico:"
echo "./generate-user-installation.sh usuario token123 10 100 2 5"
echo ""

echo "✨ ¡PREPARACIÓN COMPLETADA! ✨"
echo "============================="
