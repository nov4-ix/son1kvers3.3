import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scheduler } from '@/lib/jobRunner';
import { autoPublisherEngine } from '@/engine/autoPublisher';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          lte: vi.fn(() => ({
            order: vi.fn(() => ({
              data: [
                {
                  id: '1',
                  user_id: 'user1',
                  title: 'Test Post',
                  caption: 'Test content',
                  platform: 'instagram',
                  network: 'instagram',
                  scheduled_time: new Date(Date.now() - 1000).toISOString(),
                  status: 'pending',
                },
              ],
              error: null,
            })),
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: { id: '1', status: 'published' },
          error: null,
        })),
      })),
    })),
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Scheduler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    scheduler.stop();
  });

  it('should start and stop scheduler', () => {
    expect(scheduler.getStatus().running).toBe(false);
    
    scheduler.start('user1');
    expect(scheduler.getStatus().running).toBe(true);
    
    scheduler.stop();
    expect(scheduler.getStatus().running).toBe(false);
  });

  it('should track scheduler statistics', async () => {
    scheduler.start('user1');
    
    // Wait for scheduler to run
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const status = scheduler.getStatus();
    expect(status.stats.totalRuns).toBeGreaterThan(0);
    
    scheduler.stop();
  });

  it('should handle manual job execution', async () => {
    const result = await scheduler.runJobManually();
    
    expect(result.success).toBe(true);
    expect(result.result).toBeDefined();
  });

  it('should update configuration', () => {
    const initialInterval = scheduler.getStatus().intervalMs;
    
    scheduler.updateConfig({ intervalMs: 60000 });
    
    expect(scheduler.getStatus().intervalMs).toBe(60000);
    
    // Reset
    scheduler.updateConfig({ intervalMs: initialInterval });
  });

  it('should reset statistics', () => {
    scheduler.start('user1');
    scheduler.resetStats();
    
    const status = scheduler.getStatus();
    expect(status.stats.totalRuns).toBe(0);
    expect(status.stats.successfulRuns).toBe(0);
    expect(status.stats.failedRuns).toBe(0);
    
    scheduler.stop();
  });
});

describe('Auto Publisher Engine', () => {
  it('should have correct publishers registered', () => {
    const status = autoPublisherEngine.getStatus();
    
    expect(status.publishers).toContain('instagram');
    expect(status.publishers).toContain('twitter');
    expect(status.publishers).toContain('facebook');
  });

  it('should publish post manually', async () => {
    const result = await autoPublisherEngine.publishPostManually('post1');
    
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('error');
  });

  it('should run auto publisher', async () => {
    const result = await autoPublisherEngine.runAutoPublisher();
    
    expect(result).toHaveProperty('processed');
    expect(result).toHaveProperty('published');
    expect(result).toHaveProperty('failed');
    expect(typeof result.processed).toBe('number');
    expect(typeof result.published).toBe('number');
    expect(typeof result.failed).toBe('number');
  });
});
