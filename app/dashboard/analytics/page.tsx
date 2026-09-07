import Link from "next/link";
import { getDb } from "@/lib/mongodb";

export default async function AnalyticsPage() {
  const reviews = await (
    await getDb()
  )
    .collection("reviews")
    .find({ isCurrent: true }, { projection: { ratings: 1, finalRating: 1 } })
    .toArray();
  const categoryTotals = new Map<string, { total: number; count: number }>();
  for (const review of reviews) {
    for (const [category, value] of Object.entries(review.ratings || {})) {
      const current = categoryTotals.get(category) || { total: 0, count: 0 };
      categoryTotals.set(category, {
        total: current.total + Number(value),
        count: current.count + 1,
      });
    }
  }
  const categories = [...categoryTotals.entries()]
    .map(([name, values]) => ({ name, average: values.total / values.count }))
    .sort((a, b) => b.average - a.average);
  const overall = reviews.length
    ? reviews.reduce(
        (sum, review) => sum + Number(review.finalRating || 0),
        0,
      ) / reviews.length
    : 0;

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
        <p className="eyebrow mb-5 text-[var(--accent)]">Archive / analytics</p>
        <h1 className="display text-7xl leading-[.88]">
          Patterns,
          <br />
          <i>not verdicts.</i>
        </h1>
        <div className="mt-16 grid gap-px bg-[var(--line)] md:grid-cols-2">
          <div className="bg-[var(--paper)] p-8">
            <span className="eyebrow">Current reviews</span>
            <strong className="display mt-5 block text-7xl">
              {reviews.length}
            </strong>
          </div>
          <div className="bg-[var(--paper)] p-8">
            <span className="eyebrow">Average overall</span>
            <strong className="display mt-5 block text-7xl">
              {overall ? overall.toFixed(1) : "—"}
            </strong>
          </div>
        </div>
        <div className="mt-16">
          <div className="flex items-end justify-between border-b hairline pb-4">
            <h2 className="display text-4xl">What repeats</h2>
            <span className="eyebrow">out of 10</span>
          </div>
          <div className="divide-y hairline">
            {categories.map((category) => (
              <div
                className="grid grid-cols-[1fr_auto] items-center gap-6 py-5"
                key={category.name}
              >
                <span className="text-sm uppercase tracking-[.12em]">
                  {category.name.replace(/([A-Z])/g, " $1")}
                </span>
                <strong className="display text-4xl">
                  {category.average.toFixed(1)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
