import { getDb } from "@/lib/mongodb";
import { Header } from "@/components/layout/Header";

export default async function TimelinePage() {
  const reviews = await (
    await getDb()
  )
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
      {
        $project: {
          finalRating: 1,
          finalSentence: 1,
          createdAt: 1,
          reviewer: { displayName: 1 },
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();

  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Header variant="dashboard-detail" />
      <section className="mx-auto max-w-5xl py-20">
        <p className="eyebrow mb-5 text-[var(--accent)]">Archive / timeline</p>
        <h1 className="display text-7xl leading-[.88]">
          How the archive
          <br />
          <i>moves over time.</i>
        </h1>
        <div className="mt-16 border-l-2 border-[var(--accent)] pl-8">
          {reviews.length ? (
            reviews.map((review) => (
              <article
                className="relative border-b hairline py-8 first:pt-0"
                key={review._id.toString()}
              >
                <span className="absolute -left-[2.55rem] top-9 h-3 w-3 bg-[var(--accent)] first:top-1" />
                <p className="eyebrow">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="display mt-3 text-3xl">
                  {review.reviewer?.displayName || "Anonymous reviewer"}
                </h2>
                <p className="mt-4 max-w-2xl font-serif text-xl leading-relaxed">
                  {review.finalSentence || "No final sentence was added."}
                </p>
                <p className="mt-4 text-[var(--accent)]">
                  {review.finalRating}/10
                </p>
              </article>
            ))
          ) : (
            <p className="font-serif text-2xl text-[var(--muted)]">
              The timeline is waiting for its first entry.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
