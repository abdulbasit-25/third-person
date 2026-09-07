import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { reviewSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "reviewer")
    return NextResponse.json(
      { error: "Reviewer access required." },
      { status: 401 },
    );
  try {
    const input = reviewSchema.parse(await request.json());
    const db = await getDb();
    const reviewerId = new ObjectId(session.sub);
    const current = await db
      .collection("reviews")
      .findOne({ reviewerId, isCurrent: true });
    const version = (current?.version ?? 0) + 1;
    const client = db.client;
    const transaction = client.startSession();
    try {
      await transaction.withTransaction(async () => {
        if (current)
          await db
            .collection("reviews")
            .updateOne(
              { _id: current._id },
              { $set: { isCurrent: false } },
              { session: transaction },
            );
        await db.collection("reviews").insertOne(
          {
            ...input,
            reviewerId,
            version,
            isCurrent: true,
            createdAt: new Date(),
          },
          { session: transaction },
        );
      });
    } finally {
      await transaction.endSession();
    }
    return NextResponse.json({ version }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Review data was incomplete or invalid." },
      { status: 400 },
    );
  }
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  const db = await getDb();
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const query = status
    ? { isCurrent: true, "reviewer.status": status }
    : { isCurrent: true };
  const reviews = await db
    .collection("reviews")
    .aggregate([
      { $match: { isCurrent: true } },
      {
        $lookup: {
          from: "user",
          localField: "reviewerId",
          foreignField: "_id",
          as: "reviewer",
        },
      },
      { $unwind: "$reviewer" },
      ...(status ? [{ $match: { "reviewer.status": status } }] : []),
      {
        $project: {
          privateFeedback: 0,
          reviewer: { displayName: 1, status: 1 },
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();
  return NextResponse.json({ reviews, query });
}
