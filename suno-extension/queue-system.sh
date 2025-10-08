#!/bin/bash

# 🎯 SISTEMA DE COLAS INTELIGENTE
# Maneja usuarios que exceden la capacidad del sistema

# Configuración
QUEUE_DIR="queues"
PRIORITY_LEVELS=("premium" "standard" "free" "overflow")
MAX_QUEUE_SIZE=5000
PROCESS_INTERVAL=60 # segundos

# Crear directorio de colas
mkdir -p "$QUEUE_DIR"

# Función para crear colas
createQueues() {
  echo "🎯 Creando sistema de colas..."
  
  for level in "${PRIORITY_LEVELS[@]}"; do
    touch "$QUEUE_DIR/$level.queue"
    echo "✅ Cola creada: $level"
  done
  
  # Crear archivo de configuración
  cat > "$QUEUE_DIR/config.json" << EOF
{
  "priority_levels": ["premium", "standard", "free", "overflow"],
  "max_queue_size": $MAX_QUEUE_SIZE,
  "process_interval": $PROCESS_INTERVAL,
  "created_at": "$(date -Iseconds)"
}
EOF
}

# Función para agregar usuario a cola
addToQueue() {
  local user_id="$1"
  local priority="$2"
  local queue_file="$QUEUE_DIR/$priority.queue"
  
  # Verificar que la prioridad sea válida
  if [[ ! " ${PRIORITY_LEVELS[@]} " =~ " ${priority} " ]]; then
    echo "❌ Prioridad inválida: $priority"
    return 1
  fi
  
  # Verificar tamaño de cola
  local queue_size=$(wc -l < "$queue_file" 2>/dev/null || echo "0")
  if [ $queue_size -ge $MAX_QUEUE_SIZE ]; then
    echo "❌ Cola $priority está llena"
    return 1
  fi
  
  # Agregar usuario a la cola
  local timestamp=$(date +%s)
  local position=$((queue_size + 1))
  local estimated_wait=$(calculateWaitTime "$priority" "$position")
  
  echo "$user_id,$timestamp,$position,$estimated_wait" >> "$queue_file"
  
  echo "✅ Usuario $user_id agregado a cola $priority (posición: $position, espera estimada: $estimated_wait minutos)"
  
  # Notificar al usuario
  notifyUser "$user_id" "$priority" "$position" "$estimated_wait"
}

# Función para calcular tiempo de espera
calculateWaitTime() {
  local priority="$1"
  local position="$2"
  
  # Tiempo promedio de generación por prioridad
  case "$priority" in
    "premium")
      local avg_time=2 # 2 minutos
      ;;
    "standard")
      local avg_time=4 # 4 minutos
      ;;
    "free")
      local avg_time=6 # 6 minutos
      ;;
    "overflow")
      local avg_time=10 # 10 minutos
      ;;
  esac
  
  # Calcular tiempo de espera basado en posición y tiempo promedio
  local wait_time=$((position * avg_time))
  echo "$wait_time"
}

# Función para notificar al usuario
notifyUser() {
  local user_id="$1"
  local priority="$2"
  local position="$3"
  local estimated_wait="$4"
  
  local message=""
  case "$priority" in
    "premium")
      message="🎵 Usuario Premium: Estás en cola (posición: $position, espera: $estimated_wait minutos)"
      ;;
    "standard")
      message="🎵 Usuario Estándar: Estás en cola (posición: $position, espera: $estimated_wait minutos)"
      ;;
    "free")
      message="🎵 Usuario Gratuito: Estás en cola (posición: $position, espera: $estimated_wait minutos)"
      ;;
    "overflow")
      message="🚨 Sistema en alta demanda: Estás en cola de espera (posición: $position, espera: $estimated_wait minutos)"
      ;;
  esac
  
  echo "📱 Notificación para $user_id: $message"
  
  # Aquí se implementaría la notificación real (email, push, etc.)
  # sendNotification "$user_id" "$message"
}

# Función para procesar colas
processQueues() {
  echo "🔄 Procesando colas..."
  
  # Procesar por prioridad
  for level in "${PRIORITY_LEVELS[@]}"; do
    local queue_file="$QUEUE_DIR/$level.queue"
    
    if [ -f "$queue_file" ] && [ -s "$queue_file" ]; then
      local queue_size=$(wc -l < "$queue_file")
      echo "📋 Procesando cola $level ($queue_size usuarios)"
      
      # Procesar hasta 10 usuarios por ciclo
      local processed=0
      while [ $processed -lt 10 ] && [ -s "$queue_file" ]; do
        local user_line=$(head -n1 "$queue_file")
        if [ -n "$user_line" ]; then
          local user_id=$(echo "$user_line" | cut -d',' -f1)
          local timestamp=$(echo "$user_line" | cut -d',' -f2)
          local position=$(echo "$user_line" | cut -d',' -f3)
          
          # Verificar si hay capacidad disponible
          if hasCapacity; then
            # Procesar usuario
            processUser "$user_id" "$level"
            
            # Remover de la cola
            sed -i '1d' "$queue_file"
            
            # Notificar procesamiento
            notifyProcessing "$user_id" "$level"
            
            processed=$((processed + 1))
          else
            # No hay capacidad, salir del bucle
            break
          fi
        fi
      done
      
      echo "✅ Procesados $processed usuarios de cola $level"
    fi
  done
}

# Función para verificar capacidad
hasCapacity() {
  # Implementar lógica para verificar si hay capacidad disponible
  # Por ahora, simular capacidad disponible
  local random=$((RANDOM % 100))
  if [ $random -lt 70 ]; then
    return 0 # Hay capacidad
  else
    return 1 # No hay capacidad
  fi
}

# Función para procesar usuario
processUser() {
  local user_id="$1"
  local priority="$2"
  
  echo "🎵 Procesando usuario $user_id (prioridad: $priority)"
  
  # Simular procesamiento
  sleep 1
  
  echo "✅ Usuario $user_id procesado exitosamente"
}

# Función para notificar procesamiento
notifyProcessing() {
  local user_id="$1"
  local priority="$2"
  
  local message="🎉 Tu turno ha llegado! Procesando tu solicitud..."
  echo "📱 Notificación para $user_id: $message"
}

# Función para mostrar estado de colas
showQueueStatus() {
  echo "📊 ESTADO DE COLAS - $(date)"
  echo "=================================="
  
  local total_users=0
  
  for level in "${PRIORITY_LEVELS[@]}"; do
    local queue_file="$QUEUE_DIR/$level.queue"
    local queue_size=0
    
    if [ -f "$queue_file" ]; then
      queue_size=$(wc -l < "$queue_file")
    fi
    
    total_users=$((total_users + queue_size))
    
    echo "📋 Cola $level: $queue_size usuarios"
    
    # Mostrar primeros 5 usuarios de cada cola
    if [ $queue_size -gt 0 ]; then
      echo "  Primeros usuarios:"
      head -n5 "$queue_file" | while read line; do
        local user_id=$(echo "$line" | cut -d',' -f1)
        local position=$(echo "$line" | cut -d',' -f3)
        local wait_time=$(echo "$line" | cut -d',' -f4)
        echo "    - $user_id (posición: $position, espera: $wait_time min)"
      done
    fi
    echo ""
  done
  
  echo "📈 Total de usuarios en cola: $total_users"
  echo "📊 Capacidad máxima de colas: $MAX_QUEUE_SIZE"
}

# Función para limpiar colas
cleanupQueues() {
  echo "🧹 Limpiando colas..."
  
  for level in "${PRIORITY_LEVELS[@]}"; do
    local queue_file="$QUEUE_DIR/$level.queue"
    
    if [ -f "$queue_file" ]; then
      # Remover usuarios que han estado en cola por más de 24 horas
      local cutoff_time=$(date -v-24H +%s)
      
      while IFS=',' read -r user_id timestamp position wait_time; do
        if [ "$timestamp" -lt "$cutoff_time" ]; then
          echo "🗑️ Removiendo usuario expirado: $user_id"
        else
          echo "$user_id,$timestamp,$position,$wait_time" >> "$queue_file.tmp"
        fi
      done < "$queue_file"
      
      mv "$queue_file.tmp" "$queue_file" 2>/dev/null
    fi
  done
  
  echo "✅ Limpieza completada"
}

# Función para generar reporte de colas
generateQueueReport() {
  local report_file="queue_report_$(date +%Y%m%d_%H%M%S).txt"
  
  echo "📊 Generando reporte de colas: $report_file"
  
  {
    echo "🎯 REPORTE DE COLAS - $(date)"
    echo "=================================="
    echo ""
    
    for level in "${PRIORITY_LEVELS[@]}"; do
      local queue_file="$QUEUE_DIR/$level.queue"
      local queue_size=0
      
      if [ -f "$queue_file" ]; then
        queue_size=$(wc -l < "$queue_file")
      fi
      
      echo "📋 Cola $level: $queue_size usuarios"
      
      if [ $queue_size -gt 0 ]; then
        echo "  Detalles:"
        while IFS=',' read -r user_id timestamp position wait_time; do
          local added_time=$(date -d "@$timestamp" "+%Y-%m-%d %H:%M:%S")
          echo "    - $user_id (agregado: $added_time, posición: $position, espera: $wait_time min)"
        done < "$queue_file"
      fi
      echo ""
    done
    
  } > "$report_file"
  
  echo "✅ Reporte generado: $report_file"
}

# Función para monitoreo continuo
monitorQueues() {
  echo "🔍 Iniciando monitoreo de colas..."
  
  while true; do
    processQueues
    cleanupQueues
    showQueueStatus
    echo "⏰ Esperando $PROCESS_INTERVAL segundos..."
    sleep $PROCESS_INTERVAL
  done
}

# Función de ayuda
showHelp() {
  echo "🎯 Sistema de Colas Inteligente - Suno Extension"
  echo ""
  echo "Uso: $0 [comando] [opciones]"
  echo ""
  echo "Comandos:"
  echo "  create          Crear sistema de colas"
  echo "  add <user_id> <priority> Agregar usuario a cola"
  echo "  process         Procesar colas manualmente"
  echo "  status          Mostrar estado de colas"
  echo "  cleanup         Limpiar colas expiradas"
  echo "  report          Generar reporte de colas"
  echo "  monitor         Monitoreo continuo"
  echo "  help            Mostrar esta ayuda"
  echo ""
  echo "Prioridades disponibles:"
  echo "  premium         Máxima prioridad"
  echo "  standard        Prioridad media"
  echo "  free            Prioridad baja"
  echo "  overflow        Prioridad mínima"
  echo ""
  echo "Configuración:"
  echo "  MAX_QUEUE_SIZE: $MAX_QUEUE_SIZE"
  echo "  PROCESS_INTERVAL: $PROCESS_INTERVAL segundos"
}

# Función principal
main() {
  case "$1" in
    "create")
      createQueues
      ;;
    "add")
      if [ $# -ne 3 ]; then
        echo "❌ Uso: $0 add <user_id> <priority>"
        exit 1
      fi
      addToQueue "$2" "$3"
      ;;
    "process")
      processQueues
      ;;
    "status")
      showQueueStatus
      ;;
    "cleanup")
      cleanupQueues
      ;;
    "report")
      generateQueueReport
      ;;
    "monitor")
      monitorQueues
      ;;
    "help"|"--help"|"-h")
      showHelp
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
