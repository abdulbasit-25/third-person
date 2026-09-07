import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sessionCookie, signSession, verifyPassword } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const limit = checkRateLimit(request, "reviewer-login");
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
      .findOne({ username: input.username.toLowerCase() });
    if (!user || !(await verifyPassword(input.password, user.passwordHash)))
      return NextResponse.json(
        { error: "Username or password is incorrect." },
        { status: 401 },
      );
    const response = NextResponse.json({
      id: user._id.toString(),
      displayName: user.displayName,
      role: user.role,
      status: user.status,
    });
    response.cookies.set(
      sessionCookie(
        signSession({
          sub: user._id.toString(),
          role: user.role,
          ...(user.role === "reviewer" ? { status: user.status } : {}),
        }),
      ),
    );
    return response;
  } catch {
    return NextResponse.json(
      { error: "Please enter a valid username and password." },
      { status: 400 },
    );
  }
}
