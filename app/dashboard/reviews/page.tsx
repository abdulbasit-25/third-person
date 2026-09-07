import { getDb } from "@/lib/mongodb";
import { Header } from "@/components/layout/Header";
import { ReviewerHistory } from "@/components/reviewer-history";

export default async function ReviewsPage() {
  const reviews = await (
    await getDb()
  )
    .collection("reviews")
    .aggregate([
      {
        $lookup: {
          from: "user",
          localField: "reviewerId",
          foreignField: "_id",
          as: "reviewer",
        },
      },
      { $unwind: "$reviewer" },
      {
        $project: {
          _id: 1,
          reviewerId: 1,
          finalRating: 1,
          finalSentence: 1,
          answers: 1,
          traits: 1,
          adminResponse: 1,
          version: 1,
          isCurrent: 1,
          createdAt: 1,
          reviewer: { displayName: 1, status: 1 },
        },
      },
      { $sort: { reviewerId: 1, version: -1 } },
    ])
    .toArray();

  // Group by reviewer. Sort already puts each reviewer's versions together,
  // newest first, so group[0] is always the latest version.
  const groupsByReviewer = new Map<string, typeof reviews>();
  for (const review of reviews) {
    const key = review.reviewerId.toString();
    const group = groupsByReviewer.get(key) ?? [];
    group.push(review);
    groupsByReviewer.set(key, group);
  }

  const serialize = (review: (typeof reviews)[number]) => ({
    id: review._id.toString(),
    finalRating: review.finalRating,
    finalSentence: review.finalSentence,
    answers: review.answers || {},
    traits: review.traits || [],
    adminResponse: review.adminResponse ?? null,
    version: review.version,
    isCurrent: Boolean(review.isCurrent),
    createdAt: new Date(review.createdAt).toISOString(),
  });

  const reviewerGroups = Array.from(groupsByReviewer.values()).map((group) => ({
    reviewerName: group[0].reviewer?.displayName || "Anonymous reviewer",
    reviewerStatus: group[0].reviewer?.status || "Reviewer",
    latest: serialize(group[0]),
    history: group.slice(1).map(serialize),
  }));

  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Header variant="dashboard-sub" />

      <section className="mx-auto max-w-5xl py-14 md:py-20">
        <p className="eyebrow mb-5 text-[var(--accent)]">Archive / reviews</p>
        <h1 className="display text-5xl leading-[0.92] sm:text-6xl lg:text-7xl lg:leading-[0.9]">
          Read the
          <br />
          whole note
        </h1>
        <p className="mt-8 max-w-xl font-serif text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
          Choose a reviewer to read their latest perspective in full, plus every
          earlier version they've written.
        </p>

        <div className="mt-14 divide-y hairline sm:mt-16">
          {reviewerGroups.length ? (
            reviewerGroups.map((group) => (
              <ReviewerHistory key={group.latest.id} {...group} />
            ))
          ) : (
            <p className="py-12 font-serif text-xl text-[var(--muted)] sm:text-2xl">
              No reviews have arrived yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
