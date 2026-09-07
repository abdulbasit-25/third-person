import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sessionCookie, signSession, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await (await getDb())
      .collection("third-person")
      .findOne({ username: input.username.toLowerCase(), role: "reviewer" });
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
          role: "reviewer",
          status: user.status,
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
