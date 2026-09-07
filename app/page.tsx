import Link from "next/link";

const notes = [
  ["01", "How do people experience you when you walk into a room?"],
  ["02", "What stays true when nobody is keeping score?"],
  ["03", "A small archive of the things worth carrying forward."],
];

export default function Home() {
  return (
    <main className="mirror-grid min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b hairline px-6 py-5 md:px-10">
        <span className="eyebrow">Mirror / private perception archive</span>
        <div className="flex items-center gap-6 text-[11px] uppercase tracking-[.14em]">
          <Link
            className="hidden transition-colors hover:text-[var(--accent)] md:block"
            href="/login"
          >
            Reviewer login
          </Link>
          <Link
            className="border border-[var(--ink)] px-4 py-2 transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
            href="/register"
          >
            Share a thought ↗
          </Link>
        </div>
      </nav>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 pb-24 pt-20 md:grid-cols-[1.2fr_.8fr] md:px-10 md:pb-32 md:pt-28">
        <div className="fade-up">
          <p className="eyebrow mb-8">ABDUL BASIT — BSAI&apos;24, SZABIST</p>
          <h1 className="display max-w-4xl text-[clamp(4.5rem,12vw,10.5rem)] leading-[.82]">
            A mirror,
            <br />
            <i>held open.</i>
          </h1>
          <p className="mt-12 max-w-md font-serif text-xl leading-relaxed text-[var(--muted)]">
            A private collection of honest observations from the people who have
            shared a classroom, a project, a laugh, or a long afternoon with
            Basit.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              className="bg-[var(--accent)] px-6 py-4 text-[11px] uppercase tracking-[.13em] text-white transition-transform hover:-translate-y-1"
              href="/register"
            >
              Leave your perspective ↗
            </Link>
            <span className="eyebrow">No performance required</span>
          </div>
        </div>
        <div className="relative flex min-h-[390px] items-end border-l hairline pl-8 md:mt-20 md:min-h-[470px]">
          <div className="absolute right-0 top-0 font-serif text-[9rem] leading-none text-[var(--accent-soft)] opacity-70">
            “
          </div>
          <div className="relative max-w-sm pb-2">
            <p className="eyebrow mb-6">The premise</p>
            <p className="display text-4xl leading-[1.02] md:text-5xl">
              You are not the most reliable narrator of your own life.
            </p>
            <div className="mt-12 h-px w-16 bg-[var(--accent)]" />
            <p className="mt-5 text-[11px] leading-relaxed text-[var(--muted)]">
              One considered review is more useful than a hundred polite
              compliments. This is a place for the former.
            </p>
          </div>
        </div>
      </section>
      <section className="border-y hairline bg-[var(--paper-deep)] px-6 py-12 md:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
          {notes.map(([number, text]) => (
            <div className="flex gap-5 border-t hairline pt-4" key={number}>
              <span className="text-xs text-[var(--accent)]">{number}</span>
              <p className="display text-2xl leading-tight">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-[10px] uppercase tracking-[.15em] text-[var(--muted)] md:flex-row md:items-center md:justify-between md:px-10">
        <span>ABDUL BASIT — BSAI&apos;24, SZABIST</span>
        <span>Private by design / © 2026</span>
      </footer>
    </main>
  );
}
