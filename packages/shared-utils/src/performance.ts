// Performance Utilities - Optimizaciones épicas del universo Son1kVerse

/**
 * Debounce function para optimizar llamadas frecuentes
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle function para limitar frecuencia de ejecución
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Memoization para funciones costosas
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    // Limpiar caché si es muy grande
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  }) as T;
}

/**
 * Lazy loading para componentes pesados
 */
export function lazyLoad<T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: T
): () => Promise<T> {
  return async () => {
    try {
      const module = await importFn();
      return module.default;
    } catch (error) {
      console.error('Lazy loading failed:', error);
      if (fallback) {
        return fallback;
      }
      throw error;
    }
  };
}

/**
 * Virtual scrolling para listas grandes
 */
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
) {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  
  const getVisibleRange = (scrollTop: number) => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );
    
    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex: Math.min(items.length - 1, endIndex + overscan)
    };
  };
  
  const getVisibleItems = (scrollTop: number) => {
    const { startIndex, endIndex } = getVisibleRange(scrollTop);
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  };
  
  return {
    getVisibleRange,
    getVisibleItems,
    totalHeight: items.length * itemHeight
  };
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];
  
  constructor() {
    this.initializeObservers();
  }
  
  private initializeObservers() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Observer para medidas de rendimiento
      const measureObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('measure', entry.duration);
        }
      });
      
      // Observer para navegación
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('domContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
            this.recordMetric('loadComplete', navEntry.loadEventEnd - navEntry.loadEventStart);
          }
        }
      });
      
      measureObserver.observe({ entryTypes: ['measure'] });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      
      this.observers.push(measureObserver, navigationObserver);
    }
  }
  
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Mantener solo los últimos 100 valores
    if (values.length > 100) {
      values.shift();
    }
  }
  
  getMetricStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;
    
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)]
    };
  }
  
  measureFunction<T extends (...args: any[]) => any>(
    name: string,
    fn: T
  ): T {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      this.recordMetric(name, end - start);
      
      return result;
    }) as T;
  }
  
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

/**
 * Image optimization utilities
 */
export class ImageOptimizer {
  private static readonly SUPPORTED_FORMATS = ['webp', 'avif', 'jpeg', 'png'];
  
  static getOptimizedImageUrl(
    originalUrl: string,
    width?: number,
    height?: number,
    quality = 80
  ): string {
    // En un entorno real, esto se conectaría con un servicio de optimización de imágenes
    const params = new URLSearchParams();
    
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    
    // Detectar soporte para formatos modernos
    const format = this.getBestSupportedFormat();
    if (format !== 'jpeg') {
      params.set('f', format);
    }
    
    return `${originalUrl}?${params.toString()}`;
  }
  
  private static getBestSupportedFormat(): string {
    if (typeof document === 'undefined') return 'jpeg';
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    // Verificar soporte para AVIF
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
      return 'avif';
    }
    
    // Verificar soporte para WebP
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp';
    }
    
    return 'jpeg';
  }
  
  static preloadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }
  
  static createImagePlaceholder(width: number, height: number, color = '#1a1d26'): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
    }
    
    return canvas.toDataURL();
  }
}

/**
 * Bundle optimization utilities
 */
export class BundleOptimizer {
  private static readonly CRITICAL_CHUNKS = new Set(['vendor', 'runtime', 'main']);
  
  static isCriticalChunk(chunkName: string): boolean {
    return this.CRITICAL_CHUNKS.has(chunkName);
  }
  
  static preloadChunk(chunkName: string): void {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // En un entorno real, esto cargaría el chunk de forma asíncrona
        console.log(`Preloading chunk: ${chunkName}`);
      });
    }
  }
  
  static preloadRoute(routePath: string): void {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Pre-cargar recursos para rutas específicas
        console.log(`Preloading route: ${routePath}`);
      });
    }
  }
}

/**
 * Memory management utilities
 */
export class MemoryManager {
  private static readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
  private static cacheSize = 0;
  private static cache = new Map<string, { data: any; size: number; timestamp: number }>();
  
  static setCache(key: string, data: any, size?: number): void {
    const dataSize = size || this.estimateSize(data);
    
    // Limpiar caché si excede el límite
    if (this.cacheSize + dataSize > this.MAX_CACHE_SIZE) {
      this.cleanupCache();
    }
    
    this.cache.set(key, {
      data,
      size: dataSize,
      timestamp: Date.now()
    });
    
    this.cacheSize += dataSize;
  }
  
  static getCache(key: string): any {
    const item = this.cache.get(key);
    if (item) {
      item.timestamp = Date.now(); // Actualizar timestamp de acceso
      return item.data;
    }
    return null;
  }
  
  static clearCache(): void {
    this.cache.clear();
    this.cacheSize = 0;
  }
  
  private static cleanupCache(): void {
    const items = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Eliminar el 25% más antiguo
    const toRemove = Math.floor(items.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      const [key, item] = items[i];
      this.cache.delete(key);
      this.cacheSize -= item.size;
    }
  }
  
  private static estimateSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 1024; // Estimación por defecto
    }
  }
}

/**
 * Animation performance utilities
 */
export class AnimationOptimizer {
  private static readonly REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  static shouldReduceMotion(): boolean {
    return this.REDUCED_MOTION;
  }
  
  static getOptimizedDuration(baseDuration: number): number {
    return this.REDUCED_MOTION ? Math.min(baseDuration, 200) : baseDuration;
  }
  
  static createOptimizedTransition(
    element: HTMLElement,
    properties: Record<string, string>,
    duration = 300
  ): Promise<void> {
    return new Promise((resolve) => {
      const optimizedDuration = this.getOptimizedDuration(duration);
      
      if (this.REDUCED_MOTION) {
        // Aplicar cambios inmediatamente sin animación
        Object.assign(element.style, properties);
        resolve();
        return;
      }
      
      // Usar requestAnimationFrame para animaciones suaves
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / optimizedDuration, 1);
        
        // Aplicar propiedades con easing
        Object.entries(properties).forEach(([property, value]) => {
          element.style.setProperty(property, value);
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }
}

// Exportar instancia global del monitor de rendimiento
export const performanceMonitor = new PerformanceMonitor();

// Exportar utilidades principales
export {
  debounce,
  throttle,
  memoize,
  lazyLoad,
  useVirtualScroll,
  ImageOptimizer,
  BundleOptimizer,
  MemoryManager,
  AnimationOptimizer
};