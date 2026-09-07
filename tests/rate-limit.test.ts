import { describe, expect, it } from "vitest";
import { checkRateLimit, rateLimitConfig } from "../lib/rate-limit";

describe("login rate limiting", () => {
  it("allows the configured attempts and rejects the next one", () => {
    const request = () =>
      new Request("http://localhost/api/auth/login", {
        headers: { "x-forwarded-for": `test-${crypto.randomUUID()}` },
      });
    for (let attempt = 0; attempt < rateLimitConfig.maxAttempts; attempt += 1)
      expect(checkRateLimit(request(), "test").allowed).toBe(true);

    const address = `test-${crypto.randomUUID()}`;
    const limitedRequest = () =>
      new Request("http://localhost/api/auth/login", {
        headers: { "x-forwarded-for": address },
      });
    for (let attempt = 0; attempt < rateLimitConfig.maxAttempts; attempt += 1)
      checkRateLimit(limitedRequest(), "test");
    const result = checkRateLimit(limitedRequest(), "test");
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });
});
