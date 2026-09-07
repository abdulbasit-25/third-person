import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReviewResponseForm } from "@/components/review-response-form";

function answerLabel(key: string) {
  if (key === "firstImpression") return "First Impression";
  if (key === "proudMoment") return "Proud Moment";
  if (key === "honestAdvice") return "Honest Advice";
  return key.replace(/([A-Z])/g, " $1");
}

export default async function PersonHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) notFound();
  const db = await getDb();
  const person = await db
    .collection("user")
    .findOne(
      { _id: new ObjectId(id), role: "reviewer" },
      { projection: { passwordHash: 0 } },
    );
  if (!person) notFound();

  const reviews = await db
    .collection("reviews")
    .find({ reviewerId: new ObjectId(id) })
    .sort({ version: -1 })
    .toArray();
  const latest = reviews[0];

  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Header
        variant="dashboard-detail"
        backLabel="People"
        backHref="/dashboard/people"
      />
      <section className="mx-auto max-w-5xl py-20">
        <p className="eyebrow mb-5 text-[var(--accent)]">
          Person / review history
        </p>
        <h1 className="display text-7xl leading-[.88]">
          {person.displayName}
          <br />
          <i>over time.</i>
        </h1>
        <p className="mt-6 font-serif text-xl text-[var(--muted)]">
          {person.username} / {person.status || "reviewer"}
        </p>

        {latest ? (
          <article className="mt-16 border-2 border-[var(--accent)] bg-[var(--paper-deep)] p-6 md:p-10">
            <div className="flex flex-col justify-between gap-5 md:flex-row">
              <div>
                <p className="eyebrow text-[var(--accent)]">
                  Start here / latest review
                </p>
                <p className="mt-3 text-xs uppercase tracking-[.14em]">
                  Version {latest.version} /{" "}
                  {new Date(latest.createdAt).toLocaleDateString()}
                </p>
              </div>
              <strong className="display text-6xl text-[var(--accent)]">
                {latest.finalRating}/10
              </strong>
            </div>
            <p className="mt-10 font-serif text-3xl font-semibold leading-relaxed">
              {latest.finalSentence || "No final sentence was added."}
            </p>
            <div className="mt-8 grid gap-6 border-t hairline pt-6">
              {Object.entries(latest.answers || {})
                .filter(([, value]) => value)
                .map(([key, value]) => (
                  <div key={key}>
                    <p className="font-bold text-xs uppercase tracking-[.14em] text-[var(--accent)]">
                      {answerLabel(key)}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap break-words font-serif text-xl font-semibold leading-relaxed">
                      {String(value)}
                    </p>
                  </div>
                ))}
            </div>
            <ReviewResponseForm
              reviewId={latest._id.toString()}
              initialResponse={latest.adminResponse}
            />
          </article>
        ) : (
          <p className="mt-16 font-serif text-2xl text-[var(--muted)]">
            This reviewer has not submitted a review yet.
          </p>
        )}

        <section className="mt-20">
          <div className="flex items-end justify-between border-b hairline pb-4">
            <h2 className="display text-4xl">Earlier versions</h2>
            <span className="eyebrow">
              {Math.max(reviews.length - 1, 0)} archived
            </span>
          </div>
          <div className="divide-y hairline">
            {reviews.slice(1).map((review) => (
              <article className="py-8" key={review._id.toString()}>
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <p className="font-bold text-xs uppercase tracking-[.14em] text-[var(--accent)]">
                      Version {review.version}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <strong className="display text-4xl">
                    {review.finalRating}/10
                  </strong>
                </div>
                <p className="mt-5 whitespace-pre-wrap break-words font-serif text-xl font-semibold leading-relaxed">
                  {review.finalSentence || "No final sentence was added."}
                </p>
              </article>
            ))}
          </div>
        </section>
      </section>
      <Footer />
    </main>
  );
}
