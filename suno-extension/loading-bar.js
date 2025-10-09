// suno-extension/loading-bar.js
class LoadingBar {
  constructor() {
    this.isVisible = false;
    this.progress = 0;
    this.currentTask = '';
    this.tasks = [];
    this.currentTaskIndex = 0;
    
    this.createLoadingBar();
    this.setupAnimations();
  }

  createLoadingBar() {
    // Crear contenedor de la barra de carga
    this.container = document.createElement('div');
    this.container.id = 'son1kverse-loading-bar';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(0, 0, 0, 0.1);
      z-index: 10001;
      display: none;
      font-family: Arial, sans-serif;
    `;

    // Crear la barra de progreso
    this.progressBar = document.createElement('div');
    this.progressBar.style.cssText = `
      height: 100%;
      background: linear-gradient(90deg, #00FFE7 0%, #B84DFF 50%, #9AF7EE 100%);
      width: 0%;
      transition: width 0.3s ease;
      position: relative;
      overflow: hidden;
    `;

    // Crear efecto de brillo
    this.shine = document.createElement('div');
    this.shine.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
      animation: shine 2s infinite;
    `;

    // Crear contenedor de información
    this.infoContainer = document.createElement('div');
    this.infoContainer.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: #00FFE7;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      z-index: 10002;
      display: none;
      border: 1px solid #00FFE7;
      box-shadow: 0 0 20px rgba(0, 255, 231, 0.3);
      backdrop-filter: blur(10px);
    `;

    // Crear texto de progreso
    this.progressText = document.createElement('div');
    this.progressText.style.cssText = `
      text-align: center;
      margin-bottom: 5px;
    `;

    // Crear texto de tarea actual
    this.taskText = document.createElement('div');
    this.taskText.style.cssText = `
      text-align: center;
      font-size: 10px;
      color: #9AF7EE;
      opacity: 0.8;
    `;

    // Crear animación CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shine {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      .loading-pulse {
        animation: pulse 1.5s infinite;
      }
    `;
    document.head.appendChild(style);

    // Ensamblar componentes
    this.progressBar.appendChild(this.shine);
    this.container.appendChild(this.progressBar);
    this.infoContainer.appendChild(this.progressText);
    this.infoContainer.appendChild(this.taskText);
    
    document.body.appendChild(this.container);
    document.body.appendChild(this.infoContainer);
  }

  setupAnimations() {
    // Animación de brillo continua
    setInterval(() => {
      if (this.isVisible) {
        this.shine.style.animation = 'none';
        setTimeout(() => {
          this.shine.style.animation = 'shine 2s infinite';
        }, 10);
      }
    }, 2000);
  }

  // Mostrar barra de carga
  show(tasks = []) {
    this.tasks = tasks;
    this.currentTaskIndex = 0;
    this.progress = 0;
    this.isVisible = true;
    
    this.container.style.display = 'block';
    this.infoContainer.style.display = 'block';
    
    this.updateProgress(0, tasks[0] || 'Iniciando...');
    
    // Agregar clase de pulso
    this.infoContainer.classList.add('loading-pulse');
  }

  // Ocultar barra de carga
  hide() {
    this.isVisible = false;
    this.container.style.display = 'none';
    this.infoContainer.style.display = 'none';
    this.infoContainer.classList.remove('loading-pulse');
  }

  // Actualizar progreso
  updateProgress(progress, task = '') {
    if (!this.isVisible) return;
    
    this.progress = Math.max(0, Math.min(100, progress));
    this.currentTask = task;
    
    // Actualizar barra
    this.progressBar.style.width = `${this.progress}%`;
    
    // Actualizar textos
    this.progressText.textContent = `${Math.round(this.progress)}%`;
    this.taskText.textContent = task;
    
    // Cambiar color según progreso
    if (this.progress < 30) {
      this.progressBar.style.background = 'linear-gradient(90deg, #00FFE7 0%, #B84DFF 100%)';
    } else if (this.progress < 70) {
      this.progressBar.style.background = 'linear-gradient(90deg, #B84DFF 0%, #9AF7EE 100%)';
    } else {
      this.progressBar.style.background = 'linear-gradient(90deg, #9AF7EE 0%, #00FFE7 100%)';
    }
  }

  // Siguiente tarea
  nextTask() {
    this.currentTaskIndex++;
    if (this.currentTaskIndex < this.tasks.length) {
      const progress = (this.currentTaskIndex / this.tasks.length) * 100;
      this.updateProgress(progress, this.tasks[this.currentTaskIndex]);
    }
  }

  // Completar
  complete() {
    this.updateProgress(100, '¡Completado!');
    
    // Ocultar después de un breve momento
    setTimeout(() => {
      this.hide();
    }, 1000);
  }

  // Simular progreso automático
  simulateProgress(duration = 5000, tasks = []) {
    this.show(tasks);
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed / duration) * 100;
      
      if (progress >= 100) {
        clearInterval(interval);
        this.complete();
      } else {
        // Actualizar tarea según progreso
        const taskIndex = Math.floor((progress / 100) * tasks.length);
        if (taskIndex < tasks.length) {
          this.updateProgress(progress, tasks[taskIndex]);
        }
      }
    }, 100);
  }

  // Barra de carga para generación de música
  showMusicGeneration() {
    const tasks = [
      'Preparando generación...',
      'Conectando con Suno AI...',
      'Procesando letra y estilo...',
      'Generando música...',
      'Optimizando audio...',
      'Finalizando...'
    ];
    
    this.simulateProgress(15000, tasks); // 15 segundos para generación
  }

  // Barra de carga para verificación de token
  showTokenVerification() {
    const tasks = [
      'Verificando token...',
      'Conectando con API...',
      'Validando credenciales...',
      'Completado'
    ];
    
    this.simulateProgress(3000, tasks); // 3 segundos para verificación
  }

  // Barra de carga para carga de datos
  showDataLoading() {
    const tasks = [
      'Cargando datos...',
      'Procesando información...',
      'Completado'
    ];
    
    this.simulateProgress(2000, tasks); // 2 segundos para carga
  }
}

// Crear instancia global
const loadingBar = new LoadingBar();

// Hacer disponible globalmente
window.Sono1kverseLoadingBar = loadingBar;

console.log('📊 Sistema: Barra de carga inicializada');
