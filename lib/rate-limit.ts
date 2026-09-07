type Attempt = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, Attempt>();

function getClientKey(request: Request, scope: string) {
  const forwarded = request.headers.get("x-forwarded-for");
  const address = forwarded?.split(",")[0]?.trim() || "unknown";
  return `${scope}:${address}`;
}

export function checkRateLimit(request: Request, scope: string) {
  const key = getClientKey(request, scope);
  const now = Date.now();
  const existing = attempts.get(key);

  if (!existing || existing.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export const rateLimitConfig = {
  windowMinutes: WINDOW_MS / 60000,
  maxAttempts: MAX_ATTEMPTS,
};
