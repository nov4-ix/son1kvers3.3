// 🔍 SCRIPT DE DEBUGGING PARA EXTENSIÓN ORIGINAL
// Pegar en la consola del background script de la extensión original

(function() {
  console.log('🔍 INICIANDO DEBUGGING DE EXTENSIÓN ORIGINAL');
  
  // Interceptar todas las llamadas fetch
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    const options = args[1] || {};
    
    console.log('🌐 FETCH INTERCEPTADO:');
    console.log('  URL:', url);
    console.log('  Method:', options.method || 'GET');
    console.log('  Headers:', options.headers);
    console.log('  Body:', options.body);
    
    return originalFetch.apply(this, args).then(response => {
      console.log('🌐 RESPUESTA FETCH:');
      console.log('  Status:', response.status);
      console.log('  Headers:', response.headers);
      
      // Clonar la respuesta para leer el contenido
      const clonedResponse = response.clone();
      return clonedResponse.json().then(data => {
        console.log('🌐 DATOS DE RESPUESTA:');
        console.log(JSON.stringify(data, null, 2));
        
        // Buscar campos relacionados con audio
        if (data.audioUrl || data.audio_url || data.url) {
          console.log('🎵 ¡AUDIO ENCONTRADO EN RESPUESTA!');
          console.log('  audioUrl:', data.audioUrl);
          console.log('  audio_url:', data.audio_url);
          console.log('  url:', data.url);
        }
        
        // Buscar taskId o songId
        if (data.taskId || data.task_id || data.songId || data.song_id) {
          console.log('🎯 ¡ID ENCONTRADO EN RESPUESTA!');
          console.log('  taskId:', data.taskId);
          console.log('  task_id:', data.task_id);
          console.log('  songId:', data.songId);
          console.log('  song_id:', data.song_id);
        }
        
        return response;
      }).catch(err => {
        console.log('🌐 Error leyendo JSON:', err);
        return response;
      });
    }).catch(error => {
      console.log('🌐 Error en fetch:', error);
      throw error;
    });
  };
  
  // Interceptar mensajes entre extension y content script
  const originalOnMessage = chrome.runtime.onMessage;
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 MENSAJE INTERCEPTADO:');
    console.log('  Message:', message);
    console.log('  Sender:', sender);
    
    // Si el mensaje tiene datos de respuesta, analizarlos
    if (message.data) {
      console.log('📨 DATOS EN MENSAJE:');
      console.log(JSON.stringify(message.data, null, 2));
      
      // Buscar audio en los datos del mensaje
      if (message.data.audioUrl || message.data.audio_url || message.data.url) {
        console.log('🎵 ¡AUDIO ENCONTRADO EN MENSAJE!');
        console.log('  audioUrl:', message.data.audioUrl);
        console.log('  audio_url:', message.data.audio_url);
        console.log('  url:', message.data.url);
      }
    }
    
    // Continuar con el procesamiento normal
    return false;
  });
  
  // Interceptar chrome.runtime.sendMessage
  const originalSendMessage = chrome.runtime.sendMessage;
  chrome.runtime.sendMessage = function(...args) {
    console.log('📤 SEND MESSAGE INTERCEPTADO:');
    console.log('  Args:', args);
    
    return originalSendMessage.apply(this, args).then(response => {
      console.log('📤 RESPUESTA SEND MESSAGE:');
      console.log(JSON.stringify(response, null, 2));
      
      // Buscar audio en la respuesta
      if (response && (response.audioUrl || response.audio_url || response.url)) {
        console.log('🎵 ¡AUDIO ENCONTRADO EN RESPUESTA SEND MESSAGE!');
        console.log('  audioUrl:', response.audioUrl);
        console.log('  audio_url:', response.audio_url);
        console.log('  url:', response.url);
      }
      
      return response;
    });
  };
  
  console.log('✅ DEBUGGING ACTIVADO - Usa la extensión ahora');
})();
