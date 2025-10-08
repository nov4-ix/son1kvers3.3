#!/bin/bash

# 🔐 SCRIPT DE PROTECCIÓN DE CONFIGURACIÓN
# Protege la configuración contra manipulación

echo "🔒 Protegiendo configuración de usuario: $USER_ID"

# Hacer archivos de solo lectura
chmod 444 user-config-protected.js
chmod 444 manifest.json

# Crear checksum para verificar integridad
md5sum user-config-protected.js > config.checksum
md5sum manifest.json >> config.checksum

echo "✅ Configuración protegida exitosamente"
echo "🔒 Archivos marcados como solo lectura"
echo "📊 Checksum creado para verificación de integridad"
