// Analytics System - Sistema de analytics y métricas del universo Son1kVerse

export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: number;
  events: AnalyticsEvent[];
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  memoryUsage?: number;
  networkLatency?: number;
}

/**
 * Analytics Manager
 */
export class AnalyticsManager {
  private events: AnalyticsEvent[] = [];
  private currentSession: UserSession;
  private userId?: string;
  private isEnabled: boolean = true;
  private batchSize: number = 10;
  private flushInterval: number = 30000; // 30 seconds
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.currentSession = this.createSession();
    this.startFlushTimer();
    this.initializePerformanceTracking();
  }

  /**
   * Track an event
   */
  track(
    name: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name,
      category,
      action,
      label,
      value,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.currentSession.id
    };

    this.events.push(event);
    this.currentSession.events.push(event);

    // Send immediately for critical events
    if (this.isCriticalEvent(category, action)) {
      this.flush();
    }
  }

  /**
   * Track page view
   */
  trackPageView(page: string, title?: string): void {
    this.track('page_view', 'navigation', 'view', page, undefined, {
      page,
      title: title || document.title,
      url: window.location.href,
      referrer: document.referrer
    });

    this.currentSession.pageViews++;
  }

  /**
   * Track user interaction
   */
  trackInteraction(
    element: string,
    action: string,
    properties?: Record<string, any>
  ): void {
    this.track('user_interaction', 'engagement', action, element, undefined, {
      element,
      ...properties
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metrics: PerformanceMetrics): void {
    this.track('performance', 'technical', 'metrics', undefined, undefined, metrics);
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.track('error', 'technical', 'occurred', error.name, undefined, {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }

  /**
   * Track conversion
   */
  trackConversion(
    goal: string,
    value?: number,
    properties?: Record<string, any>
  ): void {
    this.track('conversion', 'business', 'achieved', goal, value, properties);
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
    this.currentSession.userId = userId;
  }

  /**
   * Enable/disable analytics
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Get current session
   */
  getCurrentSession(): UserSession {
    return { ...this.currentSession };
  }

  /**
   * Get all events
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Flush events to server
   */
  async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = this.events.splice(0, this.batchSize);
    
    try {
      await this.sendToAnalyticsService(eventsToSend);
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-add events to queue for retry
      this.events.unshift(...eventsToSend);
    }
  }

  /**
   * Create new session
   */
  private createSession(): UserSession {
    const sessionId = this.generateSessionId();
    const startTime = Date.now();

    return {
      id: sessionId,
      startTime,
      pageViews: 0,
      events: [],
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      ...this.extractUTMParameters()
    };
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Extract UTM parameters from URL
   */
  private extractUTMParameters(): Record<string, string> {
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined
    };
  }

  /**
   * Check if event is critical
   */
  private isCriticalEvent(category: string, action: string): boolean {
    const criticalEvents = [
      { category: 'business', action: 'purchase' },
      { category: 'business', action: 'signup' },
      { category: 'technical', action: 'error' }
    ];

    return criticalEvents.some(
      event => event.category === category && event.action === action
    );
  }

  /**
   * Start flush timer
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Initialize performance tracking
   */
  private initializePerformanceTracking(): void {
    if (typeof window === 'undefined') return;

    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const metrics = this.collectPerformanceMetrics();
        this.trackPerformance(metrics);
      }, 0);
    });

    // Track Core Web Vitals
    this.trackCoreWebVitals();
  }

  /**
   * Collect performance metrics
   */
  private collectPerformanceMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstContentfulPaint: this.getFirstContentfulPaint(),
      largestContentfulPaint: this.getLargestContentfulPaint(),
      firstInputDelay: this.getFirstInputDelay(),
      cumulativeLayoutShift: this.getCumulativeLayoutShift(),
      memoryUsage: this.getMemoryUsage(),
      networkLatency: this.getNetworkLatency()
    };
  }

  /**
   * Track Core Web Vitals
   */
  private trackCoreWebVitals(): void {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.track('core_web_vitals', 'performance', 'fcp', undefined, entry.startTime);
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  /**
   * Get First Contentful Paint
   */
  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : 0;
  }

  /**
   * Get Largest Contentful Paint
   */
  private getLargestContentfulPaint(): number {
    // Simplified implementation
    return 0;
  }

  /**
   * Get First Input Delay
   */
  private getFirstInputDelay(): number {
    // Simplified implementation
    return 0;
  }

  /**
   * Get Cumulative Layout Shift
   */
  private getCumulativeLayoutShift(): number {
    // Simplified implementation
    return 0;
  }

  /**
   * Get memory usage
   */
  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  /**
   * Get network latency
   */
  private getNetworkLatency(): number | undefined {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigation.responseEnd - navigation.requestStart;
  }

  /**
   * Send events to analytics service
   */
  private async sendToAnalyticsService(events: AnalyticsEvent[]): Promise<void> {
    // En un entorno real, esto enviaría a Google Analytics, Mixpanel, etc.
    console.log('Sending analytics events:', events);
    
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        events,
        session: this.currentSession,
        timestamp: Date.now()
      })
    });
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    // End current session
    this.currentSession.endTime = Date.now();
    this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
    
    // Send final flush
    this.flush();
  }
}

/**
 * Analytics Hook para React
 */
export function useAnalytics() {
  const analyticsManager = React.useMemo(() => new AnalyticsManager(), []);

  const track = React.useCallback((
    name: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ) => {
    analyticsManager.track(name, category, action, label, value, properties);
  }, [analyticsManager]);

  const trackPageView = React.useCallback((page: string, title?: string) => {
    analyticsManager.trackPageView(page, title);
  }, [analyticsManager]);

  const trackInteraction = React.useCallback((
    element: string,
    action: string,
    properties?: Record<string, any>
  ) => {
    analyticsManager.trackInteraction(element, action, properties);
  }, [analyticsManager]);

  const trackError = React.useCallback((error: Error, context?: Record<string, any>) => {
    analyticsManager.trackError(error, context);
  }, [analyticsManager]);

  const trackConversion = React.useCallback((
    goal: string,
    value?: number,
    properties?: Record<string, any>
  ) => {
    analyticsManager.trackConversion(goal, value, properties);
  }, [analyticsManager]);

  React.useEffect(() => {
    return () => {
      analyticsManager.destroy();
    };
  }, [analyticsManager]);

  return {
    track,
    trackPageView,
    trackInteraction,
    trackError,
    trackConversion,
    analyticsManager
  };
}

/**
 * Analytics Provider para React Context
 */
export const AnalyticsContext = React.createContext<AnalyticsManager | null>(null);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const analyticsManager = React.useMemo(() => new AnalyticsManager(), []);

  React.useEffect(() => {
    return () => {
      analyticsManager.destroy();
    };
  }, [analyticsManager]);

  return (
    <AnalyticsContext.Provider value={analyticsManager}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Hook para usar analytics desde context
 */
export function useAnalyticsContext() {
  const analyticsManager = React.useContext(AnalyticsContext);
  
  if (!analyticsManager) {
    throw new Error('useAnalyticsContext must be used within AnalyticsProvider');
  }
  
  return analyticsManager;
}

/**
 * Higher-order component para tracking de páginas
 */
export function withPageTracking<P extends object>(
  Component: React.ComponentType<P>,
  pageName: string
) {
  return function TrackedComponent(props: P) {
    const { trackPageView } = useAnalytics();

    React.useEffect(() => {
      trackPageView(pageName);
    }, [trackPageView]);

    return <Component {...props} />;
  };
}

/**
 * Higher-order component para tracking de errores
 */
export function withErrorTracking<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ErrorTrackedComponent(props: P) {
    const { trackError } = useAnalytics();

    React.useEffect(() => {
      const handleError = (event: ErrorEvent) => {
        trackError(new Error(event.message), {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        trackError(new Error(event.reason), {
          type: 'unhandledRejection'
        });
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }, [trackError]);

    return <Component {...props} />;
  };
}

// Exportar instancia global del analytics manager
export const globalAnalyticsManager = new AnalyticsManager();

// Exportar utilidades principales
export {
  AnalyticsManager,
  useAnalytics,
  AnalyticsProvider,
  useAnalyticsContext,
  withPageTracking,
  withErrorTracking
};