// Bundle Optimizer - Optimizador de bundles del universo Son1kVerse

export interface BundleInfo {
  name: string;
  size: number;
  gzippedSize?: number;
  dependencies: string[];
  isCritical: boolean;
  loadTime?: number;
}

export interface BundleMetrics {
  totalSize: number;
  totalGzippedSize?: number;
  criticalSize: number;
  nonCriticalSize: number;
  loadTime: number;
  bundleCount: number;
}

/**
 * Bundle Analyzer
 */
export class BundleAnalyzer {
  private bundles: Map<string, BundleInfo> = new Map();
  private loadTimes: Map<string, number> = new Map();

  /**
   * Register a bundle
   */
  registerBundle(bundle: BundleInfo): void {
    this.bundles.set(bundle.name, bundle);
  }

  /**
   * Record bundle load time
   */
  recordLoadTime(bundleName: string, loadTime: number): void {
    this.loadTimes.set(bundleName, loadTime);
    
    const bundle = this.bundles.get(bundleName);
    if (bundle) {
      bundle.loadTime = loadTime;
    }
  }

  /**
   * Get bundle metrics
   */
  getMetrics(): BundleMetrics {
    const bundles = Array.from(this.bundles.values());
    
    const totalSize = bundles.reduce((sum, bundle) => sum + bundle.size, 0);
    const totalGzippedSize = bundles.reduce((sum, bundle) => sum + (bundle.gzippedSize || bundle.size), 0);
    const criticalSize = bundles.filter(b => b.isCritical).reduce((sum, bundle) => sum + bundle.size, 0);
    const nonCriticalSize = totalSize - criticalSize;
    const loadTime = Math.max(...Array.from(this.loadTimes.values()));
    const bundleCount = bundles.length;

    return {
      totalSize,
      totalGzippedSize,
      criticalSize,
      nonCriticalSize,
      loadTime,
      bundleCount
    };
  }

  /**
   * Get optimization suggestions
   */
  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const metrics = this.getMetrics();
    const bundles = Array.from(this.bundles.values());

    // Check for large bundles
    const largeBundles = bundles.filter(bundle => bundle.size > 500 * 1024); // 500KB
    if (largeBundles.length > 0) {
      suggestions.push(`Consider splitting large bundles: ${largeBundles.map(b => b.name).join(', ')}`);
    }

    // Check for duplicate dependencies
    const allDeps = bundles.flatMap(bundle => bundle.dependencies);
    const duplicateDeps = allDeps.filter((dep, index) => allDeps.indexOf(dep) !== index);
    if (duplicateDeps.length > 0) {
      suggestions.push(`Remove duplicate dependencies: ${[...new Set(duplicateDeps)].join(', ')}`);
    }

    // Check critical bundle size
    if (metrics.criticalSize > 200 * 1024) { // 200KB
      suggestions.push('Critical bundle size is large, consider code splitting');
    }

    // Check total bundle size
    if (metrics.totalSize > 2 * 1024 * 1024) { // 2MB
      suggestions.push('Total bundle size is large, consider lazy loading');
    }

    return suggestions;
  }

  /**
   * Get bundle report
   */
  getReport(): string {
    const metrics = this.getMetrics();
    const suggestions = this.getOptimizationSuggestions();
    
    return `
Bundle Analysis Report:
======================

Total Size: ${(metrics.totalSize / 1024).toFixed(2)} KB
Gzipped Size: ${metrics.totalGzippedSize ? (metrics.totalGzippedSize / 1024).toFixed(2) : 'N/A'} KB
Critical Size: ${(metrics.criticalSize / 1024).toFixed(2)} KB
Non-Critical Size: ${(metrics.nonCriticalSize / 1024).toFixed(2)} KB
Load Time: ${metrics.loadTime.toFixed(2)} ms
Bundle Count: ${metrics.bundleCount}

Optimization Suggestions:
${suggestions.map(s => `- ${s}`).join('\n')}
    `;
  }
}

/**
 * Code Splitting Manager
 */
export class CodeSplittingManager {
  private chunks: Map<string, () => Promise<any>> = new Map();
  private loadedChunks: Set<string> = new Set();
  private loadingChunks: Set<string> = new Set();

  /**
   * Register a code chunk
   */
  registerChunk(name: string, loader: () => Promise<any>): void {
    this.chunks.set(name, loader);
  }

  /**
   * Load a chunk
   */
  async loadChunk(name: string): Promise<any> {
    if (this.loadedChunks.has(name)) {
      return this.chunks.get(name)!();
    }

    if (this.loadingChunks.has(name)) {
      // Wait for existing load
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.loadedChunks.has(name)) {
            resolve(this.chunks.get(name)!());
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    this.loadingChunks.add(name);

    try {
      const loader = this.chunks.get(name);
      if (!loader) {
        throw new Error(`Chunk ${name} not found`);
      }

      const result = await loader();
      this.loadedChunks.add(name);
      this.loadingChunks.delete(name);
      
      return result;
    } catch (error) {
      this.loadingChunks.delete(name);
      throw error;
    }
  }

  /**
   * Preload a chunk
   */
  preloadChunk(name: string): void {
    if (this.loadedChunks.has(name) || this.loadingChunks.has(name)) {
      return;
    }

    // Preload in idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.loadChunk(name).catch(console.error);
      });
    } else {
      setTimeout(() => {
        this.loadChunk(name).catch(console.error);
      }, 1000);
    }
  }

  /**
   * Get loaded chunks
   */
  getLoadedChunks(): string[] {
    return Array.from(this.loadedChunks);
  }

  /**
   * Get loading chunks
   */
  getLoadingChunks(): string[] {
    return Array.from(this.loadingChunks);
  }
}

/**
 * Tree Shaking Optimizer
 */
export class TreeShakingOptimizer {
  private unusedExports: Set<string> = new Set();
  private usedExports: Set<string> = new Set();

  /**
   * Mark export as used
   */
  markUsed(exportName: string): void {
    this.usedExports.add(exportName);
    this.unusedExports.delete(exportName);
  }

  /**
   * Mark export as unused
   */
  markUnused(exportName: string): void {
    this.unusedExports.add(exportName);
    this.usedExports.delete(exportName);
  }

  /**
   * Get unused exports
   */
  getUnusedExports(): string[] {
    return Array.from(this.unusedExports);
  }

  /**
   * Get used exports
   */
  getUsedExports(): string[] {
    return Array.from(this.usedExports);
  }

  /**
   * Get optimization report
   */
  getReport(): string {
    const unusedCount = this.unusedExports.size;
    const usedCount = this.usedExports.size;
    const totalCount = unusedCount + usedCount;
    const optimizationRatio = totalCount > 0 ? (unusedCount / totalCount) * 100 : 0;

    return `
Tree Shaking Report:
===================

Total Exports: ${totalCount}
Used Exports: ${usedCount}
Unused Exports: ${unusedCount}
Optimization Ratio: ${optimizationRatio.toFixed(2)}%

Unused Exports:
${Array.from(this.unusedExports).map(exp => `- ${exp}`).join('\n')}
    `;
  }
}

/**
 * Bundle Size Monitor
 */
export class BundleSizeMonitor {
  private sizeHistory: Array<{ timestamp: number; size: number }> = [];
  private maxHistorySize = 100;

  /**
   * Record bundle size
   */
  recordSize(size: number): void {
    this.sizeHistory.push({
      timestamp: Date.now(),
      size
    });

    // Keep only recent history
    if (this.sizeHistory.length > this.maxHistorySize) {
      this.sizeHistory.shift();
    }
  }

  /**
   * Get size trend
   */
  getSizeTrend(): 'increasing' | 'decreasing' | 'stable' {
    if (this.sizeHistory.length < 2) {
      return 'stable';
    }

    const recent = this.sizeHistory.slice(-5);
    const older = this.sizeHistory.slice(-10, -5);

    if (older.length === 0) {
      return 'stable';
    }

    const recentAvg = recent.reduce((sum, item) => sum + item.size, 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + item.size, 0) / older.length;

    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (changePercent > 5) {
      return 'increasing';
    } else if (changePercent < -5) {
      return 'decreasing';
    } else {
      return 'stable';
    }
  }

  /**
   * Get size statistics
   */
  getSizeStats() {
    if (this.sizeHistory.length === 0) {
      return null;
    }

    const sizes = this.sizeHistory.map(item => item.size);
    const sorted = [...sizes].sort((a, b) => a - b);

    return {
      current: sizes[sizes.length - 1],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sizes.reduce((sum, size) => sum + size, 0) / sizes.length,
      median: sorted[Math.floor(sorted.length / 2)],
      trend: this.getSizeTrend()
    };
  }
}

/**
 * Dynamic Import Manager
 */
export class DynamicImportManager {
  private imports: Map<string, Promise<any>> = new Map();
  private cache: Map<string, any> = new Map();

  /**
   * Dynamic import with caching
   */
  async dynamicImport<T>(modulePath: string): Promise<T> {
    // Check cache first
    if (this.cache.has(modulePath)) {
      return this.cache.get(modulePath);
    }

    // Check if already importing
    if (this.imports.has(modulePath)) {
      return this.imports.get(modulePath);
    }

    // Start new import
    const importPromise = import(modulePath).then(module => {
      this.cache.set(modulePath, module);
      this.imports.delete(modulePath);
      return module;
    }).catch(error => {
      this.imports.delete(modulePath);
      throw error;
    });

    this.imports.set(modulePath, importPromise);
    return importPromise;
  }

  /**
   * Preload module
   */
  preloadModule(modulePath: string): void {
    if (this.cache.has(modulePath) || this.imports.has(modulePath)) {
      return;
    }

    this.dynamicImport(modulePath).catch(console.error);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return {
      cachedModules: this.cache.size,
      loadingModules: this.imports.size,
      totalModules: this.cache.size + this.imports.size
    };
  }
}

/**
 * Bundle Optimization Manager
 */
export class BundleOptimizationManager {
  private analyzer: BundleAnalyzer;
  private codeSplitting: CodeSplittingManager;
  private treeShaking: TreeShakingOptimizer;
  private sizeMonitor: BundleSizeMonitor;
  private dynamicImport: DynamicImportManager;

  constructor() {
    this.analyzer = new BundleAnalyzer();
    this.codeSplitting = new CodeSplittingManager();
    this.treeShaking = new TreeShakingOptimizer();
    this.sizeMonitor = new BundleSizeMonitor();
    this.dynamicImport = new DynamicImportManager();
  }

  /**
   * Get comprehensive optimization report
   */
  getOptimizationReport(): string {
    const bundleReport = this.analyzer.getReport();
    const treeShakingReport = this.treeShaking.getReport();
    const sizeStats = this.sizeMonitor.getSizeStats();
    const cacheStats = this.dynamicImport.getCacheStats();

    return `
Son1kVerse Bundle Optimization Report:
=====================================

${bundleReport}

${treeShakingReport}

Size Statistics:
${sizeStats ? `
Current Size: ${(sizeStats.current / 1024).toFixed(2)} KB
Min Size: ${(sizeStats.min / 1024).toFixed(2)} KB
Max Size: ${(sizeStats.max / 1024).toFixed(2)} KB
Average Size: ${(sizeStats.avg / 1024).toFixed(2)} KB
Trend: ${sizeStats.trend}
` : 'No size data available'}

Dynamic Import Cache:
Cached Modules: ${cacheStats.cachedModules}
Loading Modules: ${cacheStats.loadingModules}
Total Modules: ${cacheStats.totalModules}
    `;
  }

  /**
   * Get all managers
   */
  getManagers() {
    return {
      analyzer: this.analyzer,
      codeSplitting: this.codeSplitting,
      treeShaking: this.treeShaking,
      sizeMonitor: this.sizeMonitor,
      dynamicImport: this.dynamicImport
    };
  }
}

// Exportar instancia global del optimization manager
export const globalBundleOptimizer = new BundleOptimizationManager();

// Exportar utilidades principales
export {
  BundleAnalyzer,
  CodeSplittingManager,
  TreeShakingOptimizer,
  BundleSizeMonitor,
  DynamicImportManager,
  BundleOptimizationManager
};