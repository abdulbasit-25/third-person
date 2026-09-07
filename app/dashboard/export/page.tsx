import { getDb } from "@/lib/mongodb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function ExportPage() {
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
          privateFeedback: 0,
          passwordHash: 0,
          reviewer: { passwordHash: 0 },
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();
  const data = reviews.map((review) => ({
    ...review,
    _id: review._id.toString(),
    reviewerId: review.reviewerId.toString(),
    createdAt: review.createdAt?.toISOString?.() || review.createdAt,
  }));

  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Header variant="dashboard-detail" />
      <section className="mx-auto max-w-5xl py-20">
        <p className="eyebrow mb-5 text-[var(--accent)]">Archive / export</p>
        <h1 className="display text-7xl leading-[.88]">
          Take the archive
          <br />
          <i>with you.</i>
        </h1>
        <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-[var(--muted)]">
          A clean JSON snapshot of the current reviews, without passwords or
          private feedback.
        </p>
        <a
          className="mt-10 inline-block bg-[var(--accent)] px-6 py-4 text-[11px] uppercase tracking-[.14em] text-white"
          href="/api/reviews"
          download="mirror-reviews.json"
        >
          Download JSON ↗
        </a>
        <pre className="mt-12 max-h-[32rem] overflow-auto border hairline bg-[var(--paper-deep)] p-5 text-xs leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </section>
      <Footer />
    </main>
  );
}
