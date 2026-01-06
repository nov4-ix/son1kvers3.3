/**
 * Robust Polling Service for Son1kVers3
 * Features:
 * - Tolerant polling (doesn't fail on "unknown" or "running")
 * - Response normalization
 * - Intelligent retries
 * - Configurable timeouts
 */

export interface PollingConfig {
    maxAttempts?: number;
    intervalMs?: number;
    timeoutMs?: number;
    onProgress?: (status: string, attempt: number) => void;
}

export interface GenerationStatus {
    status: 'pending' | 'running' | 'complete' | 'failed' | 'unknown';
    audioUrl?: string | null;
    error?: string;
    progress?: number;
}

const DEFAULT_CONFIG: Required<PollingConfig> = {
    maxAttempts: 120, // 10 minutes at 5s intervals
    intervalMs: 5000,
    timeoutMs: 600000, // 10 minutes total
    onProgress: () => { },
};

/**
 * Normalize various API response formats to a standard format
 */
function normalizeResponse(data: any): GenerationStatus {
    // Handle different response formats from Suno/backend
    const status = data.status || data.state || 'unknown';
    const audioUrl = data.audioUrl || data.audio_url || data.url || null;
    const error = data.error || data.message || null;

    // Map different status values to our standard ones
    const normalizedStatus = (() => {
        const s = status.toLowerCase();
        if (s === 'complete' || s === 'completed' || s === 'success' || s === 'done') {
            return 'complete';
        }
        if (s === 'failed' || s === 'error' || s === 'errored') {
            return 'failed';
        }
        if (s === 'running' || s === 'processing' || s === 'in_progress' || s === 'queued') {
            return 'running';
        }
        if (s === 'pending') {
            return 'pending';
        }
        return 'unknown';
    })();

    return {
        status: normalizedStatus,
        audioUrl,
        error,
        progress: data.progress,
    };
}

/**
 * Poll for generation status with robust error handling
 */
export async function pollGenerationStatus(
    generationId: string,
    config: PollingConfig = {}
): Promise<GenerationStatus> {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    let attempts = 0;
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
        const checkStatus = async () => {
            attempts++;

            // Check timeout
            if (Date.now() - startTime > finalConfig.timeoutMs) {
                reject(new Error('Timeout: Generation took too long'));
                return;
            }

            // Check max attempts
            if (attempts > finalConfig.maxAttempts) {
                reject(new Error('Max attempts reached'));
                return;
            }

            try {
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://sub-son1k-2-2.fly.dev';
                const response = await fetch(`${BACKEND_URL}/api/generation/${generationId}/status`);

                if (!response.ok) {
                    // Don't fail immediately on HTTP errors, retry
                    console.warn(`HTTP ${response.status} on attempt ${attempts}, retrying...`);
                    setTimeout(checkStatus, finalConfig.intervalMs);
                    return;
                }

                const data = await response.json();
                const normalized = normalizeResponse(data.success ? data : { status: 'unknown' });

                // Call progress callback
                finalConfig.onProgress(normalized.status, attempts);

                // Handle different statuses
                switch (normalized.status) {
                    case 'complete':
                        if (normalized.audioUrl) {
                            resolve(normalized);
                        } else {
                            // Complete but no audio URL - keep polling
                            console.warn('Status complete but no audio URL, retrying...');
                            setTimeout(checkStatus, finalConfig.intervalMs);
                        }
                        break;

                    case 'failed':
                        reject(new Error(normalized.error || 'Generation failed'));
                        break;

                    case 'running':
                    case 'pending':
                    case 'unknown':
                        // Continue polling for these statuses
                        setTimeout(checkStatus, finalConfig.intervalMs);
                        break;

                    default:
                        // Unknown status - don't fail, keep polling
                        setTimeout(checkStatus, finalConfig.intervalMs);
                }
            } catch (error) {
                // Don't fail on fetch errors, just retry
                console.warn(`Fetch error on attempt ${attempts}:`, error);

                // Only fail if we've tried many times and keep getting errors
                if (attempts > finalConfig.maxAttempts / 2) {
                    reject(error);
                } else {
                    setTimeout(checkStatus, finalConfig.intervalMs);
                }
            }
        };

        // Start polling after a brief delay
        setTimeout(checkStatus, 3000);
    });
}

/**
 * Start a generation and poll for completion
 */
export async function generateAndPoll(
    prompt: string,
    options: {
        instrumental?: boolean;
        boost?: boolean;
        userId?: string;
    } = {},
    pollingConfig: PollingConfig = {}
): Promise<GenerationStatus> {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://sub-son1k-2-2.fly.dev';

    // Start generation
    const response = await fetch(`${BACKEND_URL}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: options.userId,
            prompt,
            make_instrumental: options.instrumental || false,
            boost: options.boost || false,
            wait_audio: false,
        }),
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('NO_TOKENS_AVAILABLE');
        }
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
    }

    const data = await response.json();

    if (!data.success || !data.generationId) {
        throw new Error('Failed to start generation');
    }

    // Poll for completion
    return pollGenerationStatus(data.generationId, pollingConfig);
}

/**
 * Hook for React components
 */
export function useRobustGeneration() {
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [progress, setProgress] = React.useState<string>('');
    const [result, setResult] = React.useState<GenerationStatus | null>(null);
    const [error, setError] = React.useState<Error | null>(null);

    const generate = async (
        prompt: string,
        options?: {
            instrumental?: boolean;
            boost?: boolean;
            userId?: string;
        }
    ) => {
        setIsGenerating(true);
        setError(null);
        setResult(null);
        setProgress('Starting...');

        try {
            const status = await generateAndPoll(prompt, options, {
                onProgress: (status, attempt) => {
                    setProgress(`${status} (attempt ${attempt})`);
                },
            });

            setResult(status);
            setProgress('Complete!');
        } catch (err) {
            setError(err as Error);
            setProgress('Failed');
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        generate,
        isGenerating,
        progress,
        result,
        error,
    };
}

// For non-React usage
export const robustPolling = {
    pollGenerationStatus,
    generateAndPoll,
    normalizeResponse,
};
