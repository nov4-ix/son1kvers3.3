/**
 * Collaborative Token Management Service for Son1kVers3
 * Features:
 * - Token pooling from Chrome Extension
 * - Automatic token rotation
 * - Health checking
 * - Fair distribution
 * - Fallback strategies
 */

export interface Token {
    id: string;
    value: string;
    source: 'extension' | 'user' | 'system';
    healthStatus: 'healthy' | 'rate_limited' | 'invalid' | 'unknown';
    lastUsed: number;
    useCount: number;
    userId?: string;
}

export interface TokenPool {
    tokens: Token[];
    nextRotation: number;
}

class TokenManager {
    private pool: TokenPool = {
        tokens: [],
        nextRotation: 0,
    };

    private readonly ROTATION_INTERVAL = 5000; // Rotate every 5 seconds
    private readonly MAX_USE_COUNT = 10; // Max uses before health check
    private readonly HEALTH_CHECK_INTERVAL = 60000; // 1 minute

    constructor() {
        this.startHealthCheckLoop();
        this.listenForExtensionTokens();
    }

    /**
     * Listen for tokens from Chrome Extension
     */
    private listenForExtensionTokens() {
        window.addEventListener('message', (event) => {
            if (event.data.type === 'SON1K_TOKEN_SHARE') {
                const { token, userId } = event.data;
                this.addToken({
                    id: `ext_${Date.now()}_${Math.random()}`,
                    value: token,
                    source: 'extension',
                    healthStatus: 'unknown',
                    lastUsed: 0,
                    useCount: 0,
                    userId,
                });
                console.log('[TokenManager] Token received from extension');
            }
        });

        // Request tokens from extension on load
        window.postMessage({ type: 'SON1K_REQUEST_TOKENS' }, '*');
    }

    /**
     * Add token to pool
     */
    addToken(token: Token) {
        // Don't add duplicates
        if (this.pool.tokens.some(t => t.value === token.value)) {
            return;
        }

        this.pool.tokens.push(token);
        console.log(`[TokenManager] Added token from ${token.source}, pool size: ${this.pool.tokens.length}`);
    }

    /**
     * Get next available token using round-robin
     */
    async getToken(): Promise<string | null> {
        if (this.pool.tokens.length === 0) {
            console.warn('[TokenManager] No tokens available in pool');
            return null;
        }

        // Filter healthy tokens
        const healthyTokens = this.pool.tokens.filter(
            t => t.healthStatus === 'healthy' || t.healthStatus === 'unknown'
        );

        if (healthyTokens.length === 0) {
            console.warn('[TokenManager] No healthy tokens available');
            // Try to use any token as last resort
            const anyToken = this.pool.tokens[0];
            return anyToken?.value || null;
        }

        // Get next token using round-robin
        const now = Date.now();
        if (now >= this.pool.nextRotation) {
            // Rotate to next token
            const token = healthyTokens[0];
            token.lastUsed = now;
            token.useCount++;
            this.pool.nextRotation = now + this.ROTATION_INTERVAL;

            // Move to end for round-robin
            this.pool.tokens = [
                ...this.pool.tokens.filter(t => t.id !== token.id),
                token,
            ];

            // Schedule health check if used too much
            if (token.useCount >= this.MAX_USE_COUNT) {
                this.checkTokenHealth(token);
            }

            return token.value;
        }

        // Return most recently used token (within rotation window)
        const recentToken = healthyTokens.find(t => t.lastUsed === Math.max(...healthyTokens.map(t => t.lastUsed)));
        return recentToken?.value || healthyTokens[0]?.value || null;
    }

    /**
     * Check token health
     */
    private async checkTokenHealth(token: Token) {
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://sub-son1k-2-2.fly.dev';
            const response = await fetch(`${BACKEND_URL}/api/token/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token.value }),
            });

            if (response.ok) {
                token.healthStatus = 'healthy';
                token.useCount = 0;
            } else if (response.status === 429) {
                token.healthStatus = 'rate_limited';
            } else {
                token.healthStatus = 'invalid';
            }
        } catch (error) {
            console.error('[TokenManager] Health check failed:', error);
            token.healthStatus = 'unknown';
        }
    }

    /**
     * Start periodic health checks
     */
    private startHealthCheckLoop() {
        setInterval(() => {
            this.pool.tokens.forEach(token => {
                if (token.healthStatus === 'rate_limited' || token.useCount >= this.MAX_USE_COUNT) {
                    this.checkTokenHealth(token);
                }
            });
        }, this.HEALTH_CHECK_INTERVAL);
    }

    /**
     * Remove invalid tokens
     */
    private cleanupTokens() {
        const before = this.pool.tokens.length;
        this.pool.tokens = this.pool.tokens.filter(
            t => t.healthStatus !== 'invalid'
        );
        const removed = before - this.pool.tokens.length;
        if (removed > 0) {
            console.log(`[TokenManager] Removed ${removed} invalid tokens`);
        }
    }

    /**
     * Get pool statistics
     */
    getStats() {
        return {
            total: this.pool.tokens.length,
            healthy: this.pool.tokens.filter(t => t.healthStatus === 'healthy').length,
            rateLimited: this.pool.tokens.filter(t => t.healthStatus === 'rate_limited').length,
            invalid: this.pool.tokens.filter(t => t.healthStatus === 'invalid').length,
            unknown: this.pool.tokens.filter(t => t.healthStatus === 'unknown').length,
            bySource: {
                extension: this.pool.tokens.filter(t => t.source === 'extension').length,
                user: this.pool.tokens.filter(t => t.source === 'user').length,
                system: this.pool.tokens.filter(t => t.source === 'system').length,
            },
        };
    }

    /**
     * Request token from backend fallback
     */
    async requestFallbackToken(): Promise<string | null> {
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://sub-son1k-2-2.fly.dev';
            const response = await fetch(`${BACKEND_URL}/api/token/request`, {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    this.addToken({
                        id: `fallback_${Date.now()}`,
                        value: data.token,
                        source: 'system',
                        healthStatus: 'healthy',
                        lastUsed: 0,
                        useCount: 0,
                    });
                    return data.token;
                }
            }
        } catch (error) {
            console.error('[TokenManager] Fallback token request failed:', error);
        }
        return null;
    }
}

// Singleton instance
let tokenManagerInstance: TokenManager | null = null;

export function getTokenManager(): TokenManager {
    if (!tokenManagerInstance) {
        tokenManagerInstance = new TokenManager();
    }
    return tokenManagerInstance;
}

/**
 * React hook for token management
 */
export function useTokenManager() {
    const [stats, setStats] = React.useState({ total: 0, healthy: 0, rateLimited: 0, invalid: 0, unknown: 0, bySource: { extension: 0, user: 0, system: 0 } });
    const [hasTokens, setHasTokens] = React.useState(false);

    React.useEffect(() => {
        const manager = getTokenManager();

        const interval = setInterval(() => {
            const newStats = manager.getStats();
            setStats(newStats);
            setHasTokens(newStats.total > 0);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const requestToken = async () => {
        const manager = getTokenManager();
        let token = await manager.getToken();

        // If no token, try fallback
        if (!token) {
            token = await manager.requestFallbackToken();
        }

        return token;
    };

    return {
        stats,
        hasTokens,
        requestToken,
    };
}

// Export singleton
export const tokenManager = {
    get: getTokenManager,
    useTokenManager,
};
