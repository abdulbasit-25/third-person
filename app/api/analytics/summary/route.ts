import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  const db = await getDb();
  const [summary] = await db
    .collection("reviews")
    .aggregate([
      { $match: { isCurrent: true } },
      {
        $facet: {
          counts: [
            {
              $group: {
                _id: null,
                reviews: { $sum: 1 },
                average: { $avg: "$finalRating" },
              },
            },
          ],
          ratings: [
            { $project: { values: { $objectToArray: "$ratings" } } },
            { $unwind: "$values" },
            { $group: { _id: "$values.k", average: { $avg: "$values.v" } } },
            { $sort: { average: -1 } },
          ],
        },
      },
    ])
    .toArray();
  return NextResponse.json(summary ?? { counts: [], ratings: [] });
}
