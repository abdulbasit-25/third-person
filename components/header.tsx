import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Header() {
  return (
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
          className="group inline-flex items-center gap-1.5 border border-[var(--ink)] px-4 py-2 transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
          href="/register"
        >
          Share a thought
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.75}
          />
        </Link>
      </div>
    </nav>
  );
}
