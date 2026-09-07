import Link from "next/link";
import { ArrowUpRight, ArrowLeft, LogOut } from "lucide-react";

type HeaderVariant =
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
  rightContent?: React.ReactNode;
  wide?: boolean;
  paddingBottom?: string;
}

function SignOutLink({ withIcon = false }: { withIcon?: boolean }) {
  if (withIcon) {
    return (
      <Link
        href="/api/auth/logout"
        className="eyebrow inline-flex items-center gap-2 transition-colors hover:text-[var(--accent)]"
      >
        Sign out
        <LogOut className="h-3 w-3" strokeWidth={1.75} />
      </Link>
    );
  }
  return (
    <Link href="/api/auth/logout" className="eyebrow transition-colors hover:text-[var(--accent)]">
      Sign out
    </Link>
  );
}

function buildClasses(variant: HeaderVariant, wide?: boolean, paddingBottom?: string) {
  const pb = paddingBottom ?? (variant === "dashboard-root" ? "pb-6" : "pb-5");
  const px = variant === "public-home" ? "px-6 md:px-10" : "";
  const py = variant === "public-home" ? "py-5" : "";
  const maxW = wide ? "max-w-7xl" : "";
  const mxAuto = wide ? "mx-auto" : "";

  switch (variant) {
    case "public-home":
      return `${mxAuto} flex max-w-7xl items-center justify-between border-b hairline ${px} ${py}`;
    case "auth":
      return `flex ${pb}`;
    case "dashboard-root":
      return `${mxAuto} ${maxW} flex items-center justify-between border-b hairline ${pb}`;
    default:
      return `flex items-center justify-between border-b hairline ${pb}`;
  }
}

export function Header({
  variant = "public-home",
  backHref,
  backLabel,
  rightContent,
  wide = false,
  paddingBottom,
}: HeaderProps) {
  const classes = buildClasses(variant, wide, paddingBottom);

  if (variant === "public-home") {
    return (
      <nav className={classes}>
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

  if (variant === "auth") {
    return (
      <Link
        href={backHref ?? "/"}
        className="eyebrow inline-flex items-center gap-2 transition-colors hover:text-[var(--accent)]"
      >
        <ArrowLeft className="h-3 w-3" strokeWidth={1.75} />
        {backLabel ?? "Back to Mirror"}
      </Link>
    );
  }

  if (variant === "dashboard-root") {
    return (
      <header className={classes}>
        <span className="eyebrow">Mirror — private archive</span>
        <SignOutLink withIcon />
      </header>
    );
  }

  if (variant === "dashboard-sub") {
    return (
      <header className={classes}>
        <Link
          href={backHref ?? "/dashboard"}
          className="eyebrow inline-flex items-center gap-2 transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.75} />
          {backLabel ?? "Dashboard"}
        </Link>
        <SignOutLink withIcon />
      </header>
    );
  }

  if (variant === "dashboard-detail") {
    return (
      <header className={classes}>
        <Link href={backHref ?? "/dashboard"} className="eyebrow transition-colors hover:text-[var(--accent)]">
          ← {backLabel ?? "Dashboard"}
        </Link>
        <SignOutLink />
      </header>
    );
  }

  if (variant === "reviewer-root") {
    return (
      <header className={classes}>
        <span className="eyebrow">Mirror / reviewer space</span>
        <div className="flex items-center gap-5">
          {rightContent}
          <SignOutLink />
        </div>
      </header>
    );
  }

  if (variant === "reviewer-sub") {
    return (
      <header className={classes}>
        <Link href={backHref ?? "/review/intro"} className="eyebrow transition-colors hover:text-[var(--accent)]">
          ← {backLabel ?? "Reviewer space"}
        </Link>
        {rightContent ?? <SignOutLink />}
      </header>
    );
  }

  return null;
}
