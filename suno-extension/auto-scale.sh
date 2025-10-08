#!/bin/bash

# 🚀 SISTEMA DE ESCALADO AUTOMÁTICO
# Maneja automáticamente la escalabilidad más allá de 1000 usuarios

# Configuración
MAX_USERS_PER_INSTANCE=1000
TARGET_UTILIZATION=80
MIN_INSTANCES=1
MAX_INSTANCES=10
CHECK_INTERVAL=300 # 5 minutos

# Directorio de instancias
INSTANCES_DIR="instances"
QUEUE_DIR="queues"

# Crear directorios
mkdir -p "$INSTANCES_DIR" "$QUEUE_DIR"

# Función para obtener usuarios actuales
getCurrentUsers() {
  if [ -f "users.db" ]; then
    wc -l < "users.db"
  else
    echo "0"
  fi
}

# Función para obtener instancias actuales
getCurrentInstances() {
  ls -1 "$INSTANCES_DIR" 2>/dev/null | wc -l
}

# Función para obtener capacidad total
getTotalCapacity() {
  local instances=$(getCurrentInstances)
  echo $((instances * MAX_USERS_PER_INSTANCE))
}

# Función para calcular utilización
calculateUtilization() {
  local users=$(getCurrentUsers)
  local capacity=$(getTotalCapacity)
  
  if [ $capacity -eq 0 ]; then
    echo "0"
  else
    echo $((users * 100 / capacity))
  fi
}

# Función para crear nueva instancia
createNewInstance() {
  local instance_id="instance_$(date +%s)"
  local instance_dir="$INSTANCES_DIR/$instance_id"
  
  mkdir -p "$instance_dir"
  
  # Crear configuración de la instancia
  cat > "$instance_dir/config.json" << EOF
{
  "id": "$instance_id",
  "capacity": $MAX_USERS_PER_INSTANCE,
  "current_users": 0,
  "status": "active",
  "created_at": "$(date -Iseconds)",
  "endpoint": "https://api.suno.com/v1/instance/$instance_id"
}
EOF
  
  # Crear script de la instancia
  cat > "$instance_dir/start.sh" << EOF
#!/bin/bash
# Script de inicio para instancia $instance_id

echo "🚀 Iniciando instancia $instance_id"
echo "📊 Capacidad: $MAX_USERS_PER_INSTANCE usuarios"
echo "🕐 Iniciado: $(date)"

# Simular procesamiento de usuarios
while true; do
  # Procesar usuarios asignados a esta instancia
  processAssignedUsers "$instance_id"
  sleep 60
done
EOF
  
  chmod +x "$instance_dir/start.sh"
  
  echo "✅ Nueva instancia creada: $instance_id"
  echo "$instance_id" >> "$INSTANCES_DIR/active_instances.txt"
  
  return 0
}

# Función para eliminar instancia
removeInstance() {
  local instance_id="$1"
  local instance_dir="$INSTANCES_DIR/$instance_id"
  
  if [ -d "$instance_dir" ]; then
    # Migrar usuarios a otras instancias
    migrateUsersFromInstance "$instance_id"
    
    # Eliminar directorio
    rm -rf "$instance_dir"
    
    # Remover de lista activa
    sed -i "/^$instance_id$/d" "$INSTANCES_DIR/active_instances.txt"
    
    echo "✅ Instancia eliminada: $instance_id"
  fi
}

# Función para migrar usuarios
migrateUsersFromInstance() {
  local source_instance="$1"
  local target_instances=($(getActiveInstances | grep -v "$source_instance"))
  
  if [ ${#target_instances[@]} -eq 0 ]; then
    echo "⚠️ No hay instancias disponibles para migración"
    return 1
  fi
  
  # Migrar usuarios a instancias disponibles
  local users_to_migrate=$(getUsersFromInstance "$source_instance")
  
  for user in $users_to_migrate; do
    local target_instance="${target_instances[$RANDOM % ${#target_instances[@]}]}"
    assignUserToInstance "$user" "$target_instance"
  done
  
  echo "✅ Usuarios migrados desde $source_instance"
}

# Función para obtener instancias activas
getActiveInstances() {
  if [ -f "$INSTANCES_DIR/active_instances.txt" ]; then
    cat "$INSTANCES_DIR/active_instances.txt"
  else
    echo ""
  fi
}

# Función para obtener usuarios de una instancia
getUsersFromInstance() {
  local instance_id="$1"
  # Implementar lógica para obtener usuarios de una instancia específica
  echo ""
}

# Función para asignar usuario a instancia
assignUserToInstance() {
  local user_id="$1"
  local instance_id="$2"
  
  # Implementar lógica para asignar usuario a instancia
  echo "👤 Usuario $user_id asignado a instancia $instance_id"
}

# Función para escalar hacia arriba
scaleUp() {
  local current_instances=$(getCurrentInstances)
  
  if [ $current_instances -lt $MAX_INSTANCES ]; then
    echo "📈 Escalando hacia arriba..."
    createNewInstance
    echo "✅ Escalado completado. Instancias: $((current_instances + 1))"
  else
    echo "⚠️ Máximo de instancias alcanzado: $MAX_INSTANCES"
  fi
}

# Función para escalar hacia abajo
scaleDown() {
  local current_instances=$(getCurrentInstances)
  
  if [ $current_instances -gt $MIN_INSTANCES ]; then
    echo "📉 Escalando hacia abajo..."
    
    # Encontrar instancia con menor carga
    local least_loaded_instance=$(findLeastLoadedInstance)
    
    if [ -n "$least_loaded_instance" ]; then
      removeInstance "$least_loaded_instance"
      echo "✅ Escalado completado. Instancias: $((current_instances - 1))"
    fi
  else
    echo "⚠️ Mínimo de instancias alcanzado: $MIN_INSTANCES"
  fi
}

# Función para encontrar instancia con menor carga
findLeastLoadedInstance() {
  local least_loaded=""
  local min_users=999999
  
  for instance in $(getActiveInstances); do
    local users=$(getUsersFromInstance "$instance")
    if [ $users -lt $min_users ]; then
      min_users=$users
      least_loaded=$instance
    fi
  done
  
  echo "$least_loaded"
}

# Función para manejar colas
manageQueues() {
  local total_users=$(getCurrentUsers)
  local total_capacity=$(getTotalCapacity)
  
  if [ $total_users -gt $total_capacity ]; then
    local overflow_users=$((total_users - total_capacity))
    echo "🚨 Overflow detectado: $overflow_users usuarios en cola"
    
    # Agregar usuarios a cola de overflow
    addUsersToOverflowQueue "$overflow_users"
  fi
}

# Función para agregar usuarios a cola de overflow
addUsersToOverflowQueue() {
  local overflow_count="$1"
  
  for i in $(seq 1 $overflow_count); do
    local user_id="overflow_user_$(date +%s)_$i"
    echo "$user_id,$(date +%s)" >> "$QUEUE_DIR/overflow.queue"
  done
  
  echo "📋 $overflow_count usuarios agregados a cola de overflow"
}

# Función para procesar colas
processQueues() {
  # Procesar cola de overflow
  if [ -f "$QUEUE_DIR/overflow.queue" ] && [ -s "$QUEUE_DIR/overflow.queue" ]; then
    local available_capacity=$(getAvailableCapacity)
    
    if [ $available_capacity -gt 0 ]; then
      local users_to_process=$(head -n $available_capacity "$QUEUE_DIR/overflow.queue")
      
      for user_line in $users_to_process; do
        local user_id=$(echo "$user_line" | cut -d',' -f1)
        local instance_id=$(findBestInstance)
        
        if [ -n "$instance_id" ]; then
          assignUserToInstance "$user_id" "$instance_id"
          sed -i "/^$user_line$/d" "$QUEUE_DIR/overflow.queue"
        fi
      done
    fi
  fi
}

# Función para obtener capacidad disponible
getAvailableCapacity() {
  local total_capacity=$(getTotalCapacity)
  local current_users=$(getCurrentUsers)
  echo $((total_capacity - current_users))
}

# Función para encontrar mejor instancia
findBestInstance() {
  local best_instance=""
  local min_users=999999
  
  for instance in $(getActiveInstances); do
    local users=$(getUsersFromInstance "$instance")
    if [ $users -lt $min_users ]; then
      min_users=$users
      best_instance=$instance
    fi
  done
  
  echo "$best_instance"
}

# Función para mostrar estado del sistema
showSystemStatus() {
  local users=$(getCurrentUsers)
  local instances=$(getCurrentInstances)
  local capacity=$(getTotalCapacity)
  local utilization=$(calculateUtilization)
  
  echo "📊 ESTADO DEL SISTEMA - $(date)"
  echo "=================================="
  echo "👥 Usuarios actuales: $users"
  echo "🏗️ Instancias activas: $instances"
  echo "📈 Capacidad total: $capacity"
  echo "📊 Utilización: $utilization%"
  echo ""
  
  if [ -f "$QUEUE_DIR/overflow.queue" ]; then
    local queue_size=$(wc -l < "$QUEUE_DIR/overflow.queue")
    echo "🚨 Usuarios en cola: $queue_size"
  else
    echo "✅ Sin usuarios en cola"
  fi
  
  echo ""
  echo "🏗️ INSTANCIAS ACTIVAS:"
  for instance in $(getActiveInstances); do
    local users_in_instance=$(getUsersFromInstance "$instance")
    echo "  - $instance: $users_in_instance/$MAX_USERS_PER_INSTANCE usuarios"
  done
}

# Función principal de monitoreo
monitorSystem() {
  while true; do
    local utilization=$(calculateUtilization)
    
    echo "🔍 Monitoreando sistema... Utilización: $utilization%"
    
    # Escalar hacia arriba si es necesario
    if [ $utilization -gt $TARGET_UTILIZATION ]; then
      echo "⚠️ Alta utilización detectada: $utilization%"
      scaleUp
    fi
    
    # Escalar hacia abajo si es posible
    if [ $utilization -lt 50 ] && [ $(getCurrentInstances) -gt $MIN_INSTANCES ]; then
      echo "💡 Baja utilización detectada: $utilization%"
      scaleDown
    fi
    
    # Manejar colas
    manageQueues
    processQueues
    
    # Mostrar estado
    showSystemStatus
    
    echo "⏰ Esperando $CHECK_INTERVAL segundos..."
    sleep $CHECK_INTERVAL
  done
}

# Función para crear instancia inicial
createInitialInstance() {
  if [ $(getCurrentInstances) -eq 0 ]; then
    echo "🚀 Creando instancia inicial..."
    createNewInstance
  fi
}

# Función de ayuda
showHelp() {
  echo "🚀 Sistema de Escalado Automático - Suno Extension"
  echo ""
  echo "Uso: $0 [comando]"
  echo ""
  echo "Comandos:"
  echo "  start          Iniciar monitoreo automático"
  echo "  status         Mostrar estado del sistema"
  echo "  scale-up       Escalar hacia arriba manualmente"
  echo "  scale-down     Escalar hacia abajo manualmente"
  echo "  create-instance Crear nueva instancia"
  echo "  remove-instance <id> Eliminar instancia específica"
  echo "  help           Mostrar esta ayuda"
  echo ""
  echo "Configuración:"
  echo "  MAX_USERS_PER_INSTANCE: $MAX_USERS_PER_INSTANCE"
  echo "  TARGET_UTILIZATION: $TARGET_UTILIZATION%"
  echo "  MIN_INSTANCES: $MIN_INSTANCES"
  echo "  MAX_INSTANCES: $MAX_INSTANCES"
  echo "  CHECK_INTERVAL: $CHECK_INTERVAL segundos"
}

# Función principal
main() {
  case "$1" in
    "start")
      createInitialInstance
      monitorSystem
      ;;
    "status")
      showSystemStatus
      ;;
    "scale-up")
      scaleUp
      ;;
    "scale-down")
      scaleDown
      ;;
    "create-instance")
      createNewInstance
      ;;
    "remove-instance")
      if [ -n "$2" ]; then
        removeInstance "$2"
      else
        echo "❌ Uso: $0 remove-instance <instance_id>"
      fi
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
