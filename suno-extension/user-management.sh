#!/bin/bash

# 🏢 SISTEMA DE GESTIÓN DE USUARIOS Y DISTRIBUCIÓN MASIVA
# Gestiona múltiples usuarios y evita saturación

# Configuración global
MAX_USERS=1000
MAX_DAILY_GLOBAL=50000
MAX_HOURLY_GLOBAL=5000
NEW_USERS_PER_DAY=50

# Directorio de usuarios
USERS_DIR="distributions"
USERS_DB="users.db"

# Crear directorio si no existe
mkdir -p "$USERS_DIR"

# Función para crear usuario
create_user() {
  local user_id="$1"
  local token="$2"
  local daily_limit="$3"
  local monthly_limit="$4"
  local concurrent_limit="$5"
  
  echo "👤 Creando usuario: $user_id"
  
  # Verificar límites globales
  local current_users=$(count_users)
  if [ "$current_users" -ge "$MAX_USERS" ]; then
    echo "❌ Límite máximo de usuarios alcanzado: $MAX_USERS"
    return 1
  fi
  
  # Verificar límites diarios
  local daily_usage=$(get_daily_usage)
  local new_daily_usage=$((daily_usage + daily_limit))
  if [ "$new_daily_usage" -gt "$MAX_DAILY_GLOBAL" ]; then
    echo "❌ Límite diario global excedido: $new_daily_usage > $MAX_DAILY_GLOBAL"
    return 1
  fi
  
  # Generar instalación para el usuario
  ./generate-user-installation.sh "$user_id" "$token" "$daily_limit" "$monthly_limit" "$concurrent_limit"
  
  # Registrar usuario en la base de datos
  echo "$user_id,$token,$daily_limit,$monthly_limit,$concurrent_limit,$(date)" >> "$USERS_DB"
  
  echo "✅ Usuario $user_id creado exitosamente"
}

# Función para contar usuarios
count_users() {
  if [ -f "$USERS_DB" ]; then
    wc -l < "$USERS_DB"
  else
    echo "0"
  fi
}

# Función para obtener uso diario
get_daily_usage() {
  if [ -f "$USERS_DB" ]; then
    awk -F',' '{sum += $3} END {print sum+0}' "$USERS_DB"
  else
    echo "0"
  fi
}

# Función para listar usuarios
list_users() {
  echo "📊 Lista de usuarios:"
  echo "ID | Token | Límite Diario | Límite Mensual | Concurrente | Fecha"
  echo "---|-------|---------------|----------------|-------------|------"
  
  if [ -f "$USERS_DB" ]; then
    while IFS=',' read -r user_id token daily monthly concurrent date; do
      echo "$user_id | ${token:0:10}... | $daily | $monthly | $concurrent | $date"
    done < "$USERS_DB"
  else
    echo "No hay usuarios registrados"
  fi
  
  echo ""
  echo "📈 Estadísticas:"
  echo "  Total usuarios: $(count_users)"
  echo "  Uso diario total: $(get_daily_usage)"
  echo "  Límite diario global: $MAX_DAILY_GLOBAL"
}

# Función para monitorear usuarios
monitor_users() {
  echo "🔍 Monitoreando todos los usuarios..."
  
  if [ -f "$USERS_DB" ]; then
    while IFS=',' read -r user_id token daily monthly concurrent date; do
      echo "👤 Monitoreando usuario: $user_id"
      
      # Verificar si el directorio del usuario existe
      if [ -d "$USERS_DIR/$user_id" ]; then
        # Ejecutar monitor del usuario
        if [ -f "$USERS_DIR/$user_id/monitor.sh" ]; then
          "$USERS_DIR/$user_id/monitor.sh"
        else
          echo "  ⚠️ Monitor no encontrado para $user_id"
        fi
      else
        echo "  ❌ Directorio no encontrado para $user_id"
      fi
      
      echo ""
    done < "$USERS_DB"
  else
    echo "No hay usuarios para monitorear"
  fi
}

# Función para generar reporte
generate_report() {
  local report_file="report_$(date +%Y%m%d_%H%M%S).txt"
  
  echo "📊 Generando reporte: $report_file"
  
  {
    echo "🎵 REPORTE DE USUARIOS - $(date)"
    echo "=================================="
    echo ""
    echo "📈 Estadísticas Generales:"
    echo "  Total usuarios: $(count_users)"
    echo "  Uso diario total: $(get_daily_usage)"
    echo "  Límite diario global: $MAX_DAILY_GLOBAL"
    echo "  Límite máximo usuarios: $MAX_USERS"
    echo ""
    echo "👥 Lista de Usuarios:"
    echo "ID | Token | Límite Diario | Límite Mensual | Concurrente | Fecha"
    echo "---|-------|---------------|----------------|-------------|------"
    
    if [ -f "$USERS_DB" ]; then
      while IFS=',' read -r user_id token daily monthly concurrent date; do
        echo "$user_id | ${token:0:10}... | $daily | $monthly | $concurrent | $date"
      done < "$USERS_DB"
    fi
    
    echo ""
    echo "🔍 Estado de Instalaciones:"
    
    if [ -f "$USERS_DB" ]; then
      while IFS=',' read -r user_id token daily monthly concurrent date; do
        if [ -d "$USERS_DIR/$user_id" ]; then
          echo "  ✅ $user_id - Instalación completa"
        else
          echo "  ❌ $user_id - Instalación incompleta"
        fi
      done < "$USERS_DB"
    fi
    
  } > "$report_file"
  
  echo "✅ Reporte generado: $report_file"
}

# Función para distribución masiva
bulk_distribute() {
  local users_file="$1"
  
  if [ ! -f "$users_file" ]; then
    echo "❌ Archivo de usuarios no encontrado: $users_file"
    echo "Formato esperado: user_id,token,daily_limit,monthly_limit,concurrent_limit"
    return 1
  fi
  
  echo "🚀 Iniciando distribución masiva desde: $users_file"
  
  local count=0
  local success=0
  local failed=0
  
  while IFS=',' read -r user_id token daily monthly concurrent; do
    count=$((count + 1))
    echo "📦 Procesando usuario $count: $user_id"
    
    if create_user "$user_id" "$token" "$daily" "$monthly" "$concurrent"; then
      success=$((success + 1))
    else
      failed=$((failed + 1))
    fi
    
    echo ""
  done < "$users_file"
  
  echo "📊 Distribución masiva completada:"
  echo "  Total procesados: $count"
  echo "  Exitosos: $success"
  echo "  Fallidos: $failed"
}

# Función para limpiar usuarios inactivos
cleanup_inactive() {
  local days_inactive="$1"
  
  if [ -z "$days_inactive" ]; then
    days_inactive=30
  fi
  
  echo "🧹 Limpiando usuarios inactivos (más de $days_inactive días)"
  
  local cutoff_date=$(date -d "$days_inactive days ago" +%Y-%m-%d)
  local temp_file=$(mktemp)
  
  if [ -f "$USERS_DB" ]; then
    while IFS=',' read -r user_id token daily monthly concurrent date; do
      if [ "$date" \> "$cutoff_date" ]; then
        echo "$user_id,$token,$daily,$monthly,$concurrent,$date" >> "$temp_file"
      else
        echo "🗑️ Eliminando usuario inactivo: $user_id (última actividad: $date)"
        rm -rf "$USERS_DIR/$user_id"
      fi
    done < "$USERS_DB"
    
    mv "$temp_file" "$USERS_DB"
  fi
  
  echo "✅ Limpieza completada"
}

# Función de ayuda
show_help() {
  echo "🏢 Sistema de Gestión de Usuarios - Suno Extension"
  echo ""
  echo "Uso: $0 [comando] [opciones]"
  echo ""
  echo "Comandos:"
  echo "  create <user_id> <token> <daily_limit> <monthly_limit> <concurrent_limit>"
  echo "    Crear un nuevo usuario"
  echo ""
  echo "  list"
  echo "    Listar todos los usuarios"
  echo ""
  echo "  monitor"
  echo "    Monitorear todos los usuarios"
  echo ""
  echo "  report"
  echo "    Generar reporte de usuarios"
  echo ""
  echo "  bulk <archivo_usuarios>"
  echo "    Distribución masiva desde archivo CSV"
  echo ""
  echo "  cleanup [días]"
  echo "    Limpiar usuarios inactivos (default: 30 días)"
  echo ""
  echo "  help"
  echo "    Mostrar esta ayuda"
  echo ""
  echo "Ejemplos:"
  echo "  $0 create user123 token456 50 1000 3"
  echo "  $0 list"
  echo "  $0 monitor"
  echo "  $0 bulk users.csv"
  echo "  $0 cleanup 30"
}

# Función principal
main() {
  case "$1" in
    "create")
      if [ $# -ne 6 ]; then
        echo "❌ Uso: $0 create <user_id> <token> <daily_limit> <monthly_limit> <concurrent_limit>"
        exit 1
      fi
      create_user "$2" "$3" "$4" "$5" "$6"
      ;;
    "list")
      list_users
      ;;
    "monitor")
      monitor_users
      ;;
    "report")
      generate_report
      ;;
    "bulk")
      if [ $# -ne 2 ]; then
        echo "❌ Uso: $0 bulk <archivo_usuarios>"
        exit 1
      fi
      bulk_distribute "$2"
      ;;
    "cleanup")
      cleanup_inactive "$2"
      ;;
    "help"|"--help"|"-h")
      show_help
      ;;
    *)
      echo "❌ Comando no reconocido: $1"
      echo "Usa '$0 help' para ver los comandos disponibles"
      exit 1
      ;;
  esac
}

# Ejecutar función principal
main "$@"
