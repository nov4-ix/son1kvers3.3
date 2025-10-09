# 🔍 DEBUGGING URGENTE - EXTENSIÓN SON1KVERSE

## 🚨 **INSTRUCCIONES DE DEBUGGING**

### **PASO 1: Abrir Developer Tools**
1. Abre la extensión
2. Haz clic derecho en la extensión → "Inspeccionar"
3. Ve a la pestaña **Console**
4. **NO CIERRES** la consola durante todo el proceso

### **PASO 2: Generar Música**
1. Llena los campos requeridos:
   - Título: "Test Song"
   - Estilo: "pop"
   - Letra: "Esta es una canción de prueba"
2. Haz clic en **"Generate Music"**

### **PASO 3: Monitorear Logs**
En la consola deberías ver:

#### **🚀 GENERATE DEBUG**
```
🚀 GENERATE DEBUG - Full Response: {objeto}
✅ GENERATE SUCCESS - Response OK
📊 GENERATE DEBUG - Response Data: {JSON completo}
🎯 GENERATE DEBUG - TaskId Found: [TASK_ID]
🔄 Starting polling for taskId: [TASK_ID]
```

#### **🔍 POLLING DEBUG**
```
🔍 POLLING DEBUG - TaskId: [TASK_ID]
🔍 POLLING DEBUG - Token: [PRIMEROS_20_CARACTERES]...
🔍 POLLING DEBUG - URL: https://usa.imgkits.com/node-api/suno/get?task_id=[TASK_ID]
🔍 POLLING DEBUG - Response Status: 200
🔍 POLLING DEBUG - Full Response: {JSON completo}
```

### **PASO 4: Identificar el Problema**

#### **✅ SI TODO FUNCIONA:**
- Verás `✅ STATUS: COMPLETED detected`
- Verás `🎵 AUDIO URL FOUND: [URL]`
- La barra de carga desaparecerá
- Aparecerá el reproductor de audio

#### **❌ SI HAY PROBLEMAS:**

**Problema 1: No hay TaskId**
```
❌ No taskId found in response!
```
**Solución**: El background script no está enviando el taskId correctamente

**Problema 2: Error 404 en polling**
```
❌ POLLING ERROR: HTTP 404: Not Found
```
**Solución**: El endpoint de polling no existe

**Problema 3: TaskId incorrecto**
```
🔍 POLLING DEBUG - TaskId: null
```
**Solución**: El taskId no se está extrayendo correctamente

**Problema 4: Respuesta sin audio URL**
```
⚠️ COMPLETED but no audio URL found, continuing polling
```
**Solución**: La estructura de respuesta es diferente a la esperada

## 🔧 **COMANDOS DE DEBUGGING**

### **Verificar Token**
```javascript
// En la consola de la extensión
console.log('Token:', document.getElementById('passport').value);
```

### **Verificar Payload**
```javascript
// En la consola de la extensión
console.log('Payload:', JSON.parse(document.getElementById('payload').value));
```

### **Probar Polling Manual**
```javascript
// En la consola de la extensión (reemplaza TASK_ID)
checkTaskStatus('TASK_ID', (result) => console.log('Manual test:', result));
```

### **Verificar Background Script**
```javascript
// En la consola de la extensión
chrome.runtime.sendMessage({action: "test"}, (response) => console.log(response));
```

## 📊 **ESTRUCTURAS DE RESPUESTA ESPERADAS**

### **Respuesta de Generación (background.js)**
```json
{
  "ok": true,
  "data": {
    "response": {
      "code": 200,
      "data": {
        "taskId": "abc123..."
      }
    }
  }
}
```

### **Respuesta de Polling (API)**
```json
{
  "status": "completed",
  "response": {
    "code": 200,
    "data": {
      "audioUrl": "https://...",
      "title": "Mi Canción",
      "duration": 180
    }
  }
}
```

## 🎯 **OBJETIVO**

**ENCONTRAR EXACTAMENTE DÓNDE SE ROMPE EL FLUJO:**

1. ✅ ¿Se genera el taskId?
2. ✅ ¿Se inicia el polling?
3. ✅ ¿Responde la API de polling?
4. ✅ ¿Tiene la respuesta la estructura correcta?
5. ✅ ¿Se detecta el estado "completed"?
6. ✅ ¿Se encuentra el audioUrl?

## 🚨 **ACCIÓN INMEDIATA**

1. **Ejecuta la extensión**
2. **Abre la consola**
3. **Genera música**
4. **Copia TODOS los logs de la consola**
5. **Envíame los logs completos**

**¡CON ESTO PODREMOS IDENTIFICAR EL PROBLEMA EXACTO EN 30 SEGUNDOS!** 🚀
