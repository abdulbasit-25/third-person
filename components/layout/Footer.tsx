type FooterVariant = "public-home";

interface FooterProps {
  variant?: FooterVariant;
}

export function Footer({ variant = "public-home" }: FooterProps) {
  if (variant !== "public-home") {
    return null;
  }

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-[var(--line)] bg-[var(--paper-deep)]">
      {/* Subtle accent line */}
      <div className="absolute left-0 top-0 h-px w-32 bg-gradient-to-r from-[var(--accent)] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">
        {/* Main footer */}
        <div className="flex flex-col gap-12 sm:flex-row sm:items-end sm:justify-between">
          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              {/* ARCHER precision mark */}
              <div className="relative flex h-9 w-9 items-center justify-center">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-9 w-9"
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
              <div className="h-5 w-px bg-[var(--line-strong)]" />

              {/* Brand name */}
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.42em] text-[var(--muted)]">
                  Powered by
                </p>

                <p className="mt-0.5 text-lg font-semibold tracking-[0.28em] text-[var(--ink)]">
                  ARCHER
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-6 text-[var(--ink-soft)]">
              Built with precision. Designed with intent.
            </p>
          </div>

          {/* Signature */}
          <div className="sm:text-right">
            <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[var(--muted)]">
              Precision <span className="text-[var(--accent)]">•</span>{" "}
              Intelligence <span className="text-[var(--accent)]">•</span>{" "}
              Design
            </p>

            <p className="mt-3 text-xs text-[var(--muted)]">
              © {new Date().getFullYear()} ARCHER
            </p>
          </div>
        </div>

        {/* Bottom architectural divider */}
        <div className="mt-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--line)]" />

          {/* Arrow detail */}
          <div className="flex h-7 w-7 items-center justify-center border border-[var(--line-strong)] bg-[var(--paper)]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7 1L12 12L8.5 9.5L7 13L5.5 9.5L2 12L7 1Z"
                fill="var(--accent)"
              />
            </svg>
          </div>

          <div className="h-px flex-1 bg-[var(--line)]" />
        </div>

        {/* Minimal footer metadata */}
        <div className="mt-5 flex flex-col gap-2 text-[9px] uppercase tracking-[0.2em] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>Independent digital work</span>

          <span className="hidden sm:block">/</span>

          <span>Built for the web</span>
        </div>
      </div>
    </footer>
  );
}
