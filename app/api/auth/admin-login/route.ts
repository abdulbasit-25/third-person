import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sessionCookie, signSession, verifyPassword } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/schemas";
export async function POST(request: Request) {
  const limit = checkRateLimit(request, "admin-login");
  if (!limit.allowed)
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter) },
      },
    );
  try {
    const input = loginSchema.parse(await request.json());
    const user = await (await getDb())
      .collection("user")
      .findOne({ username: input.username.toLowerCase(), role: "admin" });
    if (!user || !(await verifyPassword(input.password, user.passwordHash)))
      return NextResponse.json(
        { error: "Admin credentials are incorrect." },
        { status: 401 },
      );
    const response = NextResponse.json({
      id: user._id.toString(),
      displayName: user.displayName,
      role: "admin",
    });
    response.cookies.set(
      sessionCookie(signSession({ sub: user._id.toString(), role: "admin" })),
    );
    return response;
  } catch {
    return NextResponse.json(
      { error: "Please enter valid admin credentials." },
      { status: 400 },
    );
  }
}
