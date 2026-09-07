import Link from "next/link";
import { getDb } from "@/lib/mongodb";

export default async function DashboardPage() {
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
          _id: 1,
          finalRating: 1,
          finalSentence: 1,
          createdAt: 1,
          reviewer: { displayName: 1, status: 1 },
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();
  const average = reviews.length
    ? reviews.reduce(
        (sum, review) => sum + Number(review.finalRating || 0),
        0,
      ) / reviews.length
    : 0;

  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <header className="flex items-center justify-between border-b hairline pb-5">
        <span className="eyebrow">Mirror / private archive</span>
        <Link href="/api/auth/logout" className="eyebrow">
          Sign out
        </Link>
      </header>
      <section className="mx-auto max-w-7xl py-20">
        <div className="flex flex-col justify-between gap-8 border-b hairline pb-12 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-6 text-[var(--accent)]">
              The keeper&apos;s view
            </p>
            <h1 className="display text-8xl leading-[.82]">
              What people
              <br />
              <i>are saying.</i>
            </h1>
          </div>
          <p className="max-w-xs font-serif text-lg leading-relaxed text-[var(--muted)]">
            A living archive of perception, collected with care.
          </p>
        </div>
        <div className="grid gap-px bg-[var(--line)] md:grid-cols-3">
          <div className="bg-[var(--paper)] p-8">
            <span className="eyebrow">Current reviews</span>
            <strong className="display mt-6 block text-7xl">
              {reviews.length}
            </strong>
          </div>
          <div className="bg-[var(--paper)] p-8">
            <span className="eyebrow">Average feeling</span>
            <strong className="display mt-6 block text-7xl">
              {average ? average.toFixed(1) : "—"}
            </strong>
          </div>
          <div className="bg-[var(--paper)] p-8">
            <span className="eyebrow">Latest note</span>
            <strong className="display mt-6 block text-3xl">
              {reviews[0]?.finalSentence || "Waiting to hear from them."}
            </strong>
          </div>
        </div>
        <section className="mt-16">
          <div className="flex items-end justify-between border-b hairline pb-4">
            <div>
              <p className="eyebrow mb-2 text-[var(--accent)]">The archive</p>
              <h2 className="display text-5xl">Current perspectives</h2>
            </div>
            <span className="eyebrow">{reviews.length} received</span>
          </div>
          {reviews.length ? (
            <div className="divide-y hairline">
              {reviews.map((review) => (
                <article
                  className="grid gap-6 py-8 md:grid-cols-[.7fr_1.5fr_auto]"
                  key={review._id.toString()}
                >
                  <div>
                    <p className="display text-2xl">
                      {review.reviewer?.displayName || "Anonymous reviewer"}
                    </p>
                    <p className="eyebrow mt-2">
                      {review.reviewer?.status || "Reviewer"}
                    </p>
                  </div>
                  <p className="font-serif text-xl leading-relaxed text-[var(--muted)]">
                    {review.finalSentence || "No final note was added."}
                  </p>
                  <div className="text-left md:text-right">
                    <p className="eyebrow">Overall</p>
                    <strong className="display text-5xl">
                      {review.finalRating}/10
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-12 font-serif text-2xl text-[var(--muted)]">
              No current reviews have arrived yet.
            </p>
          )}
        </section>
        <div className="mt-16 grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow mb-4">Archive navigation</p>
            {["Reviews", "People", "Analytics", "Timeline", "Export"].map(
              (item) => (
                <div className="border-b hairline py-4 text-xl" key={item}>
                  {item}
                  <span className="float-right text-[var(--accent)]">↗</span>
                </div>
              ),
            )}
          </div>
          <div className="border-l hairline pl-10">
            <p className="eyebrow mb-5">A note to the administrator</p>
            <p className="display text-5xl leading-[.95]">
              The archive gets more useful with specificity.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
