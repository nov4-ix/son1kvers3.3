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
