// apps/ghost-studio/src/lib/api/polling.ts
export function startPolling<T>(fn: () => Promise<T>, onTick: (r: T) => void, opts: { intervalMs?: number; timeoutMs?: number } = {}) {
  const intervalMs = opts.intervalMs ?? 5000;
  const timeoutMs = opts.timeoutMs ?? 300000;
  let stopped = false;
  const start = Date.now();

  const loop = async () => {
    if (stopped) return;
    const res = await fn();
    onTick(res);
    if (!stopped && Date.now() - start < timeoutMs) setTimeout(loop, intervalMs);
  };
  loop();

  return () => { stopped = true; };
}
