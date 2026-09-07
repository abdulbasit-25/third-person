import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getEnv } from "./env";
export type Role = "admin" | "reviewer";
export type Session = {
  sub: string;
  role: Role;
  status?: "student" | "teacher";
};
const COOKIE = "mirror_session";
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
export function signSession(session: Session) {
  return jwt.sign(session, getEnv().JWT_SECRET, { expiresIn: "7d" });
}
export function readSession(token?: string) {
  if (!token) return null;
  try {
    return jwt.verify(token, getEnv().JWT_SECRET) as Session;
  } catch {
    return null;
  }
}
export async function verifySession(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(getEnv().JWT_SECRET),
    );
    if (
      typeof payload.sub !== "string" ||
      (payload.role !== "admin" && payload.role !== "reviewer")
    )
      return null;
    return {
      sub: payload.sub,
      role: payload.role,
      ...(payload.status === "student" || payload.status === "teacher"
        ? { status: payload.status }
        : {}),
    } as Session;
  } catch {
    return null;
  }
}
export async function getSession() {
  return readSession((await cookies()).get(COOKIE)?.value);
}
export function sessionCookie(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
export function sessionCookieName() {
  return COOKIE;
}
