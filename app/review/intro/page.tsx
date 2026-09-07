import Link from "next/link";
export default function ReviewIntroPage() {
  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <div className="flex justify-between">
        <span className="eyebrow">Mirror / reviewer space</span>
        <span className="eyebrow">01 / 06</span>
      </div>
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
      </div>
    </main>
  );
}
