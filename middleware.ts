import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/dashboard") && !path.startsWith("/review"))
    return NextResponse.next();
  const session = readSession(request.cookies.get("mirror_session")?.value);
  if (path.startsWith("/review") && (!session || session.role !== "reviewer"))
    return NextResponse.redirect(new URL("/login", request.url));
  if (path.startsWith("/dashboard") && (!session || session.role !== "admin"))
    return NextResponse.redirect(new URL("/admin-login", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/review/:path*"] };
