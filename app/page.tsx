import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const notes: Array<[string, string]> = [
  ["01", "How do people experience you when you walk into a room?"],
  ["02", "What stays true when nobody is keeping score?"],
  ["03", "A small archive of the things worth carrying forward."],
];

export default function Home() {
  return (
    <main className="mirror-grid min-h-screen overflow-hidden">
      <Header />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 pb-24 pt-20 md:grid-cols-[1.2fr_.8fr] md:px-10 md:pb-32 md:pt-28">
        <div className="fade-up">
          <p className="eyebrow mb-8">ABDUL BASIT — BSAI&apos;24, SZABIST</p>
          <h1 className="display max-w-4xl text-[clamp(4.5rem,12vw,10.5rem)] leading-[.82]">
            mirror,
            {/* <br /> */}
            held open.
          </h1>
          <p className="mt-12 max-w-md font-serif text-xl leading-relaxed text-[var(--muted)]">
            A private collection of honest observations from the people who have
            shared a classroom, a project, a laugh, or a long afternoon with
            Basit.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              className="action-button action-button--accent group inline-flex items-center gap-2 px-6 py-4 text-[11px] uppercase tracking-[.13em]"
              href="/register"
            >
              Leave your perspective
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </Link>
            <span className="eyebrow">No performance required</span>
          </div>
        </div>
        <div className="relative flex min-h-[390px] items-end border-l hairline pl-8 md:mt-20 md:min-h-[470px]">
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 font-serif text-[6rem] leading-none text-[var(--accent-soft)] opacity-70 md:text-[9rem]"
          >
            &ldquo;
          </div>
          <div className="relative max-w-sm pb-2">
            <p className="eyebrow mb-6">The premise</p>
            <blockquote className="display m-0 text-4xl leading-[1.02] md:text-5xl">
              You are not the most reliable narrator of your own life.
            </blockquote>
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
      <Footer />
    </main>
  );
}
