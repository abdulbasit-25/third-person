import Link from "next/link";
import { ArrowLeft, ArrowUpRight, LogOut } from "lucide-react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
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
  /** Pin to the top of the viewport while scrolling. */
  sticky?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                     */
/* ------------------------------------------------------------------ */

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]";

const linkBase = `eyebrow inline-flex items-center gap-2 transition-colors duration-200 hover:text-[var(--accent)] ${focusRing}`;

/** Brand lockup: rotating mark · wordmark · hairline · section label. */
function Brand({ section, href }: { section: string; href?: string }) {
  const content = (
    <>
      <span
        aria-hidden
        className="h-2 w-2 shrink-0 rotate-45 bg-[var(--accent)] transition-transform duration-500 ease-out group-hover:rotate-[225deg]"
      />
      <span className="eyebrow font-semibold text-[var(--ink)]">Mirror</span>
      <span aria-hidden className="h-px w-5 shrink-0 bg-[var(--ink)]/25" />
      <span className="eyebrow min-w-0 truncate text-[var(--muted)]">
        {section}
      </span>
    </>
  );

  return href ? (
    <Link
      href={href}
      aria-label={`Mirror — ${section}`}
      className={`group inline-flex min-w-0 items-center gap-2.5 ${focusRing}`}
    >
      {content}
    </Link>
  ) : (
    <span className="group inline-flex min-w-0 items-center gap-2.5">
      {content}
    </span>
  );
}

/** Back link with a sliding arrow. */
function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={`group ${linkBase}`}>
      <ArrowLeft
        aria-hidden
        className="h-3 w-3 shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
        strokeWidth={1.75}
      />
      {label}
    </Link>
  );
}

/** Ghost-bordered sign-out button. */
function SignOutButton() {
  return (
    <Link
      href="/api/auth/logout"
      className={`eyebrow group inline-flex shrink-0 items-center gap-2 border border-[var(--ink)]/15 px-3.5 py-2 text-[var(--muted)] transition-all duration-200 hover:border-[var(--ink)] hover:text-[var(--ink)] ${focusRing}`}
    >
      Sign out
      <LogOut
        aria-hidden
        className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
        strokeWidth={1.75}
      />
    </Link>
  );
}

/** Right-side cluster: optional extra actions + sign out. */
function RightActions({ extra }: { extra?: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-3 sm:gap-4">
      {extra}
      <SignOutButton />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout                                                            */
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
      ? "px-6 py-5 md:px-10"
      : variant === "auth"
        ? pb
        : `pt-3 ${pb}`;
  const border = variant === "auth" ? "" : "border-b hairline";
  const pinned = sticky
    ? "sticky top-0 z-40 bg-[var(--paper)]/85 backdrop-blur-md"
    : "";

  return [frame, "flex items-center justify-between gap-4", pad, border, pinned]
    .filter(Boolean)
    .join(" ");
}

/* ------------------------------------------------------------------ */
/*  Header                                                            */
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
    /* Marketing site — brand + primary nav */
    case "public-home":
      return (
        <header className={className}>
          <Brand section="Private perception archive" href="/" />
          <nav
            aria-label="Primary"
            className="flex shrink-0 items-center gap-4 sm:gap-7"
          >
            <Link
              href="/login"
              className="eyebrow group relative hidden py-1 transition-colors duration-200 hover:text-[var(--accent)] sm:inline-flex"
            >
              Reviewer login
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-300 group-hover:scale-x-100"
              />
            </Link>
            <Link
              href="/register"
              className="eyebrow group inline-flex items-center gap-1.5 border border-[var(--ink)] px-4 py-2.5 transition-all duration-200 hover:bg-[var(--ink)] hover:text-[var(--paper)]"
            >
              Share a thought
              <ArrowUpRight
                aria-hidden
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </Link>
          </nav>
        </header>
      );

    /* Auth pages — lone back link */
    case "auth":
      return (
        <header className={className}>
          <BackLink
            href={backHref ?? "/"}
            label={backLabel ?? "Back to Mirror"}
          />
        </header>
      );

    /* App shells */
    case "dashboard-root":
      return (
        <header className={className}>
          <Brand section="Private archive" href="/dashboard" />
          <RightActions extra={rightContent} />
        </header>
      );

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

    case "dashboard-detail":
      return (
        <header className={className}>
          <BackLink
            href={backHref ?? "/dashboard"}
            label={backLabel ?? "Dashboard"}
          />
          <RightActions extra={rightContent} />
        </header>
      );

    case "reviewer-root":
      return (
        <header className={className}>
          <Brand section="Reviewer space" href="/review/intro" />
          <RightActions extra={rightContent} />
        </header>
      );

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
