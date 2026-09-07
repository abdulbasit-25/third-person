import { beforeAll, describe, expect, it } from "vitest";
import { readSession, signSession } from "../lib/auth";

beforeAll(() => {
  process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/test";
  process.env.JWT_SECRET = "test-secret-that-is-at-least-32-characters-long";
});

describe("session tokens", () => {
  it("round-trips a signed reviewer session", () => {
    const token = signSession({
      sub: "507f1f77bcf86cd799439011",
      role: "reviewer",
      status: "student",
    });
    expect(readSession(token)).toMatchObject({
      sub: "507f1f77bcf86cd799439011",
      role: "reviewer",
      status: "student",
    });
  });

  it("rejects missing and invalid tokens", () => {
    expect(readSession()).toBeNull();
    expect(readSession("not-a-jwt")).toBeNull();
  });
});
