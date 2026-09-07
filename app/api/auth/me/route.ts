import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const user = await (await getDb())
    .collection("user")
    .findOne(
      { _id: new ObjectId(session.sub) },
      { projection: { passwordHash: 0 } },
    );
  return user
    ? NextResponse.json({ ...user, id: user._id.toString(), _id: undefined })
    : NextResponse.json({ error: "Account not found." }, { status: 404 });
}
