import React, { useRef, useEffect, useState } from 'react';

const MatrixRain = ({ 
  color = "#00FFE7", 
  fontSize = 18, 
  stepMs = 34,
  settleAfterMs = 5000,
  transitionMs = 1000,
  trailInitial = 0.12,
  trailCalm = 0.06,
  glyphAlphaInitial = 1.0,
  glyphAlphaCalm = 0.65,
  enableGlitch = true,
  enableParticles = true,
  quality = 'high' // 'low', 'medium', 'high'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const columnsRef = useRef([]);
  const particlesRef = useRef([]);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Caracteres Matrix expandidos con más variedad
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    // Configuración de calidad
    const qualitySettings = {
      low: { columnDensity: 0.7, particleCount: 20, glitchIntensity: 0.3 },
      medium: { columnDensity: 0.85, particleCount: 40, glitchIntensity: 0.5 },
      high: { columnDensity: 1.0, particleCount: 60, glitchIntensity: 0.7 }
    };
    
    const settings = qualitySettings[quality] || qualitySettings.high;
    
    // Inicializar columnas con más realismo
    const columnCount = Math.floor(canvas.width / fontSize * settings.columnDensity);
    columnsRef.current = Array.from({ length: columnCount }, (_, i) => ({
      x: i * fontSize / settings.columnDensity,
      y: Math.random() * canvas.height,
      chars: Array.from({ length: Math.floor(canvas.height / fontSize) + 3 }, () => 
        Math.random() < 0.3 ? katakana[Math.floor(Math.random() * katakana.length)] : chars[Math.floor(Math.random() * chars.length)]
      ),
      speeds: Array.from({ length: Math.floor(canvas.height / fontSize) + 3 }, () => 
        Math.random() * 0.8 + 0.2
      ),
      lastUpdate: Date.now() - Math.random() * stepMs * 15,
      glitchPhase: Math.random() * Math.PI * 2,
      intensity: Math.random() * 0.5 + 0.5,
      sparkleChance: Math.random() * 0.1 + 0.05
    }));
    
    // Inicializar partículas flotantes
    if (enableParticles) {
      particlesRef.current = Array.from({ length: settings.particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        life: Math.random() * 1000 + 500,
        maxLife: Math.random() * 1000 + 500
      }));
    }

    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      
      // Limpiar canvas con fondo oscuro
      ctx.fillStyle = 'rgba(10, 12, 16, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calcular opacidades según tiempo transcurrido
      let trailOpacity, glyphOpacity;
      
      if (elapsed < settleAfterMs) {
        // Fase inicial - opacidades completas
        trailOpacity = trailInitial;
        glyphOpacity = glyphAlphaInitial;
        setIsSettled(false);
      } else if (elapsed < settleAfterMs + transitionMs) {
        // Fase de transición suave
        const progress = (elapsed - settleAfterMs) / transitionMs;
        trailOpacity = trailInitial + (trailCalm - trailInitial) * progress;
        glyphOpacity = glyphAlphaInitial + (glyphAlphaCalm - glyphAlphaInitial) * progress;
      } else {
        // Fase calm - opacidades reducidas
        trailOpacity = trailCalm;
        glyphOpacity = glyphAlphaCalm;
        if (!isSettled) setIsSettled(true);
      }

      // Dibujar fondo de la lluvia con opacidad de trail
      ctx.fillStyle = `rgba(10, 12, 16, ${trailOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Actualizar y dibujar partículas flotantes
      if (enableParticles) {
        particlesRef.current.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life -= 16;
          
          // Rebotar en los bordes
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
          
          // Renovar partícula si se agota
          if (particle.life <= 0) {
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
            particle.life = particle.maxLife;
            particle.alpha = Math.random() * 0.6 + 0.2;
          }
          
          // Dibujar partícula
          const alpha = (particle.life / particle.maxLife) * particle.alpha * glyphOpacity;
          ctx.fillStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Actualizar y dibujar cada columna
      columnsRef.current.forEach(column => {
        if (now - column.lastUpdate >= stepMs) {
          // Mover caracteres hacia abajo con variación de velocidad
          const speedVariation = column.speeds[0] || 0.8;
          column.y += fontSize * speedVariation;
          
          // Si la columna se sale de la pantalla, reiniciar desde arriba
          if (column.y > canvas.height + fontSize) {
            column.y = -fontSize;
            // Regenerar algunos caracteres aleatoriamente
            for (let i = 0; i < column.chars.length; i++) {
              if (Math.random() < 0.15) {
                column.chars[i] = Math.random() < 0.3 ? 
                  katakana[Math.floor(Math.random() * katakana.length)] : 
                  chars[Math.floor(Math.random() * chars.length)];
              }
            }
          }
          
          column.lastUpdate = now;
        }

        // Dibujar caracteres de la columna con efectos avanzados
        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = 'center';
        
        column.chars.forEach((char, index) => {
          const y = column.y + (index * fontSize);
          
          if (y > -fontSize && y < canvas.height + fontSize) {
            // Efecto de desvanecimiento hacia arriba
            const alpha = Math.max(0, 1 - (index / column.chars.length));
            const finalAlpha = alpha * glyphOpacity;
            
            // Efectos glitch por columna
            let glitchOffsetX = 0;
            let glitchOffsetY = 0;
            let glitchColor = color;
            
            if (enableGlitch && Math.random() < settings.glitchIntensity) {
              glitchOffsetX = (Math.random() - 0.5) * 2;
              glitchOffsetY = (Math.random() - 0.5) * 2;
              
              // Cambio de color ocasional
              if (Math.random() < 0.1) {
                glitchColor = Math.random() < 0.5 ? '#B84DFF' : '#9AF7EE';
              }
            }
            
            // Efecto sparkle ocasional
            if (Math.random() < column.sparkleChance) {
              ctx.fillStyle = `#FFFFFF${Math.floor(finalAlpha * 255).toString(16).padStart(2, '0')}`;
              ctx.fillText('*', column.x + fontSize / 2 + glitchOffsetX, y + glitchOffsetY - 2);
            }
            
            // Carácter principal
            ctx.fillStyle = `${glitchColor}${Math.floor(finalAlpha * 255).toString(16).padStart(2, '0')}`;
            ctx.fillText(char, column.x + fontSize / 2 + glitchOffsetX, y + glitchOffsetY);
            
            // Efecto de eco/ghost ocasional
            if (Math.random() < 0.05 && finalAlpha > 0.3) {
              ctx.fillStyle = `${glitchColor}${Math.floor(finalAlpha * 0.3 * 255).toString(16).padStart(2, '0')}`;
              ctx.fillText(char, column.x + fontSize / 2 + glitchOffsetX + 1, y + glitchOffsetY + 1);
            }
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, fontSize, stepMs, settleAfterMs, transitionMs, trailInitial, trailCalm, glyphAlphaInitial, glyphAlphaCalm, enableGlitch, enableParticles, quality]);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        background: '#0A0C10',
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default MatrixRain;