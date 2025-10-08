// apps/web-classic/src/lib/pixelSecurityMonitor.ts
export class PixelSecurityMonitor {
  private riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  private monitoringInterval: NodeJS.Timeout | null = null;
  private consecutiveFailures: number = 0;
  private lastCheck: number = 0;
  
  // Configuración de monitoreo
  private monitoringConfig = {
    checkInterval: 30000, // 30 segundos
    riskThresholds: {
      low: 0.3,
      medium: 0.6,
      high: 0.8,
      critical: 0.9
    },
    maxConsecutiveFailures: 3,
    cooldownPeriod: 300000 // 5 minutos
  };

  private listeners: Map<string, Function[]> = new Map();

  async startMonitoring() {
    console.log('🛡️ Pixel Security Monitor iniciado');
    
    this.monitoringInterval = setInterval(async () => {
      await this.performSecurityCheck();
    }, this.monitoringConfig.checkInterval);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🛡️ Pixel Security Monitor detenido');
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  async performSecurityCheck() {
    try {
      this.lastCheck = Date.now();
      
      // 1. Verificar salud de endpoints
      const endpointHealth = await this.checkEndpointHealth();
      
      // 2. Analizar patrones de tráfico
      const trafficAnalysis = await this.analyzeTrafficPatterns();
      
      // 3. Verificar tokens
      const tokenHealth = await this.checkTokenHealth();
      
      // 4. Detectar anomalías
      const anomalies = await this.detectAnomalies();
      
      // 5. Calcular nivel de riesgo
      const riskScore = this.calculateRiskScore({
        endpointHealth,
        trafficAnalysis,
        tokenHealth,
        anomalies
      });
      
      // 6. Actuar según el nivel de riesgo
      await this.respondToRisk(riskScore);
      
      // Resetear contador de fallos si todo está bien
      if (riskScore < this.monitoringConfig.riskThresholds.medium) {
        this.consecutiveFailures = 0;
      }
      
    } catch (error) {
      console.error('Error en monitoreo de seguridad:', error);
      this.consecutiveFailures++;
      await this.handleMonitoringError();
    }
  }

  private async checkEndpointHealth() {
    const endpoints = [
      'https://usa.imgkits.com/node-api/suno/generate',
      'https://usa.imgkits.com/node-api/suno/cover',
      'https://usa.imgkits.com/node-api/suno/status'
    ];

    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        try {
          const start = Date.now();
          const response = await fetch(endpoint, { 
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
          });
          const latency = Date.now() - start;
          
          return {
            endpoint,
            status: response.ok,
            latency,
            statusCode: response.status
          };
        } catch (error) {
          return {
            endpoint,
            status: false,
            latency: 5000,
            statusCode: 0,
            error: error.message
          };
        }
      })
    );

    return results.map(r => r.status === 'fulfilled' ? r.value : null);
  }

  private async analyzeTrafficPatterns() {
    // Obtener métricas de tráfico recientes
    const recentRequests = await this.getRecentRequests();
    
    return {
      requestFrequency: this.calculateRequestFrequency(recentRequests),
      errorRate: this.calculateErrorRate(recentRequests),
      suspiciousPatterns: this.detectSuspiciousPatterns(recentRequests)
    };
  }

  private async checkTokenHealth() {
    // Verificar salud de tokens activos
    const tokens = await this.getActiveTokens();
    
    if (tokens.length === 0) {
      return [{ healthy: false, error: 'No tokens available' }];
    }
    
    const tokenChecks = await Promise.allSettled(
      tokens.map(async (token) => {
        try {
          const response = await fetch('https://usa.imgkits.com/node-api/suno/status/test', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'channel': 'pixel-security'
            },
            signal: AbortSignal.timeout(3000)
          });
          
          return {
            token: token.substring(0, 10) + '...',
            healthy: response.ok,
            status: response.status
          };
        } catch {
          return {
            token: token.substring(0, 10) + '...',
            healthy: false,
            status: 'error'
          };
        }
      })
    );

    return tokenChecks.map(r => r.status === 'fulfilled' ? r.value : null);
  }

  private async detectAnomalies() {
    const metrics = await this.getSystemMetrics();
    
    return {
      highLatency: metrics.averageLatency > 10000,
      highErrorRate: metrics.errorRate > 0.3,
      unusualTraffic: metrics.requestVolume > metrics.normalVolume * 2,
      suspiciousIPs: await this.checkSuspiciousIPs(),
      consecutiveFailures: this.consecutiveFailures >= this.monitoringConfig.maxConsecutiveFailures
    };
  }

  private calculateRiskScore(data: any): number {
    let score = 0;
    
    // Endpoint health (40% weight)
    const healthyEndpoints = data.endpointHealth.filter((h: any) => h?.status).length;
    const totalEndpoints = data.endpointHealth.length;
    if (totalEndpoints > 0) {
      score += (1 - healthyEndpoints / totalEndpoints) * 0.4;
    }
    
    // Traffic analysis (30% weight)
    if (data.trafficAnalysis.errorRate > 0.2) score += 0.3;
    if (data.trafficAnalysis.suspiciousPatterns.length > 0) score += 0.2;
    
    // Token health (20% weight)
    const healthyTokens = data.tokenHealth.filter((t: any) => t?.healthy).length;
    const totalTokens = data.tokenHealth.length;
    if (totalTokens > 0) {
      score += (1 - healthyTokens / totalTokens) * 0.2;
    }
    
    // Anomalies (10% weight)
    if (data.anomalies.highLatency) score += 0.05;
    if (data.anomalies.highErrorRate) score += 0.05;
    if (data.anomalies.consecutiveFailures) score += 0.1;
    
    return Math.min(score, 1);
  }

  private async respondToRisk(riskScore: number) {
    const previousLevel = this.riskLevel;
    
    if (riskScore >= this.monitoringConfig.riskThresholds.critical) {
      this.riskLevel = 'critical';
      await this.activateCriticalProtection();
    } else if (riskScore >= this.monitoringConfig.riskThresholds.high) {
      this.riskLevel = 'high';
      await this.activateHighProtection();
    } else if (riskScore >= this.monitoringConfig.riskThresholds.medium) {
      this.riskLevel = 'medium';
      await this.activateMediumProtection();
    } else {
      this.riskLevel = 'low';
      await this.maintainNormalOperation();
    }
    
    // Emitir evento si el nivel cambió
    if (previousLevel !== this.riskLevel) {
      this.emit('riskLevelChanged', {
        previous: previousLevel,
        current: this.riskLevel,
        score: riskScore
      });
    }
  }

  private async activateCriticalProtection() {
    console.log('🚨🚨 CRÍTICO: Pixel activando protección máxima!');
    this.emit('criticalRiskDetected');
    
    // Activar todas las protecciones
    this.emit('activateVPN', 'Critical risk detected');
    this.emit('createProxies', 'Emergency proxy creation');
    this.emit('rotateTokens', 'Emergency token rotation');
    this.emit('notifyUser', {
      message: '🚨🚨 ALERTA CRÍTICA: Pixel ha detectado una amenaza grave y activado todas las protecciones!',
      type: 'critical'
    });
  }

  private async activateHighProtection() {
    console.log('🚨 ALERTA ALTA: Pixel activando protecciones avanzadas!');
    this.emit('highRiskDetected');
    
    // Activar protecciones avanzadas
    this.emit('activateVPN', 'High risk detected');
    this.emit('createProxies', 'High risk proxy creation');
    this.emit('notifyUser', {
      message: '🚨 ALERTA: Pixel detectó riesgo alto y activó protecciones avanzadas!',
      type: 'warning'
    });
  }

  private async activateMediumProtection() {
    console.log('⚠️ Riesgo medio detectado, aumentando vigilancia');
    this.emit('mediumRiskDetected');
    
    // Aumentar vigilancia
    this.emit('increaseMonitoring');
    this.emit('notifyUser', {
      message: '⚠️ Pixel detectó actividad sospechosa, aumentando vigilancia...',
      type: 'info'
    });
  }

  private async maintainNormalOperation() {
    // Operación normal, solo logging
    console.log('✅ Pixel: Operación normal, riesgo bajo');
  }

  private async handleMonitoringError() {
    if (this.consecutiveFailures >= this.monitoringConfig.maxConsecutiveFailures) {
      console.error('🚨 Pixel: Múltiples fallos consecutivos en monitoreo!');
      this.emit('monitoringFailure', {
        consecutiveFailures: this.consecutiveFailures,
        lastCheck: this.lastCheck
      });
      
      // Activar modo de emergencia
      await this.activateCriticalProtection();
    }
  }

  // Métodos auxiliares (implementación simplificada)
  private async getRecentRequests() {
    // Simular obtención de requests recientes
    return [];
  }

  private calculateRequestFrequency(requests: any[]) {
    return requests.length / 60; // requests por minuto
  }

  private calculateErrorRate(requests: any[]) {
    const errors = requests.filter(r => r.error).length;
    return requests.length > 0 ? errors / requests.length : 0;
  }

  private detectSuspiciousPatterns(requests: any[]) {
    // Detectar patrones sospechosos
    return [];
  }

  private async getActiveTokens() {
    // Obtener tokens activos del storage
    const tokens = localStorage.getItem('son1kverse_active_tokens');
    return tokens ? JSON.parse(tokens) : [];
  }

  private async getSystemMetrics() {
    return {
      averageLatency: 1000,
      errorRate: 0.1,
      requestVolume: 10,
      normalVolume: 5
    };
  }

  private async checkSuspiciousIPs() {
    return false;
  }

  // Métodos públicos para obtener estado
  getRiskLevel() {
    return this.riskLevel;
  }

  getMonitoringStatus() {
    return {
      active: !!this.monitoringInterval,
      riskLevel: this.riskLevel,
      consecutiveFailures: this.consecutiveFailures,
      lastCheck: this.lastCheck
    };
  }
}
