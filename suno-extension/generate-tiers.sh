#!/bin/bash

# 🎵 GENERADOR DE USUARIOS POR TIER - SON1KVERSE AI MUSIC ENGINE
# Este script genera usuarios con diferentes tiers y sus respectivos límites

echo "🎵 GENERANDO USUARIOS POR TIER - SON1KVERSE AI MUSIC ENGINE"
echo "=========================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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
    echo -e "${BLUE}ℹ️  $2${NC}"
}

# Función para mostrar tier
show_tier() {
    case $1 in
        "enterprise")
            echo -e "${PURPLE}🏢 ENTERPRISE${NC}"
            ;;
        "premium")
            echo -e "${GREEN}💎 PREMIUM${NC}"
            ;;
        "pro")
            echo -e "${BLUE}⭐ PRO${NC}"
            ;;
        "standard")
            echo -e "${YELLOW}📊 STANDARD${NC}"
            ;;
        "free")
            echo -e "${RED}🆓 FREE${NC}"
            ;;
    esac
}

echo ""
echo "📋 TIERS DISPONIBLES:"
echo "===================="

echo ""
echo "🏢 ENTERPRISE:"
echo "   Modelo: Suno 5.0"
echo "   Duración: 180 segundos (3 minutos)"
echo "   Límite diario: 1000 generaciones"
echo "   Límite mensual: 30,000 generaciones"
echo "   Prioridad: Highest"
echo "   Características: API dedicada, soporte 24/7"

echo ""
echo "💎 PREMIUM:"
echo "   Modelo: Suno 5.0"
echo "   Duración: 180 segundos (3 minutos)"
echo "   Límite diario: 100 generaciones"
echo "   Límite mensual: 3,000 generaciones"
echo "   Prioridad: High"
echo "   Características: Máxima calidad, soporte prioritario"

echo ""
echo "⭐ PRO:"
echo "   Modelo: Suno 5.0"
echo "   Duración: 180 segundos (3 minutos)"
echo "   Límite diario: 50 generaciones"
echo "   Límite mensual: 1,500 generaciones"
echo "   Prioridad: High"
echo "   Características: Alta calidad, soporte estándar"

echo ""
echo "📊 STANDARD:"
echo "   Modelo: Suno 5.0"
echo "   Duración: 180 segundos (3 minutos)"
echo "   Límite diario: 20 generaciones"
echo "   Límite mensual: 600 generaciones"
echo "   Prioridad: Medium"
echo "   Características: Buena calidad, soporte básico"

echo ""
echo "🆓 FREE:"
echo "   Modelo: Suno 3.5"
echo "   Duración: 60 segundos (1 minuto)"
echo "   Límite diario: 3 generaciones"
echo "   Límite mensual: 90 generaciones"
echo "   Prioridad: Low"
echo "   Características: Calidad básica, sin soporte"

echo ""
echo "🎯 GENERAR USUARIOS DE EJEMPLO:"
echo "=============================="

# Crear directorio de usuarios si no existe
mkdir -p users

# Función para generar usuario
generate_user() {
    local userId=$1
    local tier=$2
    local token=$3
    local dailyLimit=$4
    local monthlyLimit=$5
    local concurrentLimit=$6
    local rateLimit=$7
    
    echo ""
    show_tier $tier
    echo "   Usuario: $userId"
    echo "   Token: ${token:0:10}..."
    echo "   Límites: $dailyLimit diario, $monthlyLimit mensual"
    
    # Crear archivo de configuración del usuario
    cat > "users/${userId}_config.js" << EOF
// Configuración de usuario: $userId
const USER_CONFIG = {
  userId: '$userId',
  token: '$token',
  dailyLimit: $dailyLimit,
  monthlyLimit: $monthlyLimit,
  concurrentLimit: $concurrentLimit,
  rateLimit: $rateLimit,
  userType: '$tier',
  sunoModel: 'suno-5.0'
};

const USER_TOKENS = {
  primary: '$token',
  backup: '${token}_backup'
};

// Configuración de branding
const BRANDING = {
  name: 'Son1kVerse AI Music Engine',
  version: '1.0.0',
  description: 'Genera música con IA usando Son1kVerse AI Music Engine - $tier'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, BRANDING };
}
EOF
    
    show_status 0 "Usuario $userId ($tier) creado"
}

# Generar usuarios de ejemplo
echo ""
echo "📝 Generando usuarios de ejemplo..."

# Enterprise
generate_user "enterprise_user_001" "enterprise" "ENT_TOKEN_001" 1000 30000 10 100

# Premium
generate_user "premium_user_001" "premium" "PREM_TOKEN_001" 100 3000 5 50
generate_user "premium_user_002" "premium" "PREM_TOKEN_002" 100 3000 5 50

# Pro
generate_user "pro_user_001" "pro" "PRO_TOKEN_001" 50 1500 3 30
generate_user "pro_user_002" "pro" "PRO_TOKEN_002" 50 1500 3 30
generate_user "pro_user_003" "pro" "PRO_TOKEN_003" 50 1500 3 30

# Standard
generate_user "standard_user_001" "standard" "STD_TOKEN_001" 20 600 2 20
generate_user "standard_user_002" "standard" "STD_TOKEN_002" 20 600 2 20
generate_user "standard_user_003" "standard" "STD_TOKEN_003" 20 600 2 20
generate_user "standard_user_004" "standard" "STD_TOKEN_004" 20 600 2 20

# Free
generate_user "free_user_001" "free" "FREE_TOKEN_001" 3 90 1 5
generate_user "free_user_002" "free" "FREE_TOKEN_002" 3 90 1 5
generate_user "free_user_003" "free" "FREE_TOKEN_003" 3 90 1 5
generate_user "free_user_004" "free" "FREE_TOKEN_004" 3 90 1 5
generate_user "free_user_005" "free" "FREE_TOKEN_005" 3 90 1 5

echo ""
echo "📊 RESUMEN DE USUARIOS GENERADOS:"
echo "================================"

# Contar usuarios por tier
enterprise_count=$(ls users/*enterprise* 2>/dev/null | wc -l)
premium_count=$(ls users/*premium* 2>/dev/null | wc -l)
pro_count=$(ls users/*pro* 2>/dev/null | wc -l)
standard_count=$(ls users/*standard* 2>/dev/null | wc -l)
free_count=$(ls users/*free* 2>/dev/null | wc -l)

echo ""
echo "🏢 Enterprise: $enterprise_count usuarios"
echo "💎 Premium: $premium_count usuarios"
echo "⭐ Pro: $pro_count usuarios"
echo "📊 Standard: $standard_count usuarios"
echo "🆓 Free: $free_count usuarios"
echo ""
echo "📈 Total: $((enterprise_count + premium_count + pro_count + standard_count + free_count)) usuarios"

echo ""
echo "🎯 LÍMITES TOTALES POR TIER:"
echo "============================"

echo ""
echo "🏢 Enterprise:"
echo "   Generaciones diarias: $((enterprise_count * 1000))"
echo "   Generaciones mensuales: $((enterprise_count * 30000))"

echo ""
echo "💎 Premium:"
echo "   Generaciones diarias: $((premium_count * 100))"
echo "   Generaciones mensuales: $((premium_count * 3000))"

echo ""
echo "⭐ Pro:"
echo "   Generaciones diarias: $((pro_count * 50))"
echo "   Generaciones mensuales: $((pro_count * 1500))"

echo ""
echo "📊 Standard:"
echo "   Generaciones diarias: $((standard_count * 20))"
echo "   Generaciones mensuales: $((standard_count * 600))"

echo ""
echo "🆓 Free:"
echo "   Generaciones diarias: $((free_count * 3))"
echo "   Generaciones mensuales: $((free_count * 90))"

echo ""
echo "📊 TOTALES GLOBALES:"
echo "==================="
total_daily=$((enterprise_count * 1000 + premium_count * 100 + pro_count * 50 + standard_count * 20 + free_count * 3))
total_monthly=$((enterprise_count * 30000 + premium_count * 3000 + pro_count * 1500 + standard_count * 600 + free_count * 90))

echo "   Generaciones diarias totales: $total_daily"
echo "   Generaciones mensuales totales: $total_monthly"

echo ""
echo "🚀 INSTRUCCIONES DE USO:"
echo "======================="
echo ""
echo "1. 📁 Los archivos de configuración están en: ./users/"
echo "2. 🔧 Para usar un usuario específico:"
echo "   - Copiar el archivo de configuración a la raíz"
echo "   - Renombrar como user-config.js"
echo "   - Instalar la extensión"
echo ""
echo "3. 🎵 Para generar instalación específica:"
echo "   ./generate-user-installation.sh [userId] [token] [dailyLimit] [monthlyLimit] [concurrentLimit] [rateLimit]"
echo ""
echo "4. 📊 Para monitorear uso:"
echo "   ./user-management.sh list"
echo "   ./user-management.sh report [userId]"
echo ""

echo "✨ ¡USUARIOS GENERADOS EXITOSAMENTE! ✨"
echo "======================================"
