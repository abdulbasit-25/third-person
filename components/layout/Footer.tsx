type FooterVariant = "public-home";
import Link from "next/link";

interface FooterProps {
  variant?: FooterVariant;
}

export function Footer({ variant = "public-home" }: FooterProps) {
  if (variant !== "public-home") {
    return null;
  }

  return (
    <footer className="group relative mt-20 overflow-hidden border-t border-[var(--line)] bg-[var(--paper-deep)]">
      {/* Animated accent line */}
      <div className="absolute left-0 top-0 h-px w-32 origin-left bg-gradient-to-r from-[var(--accent)] to-transparent transition-all duration-500 ease-out group-hover:w-72" />

      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
        {/* Main footer */}
        <div className="flex flex-col gap-12 sm:flex-row sm:items-end sm:justify-between">
          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              {/* ARCHER precision mark */}
              <div className="relative flex h-9 w-9 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-0 blur-md transition-all duration-500 group-hover:opacity-20" />

                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative h-9 w-9 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  aria-hidden="true"
                >
                  <path
                    d="M20 3L34 35L23.5 27L20 37L16.5 27L6 35L20 3Z"
                    fill="url(#archer-footer)"
                  />

                  <path
                    d="M20 5V34"
                    stroke="var(--paper)"
                    strokeOpacity="0.45"
                    strokeWidth="1"
                  />

                  <defs>
                    <linearGradient
                      id="archer-footer"
                      x1="9"
                      y1="5"
                      x2="31"
                      y2="35"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="var(--accent-soft)" />
                      <stop offset="0.5" stopColor="var(--accent)" />
                      <stop offset="1" stopColor="var(--accent-hover)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Divider */}
              <div className="h-5 w-px bg-[var(--line-strong)] transition-colors duration-300 group-hover:bg-[var(--accent)]" />

              {/* Brand name */}
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.42em] text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--ink-soft)]">
                  Powered by
                </p>

                <Link
                  href="https://abdulbasit-archer.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit ARCHER portfolio"
                  className="relative mt-0.5 inline-block text-lg font-semibold tracking-[0.28em] text-[var(--ink)] transition-all duration-300 ease-out hover:translate-x-1 hover:tracking-[0.34em] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                >
                  ARCHER
                  {/* Hover underline */}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--accent)] transition-all duration-300 ease-out hover:w-full" />
                </Link>
              </div>
            </div>

            <p className="max-w-md text-sm leading-6 text-[var(--ink-soft)] transition-colors duration-300 group-hover:text-[var(--ink)]">
              Built with precision. Designed with intent.
            </p>
          </div>

          {/* Signature */}
          <div className="sm:text-right">
            <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[var(--muted)] transition-all duration-300 group-hover:tracking-[0.4em] group-hover:text-[var(--ink-soft)]">
              Precision{" "}
              <span className="text-[var(--accent)] transition-transform duration-300 group-hover:inline-block group-hover:scale-125">
                •
              </span>{" "}
              Intelligence{" "}
              <span className="text-[var(--accent)] transition-transform duration-300 group-hover:inline-block group-hover:scale-125">
                •
              </span>{" "}
              Design
            </p>

            <p className="mt-3 text-xs text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--ink-soft)]">
              © {new Date().getFullYear()} ARCHER
            </p>
          </div>
        </div>

        {/* Bottom architectural divider */}
        <div className="mt-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--line)] transition-colors duration-500 group-hover:bg-[var(--line-strong)]" />

          {/* Arrow detail */}
          <div className="group/arrow flex h-7 w-7 cursor-default items-center justify-center border border-[var(--line-strong)] bg-[var(--paper)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:border-[var(--accent)] hover:bg-[var(--paper-deep)]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover/arrow:scale-110"
            >
              <path
                d="M7 1L12 12L8.5 9.5L7 13L5.5 9.5L2 12L7 1Z"
                fill="var(--accent)"
                className="transition-opacity duration-300 group-hover/arrow:opacity-80"
              />
            </svg>
          </div>

          <div className="h-px flex-1 bg-[var(--line)] transition-colors duration-500 group-hover:bg-[var(--line-strong)]" />
        </div>

        {/* Minimal footer metadata */}
        <div className="mt-5 flex flex-col gap-2 text-[9px] uppercase tracking-[0.2em] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span className="transition-all duration-300 hover:translate-x-1 hover:text-[var(--ink-soft)]">
            Independent digital work
          </span>

          <span className="hidden opacity-40 transition-opacity duration-300 group-hover:opacity-100 sm:block">
            /
          </span>

          <span className="transition-all duration-300 hover:-translate-x-1 hover:text-[var(--ink-soft)]">
            Built for the web
          </span>
        </div>
      </div>
    </footer>
  );
}
