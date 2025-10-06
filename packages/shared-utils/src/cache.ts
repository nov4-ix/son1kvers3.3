// Cache System - Sistema de caché inteligente del universo Son1kVerse

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size in bytes
  strategy?: 'lru' | 'lfu' | 'fifo'; // Cache eviction strategy
  persist?: boolean; // Persist to localStorage
}

export interface CacheItem<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  size: number;
  expiresAt?: number;
}

/**
 * Intelligent Cache System con múltiples estrategias
 */
export class IntelligentCache<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private options: Required<CacheOptions>;
  private currentSize = 0;
  private accessOrder: string[] = [];
  private frequencyMap = new Map<string, number>();

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 10 * 1024 * 1024, // 10MB default
      strategy: options.strategy || 'lru',
      persist: options.persist || false
    };

    if (this.options.persist) {
      this.loadFromStorage();
    }
  }

  /**
   * Set a value in the cache
   */
  set(key: string, value: T, customTtl?: number): void {
    const ttl = customTtl || this.options.ttl;
    const size = this.estimateSize(value);
    const expiresAt = Date.now() + ttl;

    // Check if we need to evict items
    if (this.currentSize + size > this.options.maxSize) {
      this.evictItems(size);
    }

    const item: CacheItem<T> = {
      value,
      timestamp: Date.now(),
      accessCount: 0,
      size,
      expiresAt
    };

    this.cache.set(key, item);
    this.currentSize += size;
    this.updateAccessOrder(key);
    this.updateFrequency(key);

    if (this.options.persist) {
      this.saveToStorage();
    }
  }

  /**
   * Get a value from the cache
   */
  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.delete(key);
      return null;
    }

    // Update access statistics
    item.accessCount++;
    this.updateAccessOrder(key);
    this.updateFrequency(key);

    return item.value;
  }

  /**
   * Check if a key exists in the cache
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // Check if item has expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a key from the cache
   */
  delete(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    this.cache.delete(key);
    this.currentSize -= item.size;
    this.removeFromAccessOrder(key);
    this.frequencyMap.delete(key);

    if (this.options.persist) {
      this.saveToStorage();
    }

    return true;
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    this.accessOrder = [];
    this.frequencyMap.clear();

    if (this.options.persist) {
      localStorage.removeItem(this.getStorageKey());
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const items = Array.from(this.cache.values());
    const now = Date.now();

    return {
      size: this.currentSize,
      maxSize: this.options.maxSize,
      itemCount: this.cache.size,
      hitRate: this.calculateHitRate(),
      averageAge: items.reduce((sum, item) => sum + (now - item.timestamp), 0) / items.length,
      oldestItem: Math.min(...items.map(item => item.timestamp)),
      newestItem: Math.max(...items.map(item => item.timestamp)),
      expiredItems: items.filter(item => item.expiresAt && now > item.expiresAt).length
    };
  }

  /**
   * Clean expired items
   */
  cleanup(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.delete(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * Get all keys in the cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all values in the cache
   */
  values(): T[] {
    return Array.from(this.cache.values()).map(item => item.value);
  }

  /**
   * Update access order for LRU strategy
   */
  private updateAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  /**
   * Remove key from access order
   */
  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  /**
   * Update frequency for LFU strategy
   */
  private updateFrequency(key: string): void {
    const current = this.frequencyMap.get(key) || 0;
    this.frequencyMap.set(key, current + 1);
  }

  /**
   * Evict items based on strategy
   */
  private evictItems(requiredSpace: number): void {
    const itemsToEvict: string[] = [];

    switch (this.options.strategy) {
      case 'lru':
        itemsToEvict.push(...this.getLRUItems(requiredSpace));
        break;
      case 'lfu':
        itemsToEvict.push(...this.getLFUItems(requiredSpace));
        break;
      case 'fifo':
        itemsToEvict.push(...this.getFIFOItems(requiredSpace));
        break;
    }

    itemsToEvict.forEach(key => this.delete(key));
  }

  /**
   * Get LRU items to evict
   */
  private getLRUItems(requiredSpace: number): string[] {
    const items: string[] = [];
    let freedSpace = 0;

    for (const key of this.accessOrder) {
      const item = this.cache.get(key);
      if (item) {
        items.push(key);
        freedSpace += item.size;
        if (freedSpace >= requiredSpace) {
          break;
        }
      }
    }

    return items;
  }

  /**
   * Get LFU items to evict
   */
  private getLFUItems(requiredSpace: number): string[] {
    const sortedByFrequency = Array.from(this.frequencyMap.entries())
      .sort((a, b) => a[1] - b[1]);

    const items: string[] = [];
    let freedSpace = 0;

    for (const [key] of sortedByFrequency) {
      const item = this.cache.get(key);
      if (item) {
        items.push(key);
        freedSpace += item.size;
        if (freedSpace >= requiredSpace) {
          break;
        }
      }
    }

    return items;
  }

  /**
   * Get FIFO items to evict
   */
  private getFIFOItems(requiredSpace: number): string[] {
    const sortedByTimestamp = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    const items: string[] = [];
    let freedSpace = 0;

    for (const [key, item] of sortedByTimestamp) {
      items.push(key);
      freedSpace += item.size;
      if (freedSpace >= requiredSpace) {
        break;
      }
    }

    return items;
  }

  /**
   * Estimate size of a value
   */
  private estimateSize(value: T): number {
    try {
      return new Blob([JSON.stringify(value)]).size;
    } catch {
      return 1024; // Default estimate
    }
  }

  /**
   * Calculate hit rate
   */
  private calculateHitRate(): number {
    const totalAccesses = Array.from(this.cache.values())
      .reduce((sum, item) => sum + item.accessCount, 0);
    
    return totalAccesses > 0 ? totalAccesses / (totalAccesses + this.cache.size) : 0;
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        accessOrder: this.accessOrder,
        frequencyMap: Array.from(this.frequencyMap.entries()),
        currentSize: this.currentSize
      };

      localStorage.setItem(this.getStorageKey(), JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(this.getStorageKey());
      if (!data) return;

      const parsed = JSON.parse(data);
      
      this.cache = new Map(parsed.cache);
      this.accessOrder = parsed.accessOrder || [];
      this.frequencyMap = new Map(parsed.frequencyMap || []);
      this.currentSize = parsed.currentSize || 0;

      // Clean expired items on load
      this.cleanup();
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  /**
   * Get storage key for this cache instance
   */
  private getStorageKey(): string {
    return `son1kverse_cache_${this.options.strategy}`;
  }
}

/**
 * Cache Manager para múltiples caches
 */
export class CacheManager {
  private caches = new Map<string, IntelligentCache>();

  /**
   * Create or get a cache instance
   */
  getCache<T>(name: string, options?: CacheOptions): IntelligentCache<T> {
    if (!this.caches.has(name)) {
      this.caches.set(name, new IntelligentCache<T>(options));
    }
    return this.caches.get(name) as IntelligentCache<T>;
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.caches.forEach(cache => cache.clear());
  }

  /**
   * Get statistics for all caches
   */
  getAllStats() {
    const stats: Record<string, any> = {};
    
    this.caches.forEach((cache, name) => {
      stats[name] = cache.getStats();
    });

    return stats;
  }

  /**
   * Cleanup all caches
   */
  cleanupAll(): number {
    let totalCleaned = 0;
    
    this.caches.forEach(cache => {
      totalCleaned += cache.cleanup();
    });

    return totalCleaned;
  }
}

/**
 * Cache decorator para funciones
 */
export function cached<T extends (...args: any[]) => any>(
  cacheName: string,
  keyGenerator?: (...args: Parameters<T>) => string,
  options?: CacheOptions
) {
  const cacheManager = new CacheManager();
  const cache = cacheManager.getCache<ReturnType<T>>(cacheName, options);

  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function (...args: Parameters<T>) {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      let result = cache.get(key);
      if (result === null) {
        result = method.apply(this, args);
        cache.set(key, result);
      }
      
      return result;
    };

    return descriptor;
  };
}

/**
 * Cache hook para React
 */
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: CacheOptions
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const cacheManager = React.useMemo(() => new CacheManager(), []);
  const cache = React.useMemo(() => cacheManager.getCache<T>('default', options), [cacheManager, options]);

  const fetchData = React.useCallback(async () => {
    // Check cache first
    const cachedData = cache.get(key);
    if (cachedData !== null) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      cache.set(key, result);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, cache]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = React.useCallback(() => {
    cache.delete(key);
    fetchData();
  }, [key, fetchData, cache]);

  return { data, loading, error, refetch };
}

// Exportar instancia global del cache manager
export const globalCacheManager = new CacheManager();

// Exportar utilidades principales
export {
  IntelligentCache,
  CacheManager,
  cached,
  useCache
};