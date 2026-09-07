import Link from "next/link";
import { ArrowLeft, ArrowUpRight, LogOut } from "lucide-react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type HeaderVariant =
  | "public-home"
  | "auth"
  | "dashboard-root"
  | "dashboard-sub"
  | "dashboard-detail"
  | "reviewer-root"
  | "reviewer-sub";

interface HeaderProps {
  variant?: HeaderVariant;
  backHref?: string;
  backLabel?: string;
  rightContent?: ReactNode;
  wide?: boolean;
  paddingBottom?: string;
  sticky?: boolean;
}

/* ------------------------------------------------------------------ */
/* Shared                                                             */
/* ------------------------------------------------------------------ */

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]";

const micro = "text-[9px] font-medium uppercase tracking-[0.22em]";

const transition = "transition-all duration-300 ease-out";

/* ------------------------------------------------------------------ */
/* Brand                                                              */
/* ------------------------------------------------------------------ */

function Brand({ section, href }: { section: string; href?: string }) {
  const content = (
    <>
      {/* Mark */}
      <span
        aria-hidden="true"
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--line-strong)] bg-[var(--paper)] ${transition} group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]`}
      >
        {/* Inner frame */}
        <span className="absolute inset-[5px] border border-[var(--line)] group-hover:border-white/30" />

        {/* Crosshair */}
        <span className="absolute left-1/2 top-2.5 h-5 w-px -translate-x-1/2 bg-[var(--line-strong)] group-hover:bg-white/40" />
        <span className="absolute left-2.5 top-1/2 h-px w-5 -translate-y-1/2 bg-[var(--line-strong)] group-hover:bg-white/40" />

        {/* Center */}
        <span className="relative z-10 h-2.5 w-2.5 rotate-45 bg-[var(--accent)] transition-transform duration-500 group-hover:rotate-[225deg] group-hover:bg-[var(--paper)]" />

        {/* Corner accents */}
        <span className="absolute left-0 top-0 h-px w-3 bg-[var(--accent)]" />
        <span className="absolute left-0 top-0 h-3 w-px bg-[var(--accent)]" />

        <span className="absolute bottom-0 right-0 h-px w-3 bg-[var(--accent)]" />
        <span className="absolute bottom-0 right-0 h-3 w-px bg-[var(--accent)]" />
      </span>

      {/* Wordmark */}
      <span className="flex min-w-0 flex-col">
        <span className="text-[17px] font-semibold leading-none tracking-[0.22em] text-[var(--ink)]">
          MIRROR
        </span>

        <span className="mt-1.5 truncate text-[8px] font-medium uppercase tracking-[0.22em] text-[var(--muted)]">
          {section}
        </span>
      </span>
    </>
  );

  return href ? (
    <Link
      href={href}
      aria-label={`Mirror — ${section}`}
      className={`group inline-flex min-w-0 items-center gap-3 ${focusRing}`}
    >
      {content}
    </Link>
  ) : (
    <span className="group inline-flex min-w-0 items-center gap-3">
      {content}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Back link                                                          */
/* ------------------------------------------------------------------ */

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 ${focusRing}`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center border border-[var(--line-strong)] bg-[var(--paper)] text-[var(--ink-soft)] ${transition} group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--paper)]`}
      >
        <ArrowLeft
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
          strokeWidth={1.6}
        />
      </span>

      <span className="flex flex-col">
        <span className={`${micro} text-[var(--muted)]`}>Return to</span>

        <span className="mt-0.5 text-xs font-medium text-[var(--ink)]">
          {label}
        </span>
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Public navigation                                                  */
/* ------------------------------------------------------------------ */

function PublicNavigation() {
  return (
    <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
      {/* Login */}
      <Link
        href="/login"
        className={`group hidden items-center gap-2 px-3 py-3 ${micro} text-[var(--ink-soft)] ${transition} hover:text-[var(--accent)] sm:inline-flex ${focusRing}`}
      >
        <span className="relative">
          Reviewer login
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-300 group-hover:scale-x-100"
          />
        </span>

        <span className="h-1.5 w-1.5 rotate-45 border border-[var(--accent)]" />
      </Link>

      {/* Main CTA */}
      <Link
        href="/register"
        className={`group relative inline-flex min-h-[44px] items-center gap-3 overflow-hidden border border-[var(--accent)] bg-[var(--accent)] px-5 py-3 ${micro} text-[var(--paper)] shadow-[0_6px_20px_rgba(180,93,60,0.18)] ${transition} hover:-translate-y-0.5 hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)] hover:shadow-[0_10px_28px_rgba(180,93,60,0.24)] ${focusRing}`}
      >
        <span className="relative z-10">Share a thought</span>

        <ArrowUpRight
          aria-hidden="true"
          className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          strokeWidth={1.6}
        />

        {/* Decorative sweep */}
        <span
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-20 w-20 rounded-full border border-white/20 transition-transform duration-500 group-hover:scale-[1.8]"
        />
      </Link>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Sign out                                                           */
/* ------------------------------------------------------------------ */

function SignOutButton() {
  return (
    <Link
      href="/api/auth/logout"
      className={`group inline-flex min-h-[40px] items-center gap-2 border border-[var(--line-strong)] bg-[var(--paper)] px-3.5 py-2.5 ${micro} text-[var(--ink-soft)] ${transition} hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30 hover:text-[var(--ink)] ${focusRing}`}
    >
      <span>Sign out</span>

      <LogOut
        aria-hidden="true"
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
        strokeWidth={1.6}
      />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Right actions                                                      */
/* ------------------------------------------------------------------ */

function RightActions({ extra }: { extra?: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      {extra}

      {extra && (
        <span
          aria-hidden="true"
          className="hidden h-5 w-px bg-[var(--line)] sm:block"
        />
      )}

      <SignOutButton />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header frame                                                       */
/* ------------------------------------------------------------------ */

function containerClasses(
  variant: HeaderVariant,
  wide: boolean,
  sticky: boolean,
  paddingBottom?: string,
) {
  const pb = paddingBottom ?? (variant === "dashboard-root" ? "pb-6" : "pb-5");

  const frame =
    variant === "public-home" || (wide && variant !== "auth")
      ? "mx-auto w-full max-w-7xl"
      : "";

  const pad =
    variant === "public-home"
      ? "px-6 py-6 md:px-10"
      : variant === "auth"
        ? pb
        : `px-0 pt-4 ${pb}`;

  const pinned = sticky
    ? [
        "sticky top-0 z-40",
        "border-b border-[var(--line)]",
        "bg-[var(--paper)]/95",
        "backdrop-blur-xl",
        "shadow-[0_8px_30px_rgba(24,35,41,0.06)]",
      ].join(" ")
    : "";

  const border =
    variant === "auth" ? "" : sticky ? "" : "border-b border-[var(--line)]";

  return [
    frame,
    "relative flex min-h-[68px] items-center justify-between gap-5",
    pad,
    border,
    pinned,
  ]
    .filter(Boolean)
    .join(" ");
}

/* ------------------------------------------------------------------ */
/* Header                                                             */
/* ------------------------------------------------------------------ */

export function Header({
  variant = "public-home",
  backHref,
  backLabel,
  rightContent,
  wide = false,
  paddingBottom,
  sticky = false,
}: HeaderProps) {
  const className = containerClasses(variant, wide, sticky, paddingBottom);

  switch (variant) {
    /* ============================================================ */
    /* Public                                                        */
    /* ============================================================ */

    case "public-home":
      return (
        <header className={className}>
          {/* Top architectural accent */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-0.5 w-24 bg-[var(--accent)]"
          />

          <Brand section="Private perception archive" href="/" />

          <PublicNavigation />
        </header>
      );

    /* ============================================================ */
    /* Auth                                                          */
    /* ============================================================ */

    case "auth":
      return (
        <header className={className}>
          <BackLink
            href={backHref ?? "/"}
            label={backLabel ?? "Back to Mirror"}
          />

          <div className="hidden items-center gap-3 sm:flex">
            <span className={`${micro} text-[var(--muted)]`}>
              Private access
            </span>

            <span className="h-1.5 w-1.5 rotate-45 bg-[var(--accent)]" />
          </div>
        </header>
      );

    /* ============================================================ */
    /* Dashboard root                                                */
    /* ============================================================ */

    case "dashboard-root":
      return (
        <header className={className}>
          <Brand section="Private archive" href="/dashboard" />

          <RightActions extra={rightContent} />
        </header>
      );

    /* ============================================================ */
    /* Dashboard sub                                                 */
    /* ============================================================ */

    case "dashboard-sub":
      return (
        <header className={className}>
          <BackLink
            href={backHref ?? "/dashboard"}
            label={backLabel ?? "Dashboard"}
          />

          <RightActions extra={rightContent} />
        </header>
      );

    /* ============================================================ */
    /* Dashboard detail                                              */
    /* ============================================================ */

    case "dashboard-detail":
      return (
        <header className={className}>
          <div className="flex min-w-0 items-center">
            <BackLink
              href={backHref ?? "/dashboard"}
              label={backLabel ?? "Dashboard"}
            />

            <div className="mx-4 hidden h-7 w-px bg-[var(--line)] sm:block" />

            <div className="hidden sm:block">
              <span className={`${micro} text-[var(--muted)]`}>Archive</span>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-[var(--accent)]" />
                <span className="text-[10px] text-[var(--ink-soft)]">
                  Detail view
                </span>
              </div>
            </div>
          </div>

          <RightActions extra={rightContent} />
        </header>
      );

    /* ============================================================ */
    /* Reviewer root                                                 */
    /* ============================================================ */

    case "reviewer-root":
      return (
        <header className={className}>
          <Brand section="Reviewer space" href="/review/intro" />

          <RightActions extra={rightContent} />
        </header>
      );

    /* ============================================================ */
    /* Reviewer sub                                                  */
    /* ============================================================ */

    case "reviewer-sub":
      return (
        <header className={className}>
          <BackLink
            href={backHref ?? "/review/intro"}
            label={backLabel ?? "Reviewer space"}
          />

          <RightActions extra={rightContent} />
        </header>
      );
  }
}
