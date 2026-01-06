/**
 * Son1kVers3 Services
 * Exports all core services for music generation
 */

// Polling Service
export {
    pollGenerationStatus,
    generateAndPoll,
    robustPolling,
    useRobustGeneration,
    type PollingConfig,
    type GenerationStatus,
} from './polling/robustPolling';

// Token Management
export {
    getTokenManager,
    tokenManager,
    useTokenManager,
    type Token,
    type TokenPool,
} from './tokens/tokenManager';

/**
 * Combined hook for complete generation flow
 * Uses both token management and robust polling
 */
export function useCompleteMusicGeneration() {
    const { requestToken, hasTokens, stats } = useTokenManager();
    const { generate, isGenerating, progress, result, error } = useRobustGeneration();

    const generateMusic = async (
        prompt: string,
        options?: {
            instrumental?: boolean;
            boost?: boolean;
        }
    ) => {
        // Request token from pool
        const token = await requestToken();

        if (!token) {
            throw new Error('NO_TOKENS_AVAILABLE');
        }

        // Generate with token
        return generate(prompt, {
            ...options,
            userId: `token_${token.substring(0, 8)}`, // Use token prefix as userId
        });
    };

    return {
        generateMusic,
        isGenerating,
        progress,
        result,
        error,
        hasTokens,
        tokenStats: stats,
    };
}
