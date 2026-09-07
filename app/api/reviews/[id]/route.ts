import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { adminResponseSchema } from "@/lib/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "admin")
    return NextResponse.json(
      { error: "Administrator access required." },
      { status: 401 },
    );

  const { id } = await params;
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Review not found." }, { status: 404 });

  try {
    const { adminResponse } = adminResponseSchema.parse(await request.json());
    const result = await (await getDb()).collection("reviews").updateOne(
      { _id: new ObjectId(id), isCurrent: true },
      {
        $set: {
          adminResponse,
          respondedAt: adminResponse ? new Date() : null,
        },
      },
    );
    if (!result.matchedCount)
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json(
      { error: "Response could not be saved." },
      { status: 400 },
    );
  }
}
