#!/bin/bash

# Super Son1k - Development Script
# Inicia todas las aplicaciones en modo desarrollo

echo "🚀 Iniciando Super Son1k - Monorepo Enterprise"
echo "=============================================="

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Se requiere Node.js 18 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar que Turbo esté instalado
if ! command -v turbo &> /dev/null; then
    echo "📦 Instalando Turbo..."
    npm install -g turbo
fi

echo ""
echo "🎯 Aplicaciones disponibles:"
echo "  • Web Classic (Dashboard)     → http://localhost:3000"
echo "  • Nexus Visual (Inmersivo)     → http://localhost:5173"
echo "  • Ghost Studio (IA Musical)    → http://localhost:3001"
echo "  • Sonic DAW (DAW Profesional)  → http://localhost:3005"
echo "  • Clone Station (Datasets)     → http://localhost:3002"
echo "  • Nova Post Pilot (Social)     → http://localhost:3003"
echo "  • Sanctuary Social (Colaboración) → http://localhost:3004"
echo ""

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [opción]"
    echo ""
    echo "Opciones:"
    echo "  all, --all        Iniciar todas las aplicaciones (por defecto)"
    echo "  web-classic      Solo Web Classic Dashboard"
    echo "  nexus-visual     Solo Nexus Visual Experience"
    echo "  ghost-studio     Solo Ghost Studio (IA Musical)"
    echo "  sonic-daw        Solo Sonic DAW (DAW Profesional)"
    echo "  clone-station    Solo Clone Station"
    echo "  nova-post-pilot  Solo Nova Post Pilot"
    echo "  sanctuary-social Solo Sanctuary Social"
    echo "  help, --help     Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0                    # Iniciar todas las apps"
    echo "  $0 web-classic        # Solo dashboard"
    echo "  $0 ghost-studio       # Solo IA musical"
    echo "  $0 sonic-daw          # Solo DAW profesional"
}

# Procesar argumentos
case "${1:-all}" in
    "all"|"--all")
        echo "🔥 Iniciando todas las aplicaciones..."
        echo "   Presiona Ctrl+C para detener todas"
        echo ""
        turbo run dev
        ;;
    "web-classic")
        echo "🏠 Iniciando Web Classic Dashboard..."
        turbo run dev --filter=web-classic
        ;;
    "nexus-visual")
        echo "🌀 Iniciando Nexus Visual Experience..."
        turbo run dev --filter=nexus-visual
        ;;
    "ghost-studio")
        echo "🎵 Iniciando Ghost Studio (IA Musical)..."
        turbo run dev --filter=ghost-studio
        ;;
    "sonic-daw")
        echo "🎛️ Iniciando Sonic DAW (DAW Profesional)..."
        turbo run dev --filter=sonic-daw
        ;;
    "clone-station")
        echo "🎭 Iniciando Clone Station..."
        turbo run dev --filter=clone-station
        ;;
    "nova-post-pilot")
        echo "🚀 Iniciando Nova Post Pilot..."
        turbo run dev --filter=nova-post-pilot
        ;;
    "sanctuary-social")
        echo "🏛️ Iniciando Sanctuary Social..."
        turbo run dev --filter=sanctuary-social
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        echo "❌ Opción desconocida: $1"
        echo ""
        show_help
        exit 1
        ;;
esac