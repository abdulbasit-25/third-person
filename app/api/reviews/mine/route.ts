import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "reviewer")
    return NextResponse.json(
      { error: "Reviewer access required." },
      { status: 401 },
    );
  const reviews = await (
    await getDb()
  )
    .collection("reviews")
    .find({ reviewerId: new ObjectId(session.sub) })
    .sort({ version: -1 })
    .project({ privateFeedback: 0 })
    .toArray();
  return NextResponse.json({
    current: reviews[0] ?? null,
    history: reviews.map(({ _id, version, createdAt, finalRating }) => ({
      id: _id,
      version,
      createdAt,
      finalRating,
    })),
  });
}
