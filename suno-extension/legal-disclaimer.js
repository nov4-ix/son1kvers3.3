// ⚖️ SISTEMA DE DISCLAIMER LEGAL
// Maneja derechos de autor y términos de uso

const LEGAL_SYSTEM = {
  // Disclaimer de derechos de autor
  copyrightDisclaimer: `
    ⚖️ DISCLAIMER LEGAL - DERECHOS DE AUTOR
    
    Las pistas generadas por Son1kVerse AI Music Engine pueden estar 
    sujetas a derechos de autor. El usuario es completamente responsable 
    del uso legal de las pistas generadas.
    
    Son1kVerse no se hace responsable del uso indebido de las pistas 
    generadas por el sistema.
    
    Al usar este sistema, el usuario acepta estos términos.
  `,
  
  // Términos de uso actualizados
  termsOfUse: `
    📋 TÉRMINOS DE USO ACTUALIZADOS - SON1KVERSE AI MUSIC ENGINE
    
    1. USO PERSONAL: Las pistas generadas son para uso personal únicamente
    2. NO COMERCIAL: No se permite uso comercial sin autorización
    3. NO STREAMING CON REGALÍAS: Prohibido subir a plataformas que generen regalías
    4. PLATAFORMAS PROHIBIDAS: Spotify, Apple Music, YouTube Music, Amazon Music, Deezer, Tidal
    5. PLATAFORMAS PERMITIDAS: SoundCloud gratuito, YouTube sin monetización, Bandcamp sin monetización
    6. DERECHOS DE AUTOR: El usuario es responsable de verificar derechos
    7. CUMPLIMIENTO LEGAL: Cumplir con todas las leyes aplicables
    
    El incumplimiento de estos términos puede resultar en la 
    suspensión del acceso al sistema.
  `,
  
  // Disclaimer específico para streaming
  streamingDisclaimer: `
    🚫 RESTRICCIÓN IMPORTANTE - PLATAFORMAS DE STREAMING
    
    Las pistas generadas por Son1kVerse AI Music Engine NO pueden ser 
    subidas a plataformas que generen regalías de derechos de autor.
    
    ❌ PLATAFORMAS PROHIBIDAS:
    - Spotify
    - Apple Music
    - YouTube Music
    - Amazon Music
    - Deezer
    - Tidal
    - Cualquier plataforma que genere regalías
    
    ✅ PLATAFORMAS PERMITIDAS:
    - SoundCloud (versión gratuita)
    - YouTube (sin monetización)
    - Bandcamp (sin monetización)
    - Vimeo
    - Uso personal privado
    
    RAZÓN: Las pistas pueden contener elementos sujetos a derechos de 
    autor de terceros que no pueden ser monetizados.
  `,
  
  // Licencia de uso
  usageLicense: `
    📜 LICENCIA DE USO - SON1KVERSE AI MUSIC ENGINE
    
    TIPO DE LICENCIA: Uso Personal No Comercial
    
    PERMITIDO:
    - Uso personal y privado
    - Experimentación y aprendizaje
    - Creación de contenido personal
    
    PROHIBIDO:
    - Uso comercial sin autorización
    - Redistribución masiva
    - Violación de derechos de autor
    - Uso en contenido comercial
    
    DURACIÓN: Mientras el usuario tenga acceso activo al sistema
  `,
  
  // Mostrar disclaimer
  showDisclaimer: function() {
    const disclaimerDiv = document.createElement('div');
    disclaimerDiv.className = 'legal-disclaimer';
    disclaimerDiv.innerHTML = `
      <div class="disclaimer-content">
        <h3>⚖️ Disclaimer Legal</h3>
        <p>${this.copyrightDisclaimer}</p>
        <div class="disclaimer-actions">
          <button id="acceptDisclaimer" class="btn-accept">Aceptar</button>
          <button id="rejectDisclaimer" class="btn-reject">Rechazar</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(disclaimerDiv);
    
    // Manejar aceptación/rechazo
    document.getElementById('acceptDisclaimer').onclick = () => {
      this.acceptDisclaimer();
    };
    
    document.getElementById('rejectDisclaimer').onclick = () => {
      this.rejectDisclaimer();
    };
  },
  
  // Aceptar disclaimer
  acceptDisclaimer: function() {
    localStorage.setItem('son1kverse_disclaimer_accepted', 'true');
    localStorage.setItem('son1kverse_disclaimer_date', new Date().toISOString());
    
    // Remover disclaimer
    const disclaimer = document.querySelector('.legal-disclaimer');
    if (disclaimer) {
      disclaimer.remove();
    }
    
    console.log('✅ Disclaimer legal aceptado');
  },
  
  // Rechazar disclaimer
  rejectDisclaimer: function() {
    alert('Debes aceptar el disclaimer legal para usar el sistema');
    window.close();
  },
  
  // Verificar si disclaimer fue aceptado
  isDisclaimerAccepted: function() {
    return localStorage.getItem('son1kverse_disclaimer_accepted') === 'true';
  },
  
  // Mostrar disclaimer de streaming
  showStreamingDisclaimer: function() {
    const streamingDiv = document.createElement('div');
    streamingDiv.className = 'streaming-disclaimer';
    streamingDiv.innerHTML = `
      <div class="streaming-content">
        <h3>🚫 Restricción de Plataformas de Streaming</h3>
        <pre>${this.streamingDisclaimer}</pre>
        <div class="streaming-actions">
          <button id="acknowledgeStreaming" class="btn-acknowledge">Entendido</button>
          <button id="showTerms" class="btn-terms">Ver Términos Completos</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(streamingDiv);
    
    document.getElementById('acknowledgeStreaming').onclick = () => {
      this.acknowledgeStreaming();
    };
    
    document.getElementById('showTerms').onclick = () => {
      this.showTermsOfUse();
    };
  },
  
  // Reconocer disclaimer de streaming
  acknowledgeStreaming: function() {
    localStorage.setItem('son1kverse_streaming_acknowledged', 'true');
    localStorage.setItem('son1kverse_streaming_date', new Date().toISOString());
    
    const streaming = document.querySelector('.streaming-disclaimer');
    if (streaming) {
      streaming.remove();
    }
    
    console.log('✅ Disclaimer de streaming reconocido');
  },
  
  // Verificar si disclaimer de streaming fue reconocido
  isStreamingAcknowledged: function() {
    return localStorage.getItem('son1kverse_streaming_acknowledged') === 'true';
  },
  
  // Mostrar términos de uso
  showTermsOfUse: function() {
    const termsDiv = document.createElement('div');
    termsDiv.className = 'terms-of-use';
    termsDiv.innerHTML = `
      <div class="terms-content">
        <h3>📋 Términos de Uso</h3>
        <pre>${this.termsOfUse}</pre>
        <button id="closeTerms" class="btn-close">Cerrar</button>
      </div>
    `;
    
    document.body.appendChild(termsDiv);
    
    document.getElementById('closeTerms').onclick = () => {
      termsDiv.remove();
    };
  },
  
  // Mostrar licencia de uso
  showUsageLicense: function() {
    const licenseDiv = document.createElement('div');
    licenseDiv.className = 'usage-license';
    licenseDiv.innerHTML = `
      <div class="license-content">
        <h3>📜 Licencia de Uso</h3>
        <pre>${this.usageLicense}</pre>
        <button id="closeLicense" class="btn-close">Cerrar</button>
      </div>
    `;
    
    document.body.appendChild(licenseDiv);
    
    document.getElementById('closeLicense').onclick = () => {
      licenseDiv.remove();
    };
  }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LEGAL_SYSTEM;
}
