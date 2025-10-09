// suno-extension/suno-player.js
class SunoPlayer {
  constructor(containerId) {
    this.containerId = containerId;
    this.tracks = [];
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 1;
    this.isLoading = false;
    this.error = null;
    
    this.audioElement = null;
    this.progressElement = null;
  }

  // Mostrar reproductor con tracks
  show(tracks) {
    this.tracks = tracks;
    this.currentTrackIndex = 0;
    
    const container = document.getElementById(this.containerId);
    if (!container) return;
    
    container.innerHTML = this.createPlayerHTML();
    this.setupEventListeners();
    this.loadCurrentTrack();
  }

  // Crear HTML del reproductor
  createPlayerHTML() {
    const currentTrack = this.tracks[this.currentTrackIndex];
    
    return `
      <div class="suno-player" style="
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 20px;
        margin-top: 20px;
      ">
        <!-- Información del track actual -->
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
          ${currentTrack.image_url ? `
            <img src="${currentTrack.image_url}" alt="${currentTrack.title}" 
                 style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover;">
          ` : ''}
          <div style="flex: 1;">
            <h3 style="color: white; margin: 0; font-size: 18px; font-weight: bold;">
              ${currentTrack.title || 'Track Sin Título'}
            </h3>
            <p style="color: #9AF7EE; margin: 5px 0; font-size: 14px;">
              ${currentTrack.tags || 'Sin etiquetas'}
            </p>
            <p style="color: #666; margin: 0; font-size: 12px;">
              Track ${this.currentTrackIndex + 1} de ${this.tracks.length}
            </p>
          </div>
        </div>

        <!-- Reproductor de audio -->
        <audio id="suno-audio" preload="metadata" style="display: none;"></audio>

        <!-- Controles principales -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
          <button id="prev-track" style="
            background: transparent;
            border: 1px solid #00FFE7;
            color: #00FFE7;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
          ">⏮️</button>
          
          <button id="play-pause" style="
            background: #00FFE7;
            color: black;
            border: none;
            padding: 15px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
          ">▶️</button>
          
          <button id="next-track" style="
            background: transparent;
            border: 1px solid #00FFE7;
            color: #00FFE7;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
          ">⏭️</button>
        </div>

        <!-- Barra de progreso -->
        <div style="margin-bottom: 20px;">
          <div id="progress-bar" style="
            width: 100%;
            height: 6px;
            background: rgba(255,255,255,0.2);
            border-radius: 3px;
            cursor: pointer;
            position: relative;
          ">
            <div id="progress-fill" style="
              height: 100%;
              background: linear-gradient(90deg, #00FFE7, #B84DFF);
              border-radius: 3px;
              width: 0%;
              transition: width 0.1s ease;
            "></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 5px;">
            <span id="current-time" style="color: #9AF7EE; font-size: 12px;">0:00</span>
            <span id="total-time" style="color: #9AF7EE; font-size: 12px;">0:00</span>
          </div>
        </div>

        <!-- Control de volumen -->
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
          <span style="color: #9AF7EE; font-size: 14px;">🔊</span>
          <input type="range" id="volume-control" min="0" max="1" step="0.1" value="1" style="
            flex: 1;
            height: 4px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            outline: none;
          ">
          <span id="volume-percent" style="color: #9AF7EE; font-size: 12px;">100%</span>
        </div>

        <!-- Lista de tracks -->
        ${this.tracks.length > 1 ? `
          <div style="margin-top: 20px;">
            <h4 style="color: white; margin-bottom: 10px; font-size: 14px;">Tracks disponibles:</h4>
            <div id="tracks-list" style="display: flex; flex-direction: column; gap: 8px;">
              ${this.tracks.map((track, index) => `
                <button class="track-item ${index === this.currentTrackIndex ? 'active' : ''}" 
                        data-index="${index}" style="
                  width: 100%;
                  padding: 10px;
                  background: ${index === this.currentTrackIndex ? 'rgba(0, 255, 231, 0.2)' : 'rgba(255,255,255,0.05)'};
                  border: 1px solid ${index === this.currentTrackIndex ? '#00FFE7' : 'rgba(255,255,255,0.1)'};
                  border-radius: 6px;
                  color: white;
                  text-align: left;
                  cursor: pointer;
                  font-size: 12px;
                ">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #9AF7EE;">#${index + 1}</span>
                    <div style="flex: 1;">
                      <div style="font-weight: bold;">${track.title || `Track ${index + 1}`}</div>
                      <div style="color: #666; font-size: 11px;">${track.tags || 'Sin etiquetas'}</div>
                    </div>
                    ${index === this.currentTrackIndex ? '<span style="color: #00FFE7;">▶️</span>' : ''}
                  </div>
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Botones de acción -->
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <a href="${currentTrack.audio_url}" download="${currentTrack.title || 'track'}.mp3" style="
            flex: 1;
            padding: 12px;
            background: #00FF00;
            color: black;
            text-decoration: none;
            border-radius: 6px;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
          ">💾 Descargar</a>
          
          <button id="copy-url" style="
            flex: 1;
            padding: 12px;
            background: #B84DFF;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
          ">📋 Copiar URL</button>
        </div>

        <!-- Error -->
        ${this.error ? `
          <div style="
            margin-top: 15px;
            padding: 10px;
            background: rgba(255, 107, 107, 0.2);
            border: 1px solid rgba(255, 107, 107, 0.3);
            border-radius: 6px;
            color: #ff6b6b;
            font-size: 12px;
          ">❌ ${this.error}</div>
        ` : ''}
      </div>
    `;
  }

  // Configurar event listeners
  setupEventListeners() {
    this.audioElement = document.getElementById('suno-audio');
    this.progressElement = document.getElementById('progress-bar');
    
    if (!this.audioElement) return;
    
    // Event listeners del audio
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.duration = this.audioElement.duration;
      this.updateTimeDisplay();
    });
    
    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTime = this.audioElement.currentTime;
      this.updateProgress();
      this.updateTimeDisplay();
    });
    
    this.audioElement.addEventListener('ended', () => {
      this.nextTrack();
    });
    
    this.audioElement.addEventListener('error', () => {
      this.error = 'Error al cargar el audio';
      this.updateDisplay();
    });
    
    // Controles
    document.getElementById('play-pause').addEventListener('click', () => {
      this.togglePlayPause();
    });
    
    document.getElementById('prev-track').addEventListener('click', () => {
      this.prevTrack();
    });
    
    document.getElementById('next-track').addEventListener('click', () => {
      this.nextTrack();
    });
    
    // Barra de progreso
    this.progressElement.addEventListener('click', (e) => {
      const rect = this.progressElement.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * this.duration;
      this.audioElement.currentTime = newTime;
    });
    
    // Control de volumen
    const volumeControl = document.getElementById('volume-control');
    volumeControl.addEventListener('input', (e) => {
      this.volume = parseFloat(e.target.value);
      this.audioElement.volume = this.volume;
      document.getElementById('volume-percent').textContent = Math.round(this.volume * 100) + '%';
    });
    
    // Lista de tracks
    document.querySelectorAll('.track-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'));
        this.setCurrentTrack(index);
      });
    });
    
    // Copiar URL
    document.getElementById('copy-url').addEventListener('click', () => {
      this.copyCurrentTrackUrl();
    });
  }

  // Cargar track actual
  loadCurrentTrack() {
    if (this.tracks.length === 0) return;
    
    const currentTrack = this.tracks[this.currentTrackIndex];
    this.audioElement.src = currentTrack.audio_url;
    this.error = null;
  }

  // Reproducir/pausar
  togglePlayPause() {
    if (this.isPlaying) {
      this.audioElement.pause();
    } else {
      this.audioElement.play();
    }
    this.isPlaying = !this.isPlaying;
    this.updatePlayButton();
  }

  // Siguiente track
  nextTrack() {
    if (this.currentTrackIndex < this.tracks.length - 1) {
      this.setCurrentTrack(this.currentTrackIndex + 1);
    }
  }

  // Track anterior
  prevTrack() {
    if (this.currentTrackIndex > 0) {
      this.setCurrentTrack(this.currentTrackIndex - 1);
    }
  }

  // Establecer track actual
  setCurrentTrack(index) {
    this.currentTrackIndex = index;
    this.loadCurrentTrack();
    this.updateDisplay();
  }

  // Actualizar display
  updateDisplay() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = this.createPlayerHTML();
      this.setupEventListeners();
    }
  }

  // Actualizar botón de play/pause
  updatePlayButton() {
    const playButton = document.getElementById('play-pause');
    if (playButton) {
      playButton.textContent = this.isPlaying ? '⏸️' : '▶️';
    }
  }

  // Actualizar progreso
  updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill && this.duration > 0) {
      const progress = (this.currentTime / this.duration) * 100;
      progressFill.style.width = progress + '%';
    }
  }

  // Actualizar tiempo
  updateTimeDisplay() {
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    
    if (currentTimeEl) {
      currentTimeEl.textContent = this.formatTime(this.currentTime);
    }
    if (totalTimeEl) {
      totalTimeEl.textContent = this.formatTime(this.duration);
    }
  }

  // Formatear tiempo
  formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Copiar URL del track actual
  copyCurrentTrackUrl() {
    const currentTrack = this.tracks[this.currentTrackIndex];
    navigator.clipboard.writeText(currentTrack.audio_url).then(() => {
      alert('URL copiada al clipboard');
    }).catch(() => {
      alert('Error al copiar URL');
    });
  }
}

// Hacer disponible globalmente
window.SunoPlayer = SunoPlayer;