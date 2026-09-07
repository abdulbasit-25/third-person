import Link from "next/link";
import { ReviewResponseForm } from "@/components/review-response-form";
import { getDb } from "@/lib/mongodb";

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

  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <header className="flex items-center justify-between border-b hairline pb-5">
        <Link href="/dashboard" className="eyebrow">
          ← Dashboard
        </Link>
        <Link href="/api/auth/logout" className="eyebrow">
          Sign out
        </Link>
      </header>
      <section className="mx-auto max-w-5xl py-20">
        <p className="eyebrow mb-5 text-[var(--accent)]">Archive / reviews</p>
        <h1 className="display text-7xl leading-[.88]">
          Read the
          <br />
          <i>whole note.</i>
        </h1>
        <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-[var(--muted)]">
          Read each perspective in context, then answer it with the same care it
          took to write.
        </p>
        <div className="mt-16 divide-y hairline">
          {reviews.length ? (
            reviews.map((review) => (
              <article className="py-10" key={review._id.toString()}>
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <Link
                      href={`/dashboard/people/${review.reviewerId.toString()}`}
                      className="display text-3xl transition-colors hover:text-[var(--accent)]"
                    >
                      {review.reviewer?.displayName || "Anonymous reviewer"}
                    </Link>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <p className="eyebrow">
                        {review.reviewer?.status || "Reviewer"}
                      </p>
                      <span
                        className={`eyebrow border px-2 py-1 ${review.isCurrent ? "border-[var(--accent)] text-[var(--accent)]" : "hairline text-[var(--muted)]"}`}
                      >
                        {review.isCurrent
                          ? "Latest version"
                          : `Version ${review.version}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="eyebrow">Overall feeling</p>
                    <strong className="display text-5xl">
                      {review.finalRating}/10
                    </strong>
                  </div>
                </div>
                <p className="mt-8 max-w-3xl font-serif text-2xl leading-relaxed">
                  {review.finalSentence || "No final sentence was added."}
                </p>
                <div className="mt-8 grid gap-5 border-y hairline py-6">
                  {Object.entries(review.answers || {})
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <div key={key}>
                        <p className="font-bold text-xs uppercase tracking-[.14em] text-[var(--accent)]">
                          {key === "firstImpression"
                            ? "First Impression"
                            : key === "proudMoment"
                              ? "Proud Moment"
                              : key === "honestAdvice"
                                ? "Honest Advice"
                                : key.replace(/([A-Z])/g, " $1")}
                        </p>
                        <p className="max-w-3xl whitespace-pre-wrap break-words font-serif text-lg leading-relaxed text-[var(--muted)]">
                          {String(value)}
                        </p>
                      </div>
                    ))}
                </div>
                {review.traits?.length ? (
                  <p className="mt-5 text-xs uppercase tracking-[.12em] text-[var(--accent)]">
                    {review.traits.join(" / ")}
                  </p>
                ) : null}
                {review.isCurrent ? (
                  <ReviewResponseForm
                    reviewId={review._id.toString()}
                    initialResponse={review.adminResponse}
                  />
                ) : (
                  <p className="mt-6 border-t hairline pt-5 text-xs text-[var(--muted)]">
                    Archived version. Responses can only be written to the
                    latest review.
                  </p>
                )}
              </article>
            ))
          ) : (
            <p className="py-12 font-serif text-2xl text-[var(--muted)]">
              No reviews have arrived yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
