import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDb } from "@/lib/mongodb";
import { Header } from "@/components/layout/Header";

const NAV_ITEMS = [
  ["Reviews", "/dashboard/reviews"],
  ["People", "/dashboard/people"],
  ["Analytics", "/dashboard/analytics"],
  ["Timeline", "/dashboard/timeline"],
  ["Export", "/dashboard/export"],
] as const;

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
    <main className="mirror-grid min-h-screen px-6 py-10 md:px-12">
      <Header variant="dashboard-root" wide />

      <section className="mx-auto max-w-7xl py-16 md:py-24">
        {/* Hero */}
        <div className="flex flex-col justify-between gap-10 border-b hairline pb-14 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-5 text-[var(--accent)]">
              The keeper&apos;s view
            </p>
            <h1 className="display text-6xl leading-[0.92] sm:text-7xl lg:text-[6.5rem] lg:leading-[0.86]">
              What people
              <br />
              are saying
            </h1>
          </div>
          <p className="max-w-xs font-serif text-lg leading-relaxed text-[var(--muted)]">
            A living record of perception, collected with care.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-px bg-[var(--line)] md:grid-cols-3">
          <div className="bg-[var(--paper)] p-8 md:p-10">
            <span className="eyebrow">Current reviews</span>
            <strong className="display mt-6 block text-6xl tabular-nums md:text-7xl">
              {reviews.length}
            </strong>
          </div>
          <div className="bg-[var(--paper)] p-8 md:p-10">
            <span className="eyebrow">Average feeling</span>
            <strong className="display mt-6 block text-6xl tabular-nums md:text-7xl">
              {average ? average.toFixed(1) : "—"}
            </strong>
          </div>
          <div className="bg-[var(--paper)] p-8 md:p-10">
            <span className="eyebrow">Latest note</span>
            <strong className="display mt-6 block text-2xl leading-snug md:text-3xl">
              {reviews[0]?.finalSentence || "Waiting to hear from them."}
            </strong>
          </div>
        </div>

        {/* Reviews */}
        <section id="reviews" className="mt-20">
          <div className="flex items-end justify-between border-b hairline pb-4">
            <div>
              <p className="eyebrow mb-2 text-[var(--accent)]">The archive</p>
              <h2 className="display text-4xl md:text-5xl">
                Current perspectives
              </h2>
            </div>
            <span className="eyebrow tabular-nums">
              {reviews.length} received
            </span>
          </div>

          {reviews.length ? (
            <div id="people" className="divide-y hairline">
              {reviews.map((review) => (
                <article
                  className="grid gap-6 py-9 md:grid-cols-[.7fr_1.5fr_auto] md:items-start"
                  key={review._id.toString()}
                >
                  <div className="flex items-start gap-4">
                    <span className="display flex h-11 w-11 shrink-0 items-center justify-center border hairline text-lg">
                      {(review.reviewer?.displayName || "A")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                    <div>
                      <p className="display text-2xl">
                        {review.reviewer?.displayName || "Anonymous reviewer"}
                      </p>
                      <p className="eyebrow mt-1">
                        {review.reviewer?.status || "Reviewer"}
                      </p>
                    </div>
                  </div>
                  <p className="font-serif text-xl leading-relaxed text-[var(--muted)]">
                    {review.finalSentence || "No final note was added."}
                  </p>
                  <div className="text-left md:text-right">
                    <p className="eyebrow mb-1">Overall</p>
                    <p className="display text-4xl tabular-nums">
                      <span className="text-[var(--accent)]">
                        {review.finalRating}
                      </span>
                      <span className="text-xl text-[var(--muted)]">/10</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-14 font-serif text-2xl leading-relaxed text-[var(--muted)]">
              Nothing has been archived yet. New reviews will appear here as
              they arrive.
            </p>
          )}
        </section>

        {/* Navigation + note */}
        <div className="mt-20 grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <nav className="border-t hairline">
            {NAV_ITEMS.map(([item, href]) => (
              <Link
                className="group flex items-center justify-between border-b hairline py-5 text-xl transition-colors hover:text-[var(--accent)]"
                key={item}
                href={href}
              >
                {item}
                <ArrowUpRight
                  className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                  strokeWidth={1.5}
                />
              </Link>
            ))}
          </nav>
          <div className="border-l hairline pl-10">
            <p className="eyebrow mb-5">A note to the keeper</p>
            <p className="display text-4xl leading-[1] md:text-5xl">
              The archive grows more useful with specificity.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
