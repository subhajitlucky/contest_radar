type FetchInput = Parameters<typeof fetch>[0];
type FetchInit = Parameters<typeof fetch>[1];

export type FetchRetryOptions = {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
};

const DEFAULTS: Required<FetchRetryOptions> = {
  retries: 1,
  baseDelayMs: 500,
  maxDelayMs: 5000,
  timeoutMs: 12000,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseRetryAfter(value: string | null, now = Date.now()): number | null {
  if (!value) return null;

  const seconds = Number(value);
  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000);
  }

  const timestamp = Date.parse(value);
  if (Number.isFinite(timestamp)) {
    return Math.max(0, timestamp - now);
  }

  return null;
}

export async function fetchWithRetry(
  input: FetchInput,
  init: FetchInit = {},
  options: FetchRetryOptions = {},
): Promise<Response> {
  const config = { ...DEFAULTS, ...options };
  let attempt = 0;

  while (true) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const response = await fetch(input, { ...init, signal: controller.signal });
      const retryable = response.status === 429 || response.status >= 500;

      if (!retryable || attempt >= config.retries) {
        return response;
      }

      const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
      const delay = Math.min(
        config.maxDelayMs,
        retryAfter ?? config.baseDelayMs * 2 ** attempt,
      );

      await response.body?.cancel().catch(() => undefined);
      await sleep(delay);
    } catch (error) {
      if (attempt >= config.retries) {
        throw error;
      }

      await sleep(Math.min(config.maxDelayMs, config.baseDelayMs * 2 ** attempt));
    } finally {
      clearTimeout(timer);
    }

    attempt += 1;
  }
}
