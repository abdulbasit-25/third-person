"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowUpRight,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

/* ---------------------------------------------------------------- */
/*  Per-mode copy — headings, CTAs, footer links                    */
/* ---------------------------------------------------------------- */

const COPY = {
  login: {
    badge: "Sign in",
    icon: User,
    heading: "Welcome back",
    subheading: "Sign in to pick up right where you left off.",
    cta: "Sign in to Mirror",
    loading: "Signing you in…",
    footer: {
      text: "New to Mirror?",
      label: "Create an account",
      href: "/register",
    },
  },
  register: {
    badge: "Get started",
    icon: Sparkles,
    heading: "Create your reviewer space",
    subheading: "One account — practice, review and track your progress.",
    cta: "Create my space",
    loading: "Building your space…",
    footer: {
      text: "Already have an account?",
      label: "Sign in instead",
      href: "/login",
    },
  },
  admin: {
    badge: "Restricted",
    icon: ShieldCheck,
    heading: "Administrator access",
    subheading: "This area is limited to authorised staff only.",
    cta: "Unlock dashboard",
    loading: "Verifying…",
    footer: null,
  },
} as const;

type Mode = keyof typeof COPY;

/* ---------------------------------------------------------------- */
/*  Password strength                                               */
/* ---------------------------------------------------------------- */

function getStrength(pw: string) {
  if (!pw) return -1; // hidden
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0–3
}

const STRENGTH_META = [
  { label: "Weak", bars: 1, bar: "bg-red-400", text: "text-red-400" },
  { label: "Fair", bars: 2, bar: "bg-amber-400", text: "text-amber-500" },
  { label: "Strong", bars: 3, bar: "bg-emerald-400", text: "text-emerald-500" },
] as const;

/* ---------------------------------------------------------------- */
/*  Shared pieces                                                   */
/* ---------------------------------------------------------------- */

const inputBase =
  "w-full border-b hairline bg-transparent px-0 py-3 font-medium text-[var(--ink)] outline-none transition-colors duration-200 placeholder:font-normal placeholder:text-[var(--muted)]/60";

/** Accent underline that grows in on focus — no layout shift. */
function Underline() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-300 ease-out group-focus-within:scale-x-100"
    />
  );
}

/* ---------------------------------------------------------------- */

export function AuthForm({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();

  const strength = mode === "register" ? getStrength(password) : -1;
  const strengthMeta =
    strength >= 0 ? STRENGTH_META[Math.min(strength, 2)] : null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const data = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as Record<string, string>;
    const endpoint =
      mode === "register"
        ? "/api/auth/register"
        : mode === "admin"
          ? "/api/auth/admin-login"
          : "/api/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "register"
            ? { ...data, status: data.status || "student" }
            : data,
        ),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "We could not complete that request.");
        return;
      }
      router.push(
        result.role === "admin" || mode === "admin"
          ? "/dashboard"
          : "/review/intro",
      );
    } catch {
      setError("The server could not be reached. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-7">
      {/* ---------- Heading ---------- */}
      <header>
        <span className="eyebrow inline-flex items-center gap-2 text-[var(--accent)]">
          <copy.icon aria-hidden className="h-3.5 w-3.5" strokeWidth={1.75} />
          {copy.badge}
        </span>
        <h1 className="mt-3 text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-[var(--ink)] md:text-4xl">
          {copy.heading}
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
          {copy.subheading}
        </p>
      </header>

      {/* ---------- Fields ---------- */}
      <fieldset
        disabled={loading}
        className="space-y-6 border-0 p-0 disabled:opacity-60"
      >
        {mode === "register" && (
          <label className="group block">
            <span className="eyebrow mb-2 block">Full name</span>
            <div className="relative">
              <input
                required
                name="displayName"
                autoComplete="name"
                className={inputBase}
                placeholder="e.g. Sana Khan"
              />
              <Underline />
            </div>
          </label>
        )}

        <label className="group block">
          <span className="eyebrow mb-2 block">Username or email</span>
          <div className="relative">
            <input
              required
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={inputBase}
              placeholder={
                mode === "admin" ? "Admin username" : "your_name or email"
              }
            />
            <Underline />
          </div>
        </label>

        <div className="group">
          <span className="eyebrow mb-2 flex items-baseline justify-between">
            <label htmlFor="password">Password</label>
            {mode === "login" && (
              <a
                href="/forgot-password"
                className="text-[10px] normal-case tracking-normal text-[var(--muted)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
              >
                Forgot?
              </a>
            )}
          </span>
          <div className="relative">
            <input
              id="password"
              required
              minLength={mode === "register" ? 8 : undefined}
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputBase} pr-10`}
              placeholder={
                mode === "register" ? "At least 8 characters" : "••••••••"
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--muted)] transition-colors hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Eye className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
            <Underline />
          </div>

          {strengthMeta && (
            <div
              aria-live="polite"
              className="mt-2.5 animate-[fade-up_0.25s_ease-both]"
            >
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${
                      i < strengthMeta.bars
                        ? strengthMeta.bar
                        : "bg-[var(--muted)]/15"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`mt-1.5 text-[10px] font-semibold uppercase tracking-[.14em] ${strengthMeta.text}`}
              >
                {strengthMeta.label}
              </p>
            </div>
          )}
        </div>

        {mode === "register" && (
          <label className="group block">
            <span className="eyebrow mb-2 block">I&apos;m joining as</span>
            <div className="relative">
              <select
                name="status"
                defaultValue="student"
                className={`${inputBase} appearance-none pr-8`}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
                strokeWidth={1.75}
              />
              <Underline />
            </div>
          </label>
        )}
      </fieldset>

      {/* ---------- Error ---------- */}
      {error && (
        <div
          role="alert"
          className="flex animate-[fade-up_0.3s_ease-both] items-start gap-2.5 border-l-2 border-red-400 bg-red-400/5 px-3.5 py-3"
        >
          <AlertCircle
            aria-hidden
            className="mt-px h-3.5 w-3.5 shrink-0 text-red-400"
            strokeWidth={1.75}
          />
          <p className="text-xs font-medium leading-relaxed text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* ---------- Submit ---------- */}
      <button
        type="submit"
        disabled={loading}
        className="group flex w-full items-center justify-center gap-2.5 bg-[var(--ink)] px-5 py-4 text-[11px] font-semibold uppercase tracking-[.16em] text-[var(--paper)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:shadow-[0_14px_30px_-14px_var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2
              aria-hidden
              className="h-3.5 w-3.5 animate-spin"
              strokeWidth={2}
            />
            {copy.loading}
          </>
        ) : (
          <>
            {copy.cta}
            <ArrowUpRight
              aria-hidden
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </>
        )}
      </button>

      {/* ---------- Footer swap link ---------- */}
      {copy.footer && (
        <p className="border-t hairline pt-5 text-center text-xs text-[var(--muted)]">
          {copy.footer.text}{" "}
          <Link
            href={copy.footer.href}
            className="font-semibold text-[var(--ink)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
          >
            {copy.footer.label}
          </Link>
        </p>
      )}
    </form>
  );
}
