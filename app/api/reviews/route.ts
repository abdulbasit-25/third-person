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
  let input: ReturnType<typeof reviewSchema.parse>;
  try {
    input = reviewSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Review data was incomplete or invalid." },
      { status: 400 },
    );
  }

  const db = await getDb();
  const reviewerId = new ObjectId(session.sub);
  const transaction = db.client.startSession();
  let version = 1;
  try {
    await transaction.withTransaction(async () => {
      const current = await db
        .collection("reviews")
        .findOne({ reviewerId, isCurrent: true }, { session: transaction });
      version = (current?.version ?? 0) + 1;
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
    return NextResponse.json({ version }, { status: 201 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    )
      return NextResponse.json(
        { error: "Your review changed at the same time. Please try again." },
        { status: 409 },
      );
    console.error("Review transaction failed", error);
    return NextResponse.json(
      { error: "The review could not be saved right now." },
      { status: 500 },
    );
  } finally {
    await transaction.endSession();
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
          _id: 1,
          relationship: 1,
          knownDuration: 1,
          interactionFrequency: 1,
          ratings: 1,
          traits: 1,
          answers: 1,
          quickChoices: 1,
          finalRating: 1,
          workAgain: 1,
          finalSentence: 1,
          adminResponse: 1,
          respondedAt: 1,
          version: 1,
          isCurrent: 1,
          createdAt: 1,
          reviewer: { displayName: 1, status: 1 },
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();
  return NextResponse.json({ reviews, query });
}
