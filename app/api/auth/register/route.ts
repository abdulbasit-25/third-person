import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { hashPassword, sessionCookie, signSession } from "@/lib/auth";
import { registerSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const db = await getDb();
    const username = input.username.toLowerCase();
    if (await db.collection("user").findOne({ username }))
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 },
      );
    const result = await db.collection("user").insertOne({
      username,
      displayName: input.displayName,
      passwordHash: await hashPassword(input.password),
      role: "reviewer",
      status: input.status,
      createdAt: new Date(),
    });
    const response = NextResponse.json(
      {
        id: result.insertedId.toString(),
        displayName: input.displayName,
        role: "reviewer",
        status: input.status,
      },
      { status: 201 },
    );
    response.cookies.set(
      sessionCookie(
        signSession({
          sub: result.insertedId.toString(),
          role: "reviewer",
          status: input.status,
        }),
      ),
    );
    return response;
  } catch {
    return NextResponse.json(
      { error: "We could not create that account. Check your details." },
      { status: 400 },
    );
  }
}
