import Link from "next/link";
export default function DashboardPage() {
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
            <strong className="display mt-6 block text-7xl">—</strong>
          </div>
          <div className="bg-[var(--paper)] p-8">
            <span className="eyebrow">Average feeling</span>
            <strong className="display mt-6 block text-7xl">—</strong>
          </div>
          <div className="bg-[var(--paper)] p-8">
            <span className="eyebrow">Latest note</span>
            <strong className="display mt-6 block text-3xl">
              Waiting to hear from them.
            </strong>
          </div>
        </div>
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
