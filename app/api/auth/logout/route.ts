import { NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/auth";
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(sessionCookieName());
  return response;
}
export async function GET() {
  const response = NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  );
  response.cookies.delete(sessionCookieName());
  return response;
}
