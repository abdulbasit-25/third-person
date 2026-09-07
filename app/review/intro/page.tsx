import Link from "next/link";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function ReviewIntroPage() {
  const session = await getSession();
  const review = session
    ? await (await getDb()).collection("reviews").findOne(
        { reviewerId: new ObjectId(session.sub), isCurrent: true },
        {
          projection: {
            adminResponse: 1,
            finalRating: 1,
            updatedAt: 1,
            createdAt: 1,
          },
        },
      )
    : null;

  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Header
        variant="reviewer-root"
        rightContent={<span className="eyebrow">01 / 06</span>}
      />
      <div className="mx-auto max-w-4xl py-28">
        <p className="eyebrow mb-8 text-[var(--accent)]">Before we begin</p>
        <h1 className="display max-w-3xl text-7xl leading-[.88] md:text-9xl">
          Take the
          <br />
          <i>long way round.</i>
        </h1>
        <p className="mt-12 max-w-xl font-serif text-2xl leading-relaxed text-[var(--muted)]">
          The best reviews are not performance reports. They are a handful of
          moments, patterns, and truths someone might not see from inside their
          own head.
        </p>
        <div className="mt-12">
          <Link
            className="inline-block bg-[var(--accent)] px-7 py-4 text-[11px] uppercase tracking-[.14em] text-white"
            href="/review/new"
          >
            Start the review ↗
          </Link>
        </div>
        {review?.adminResponse && (
          <section className="mt-16 max-w-2xl border-l-2 border-[var(--accent)] bg-[var(--paper-deep)] px-6 py-6">
            <p className="eyebrow text-[var(--accent)]">A note from Basit</p>
            <p className="mt-4 font-serif text-2xl leading-relaxed">
              {review.adminResponse}
            </p>
            <p className="mt-5 text-xs text-[var(--muted)]">
              Your previous perspective is still part of the archive. Update it
              whenever it changes.
            </p>
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
}
