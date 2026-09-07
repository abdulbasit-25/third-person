"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "register" | "admin" }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
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
    <form onSubmit={submit} className="space-y-5">
      {mode === "register" && (
        <label className="block">
          <span className="eyebrow mb-2 block">Your name</span>
          <input
            required
            name="displayName"
            className="w-full border-b hairline bg-transparent px-0 py-3 font-medium outline-none transition-[border-color,border-width] duration-200 focus:border-b-2 focus:border-[var(--accent)]"
            placeholder="e.g. Sana Khan"
          />
        </label>
      )}
      <label className="block">
        <span className="eyebrow mb-2 block">Username</span>
        <input
          required
          name="username"
          className="w-full border-b hairline bg-transparent px-0 py-3 font-medium outline-none transition-[border-color,border-width] duration-200 focus:border-b-2 focus:border-[var(--accent)]"
          placeholder="your_name or email"
        />
      </label>
      <label className="block">
        <span className="eyebrow mb-2 block">Password</span>
        <div className="relative">
          <input
            required
            minLength={8}
            type={showPassword ? "text" : "password"}
            name="password"
            className="w-full border-b hairline bg-transparent px-0 py-3 pr-9 font-medium outline-none transition-[border-color,border-width] duration-200 focus:border-b-2 focus:border-[var(--accent)]"
            placeholder="At least 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </label>
      {mode === "register" && (
        <label className="block">
          <span className="eyebrow mb-2 block">You are a</span>
          <select
            name="status"
            className="w-full border-b hairline bg-transparent py-3 font-medium outline-none transition-[border-color,border-width] duration-200 focus:border-b-2 focus:border-[var(--accent)]"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>
      )}
      {error && (
        <p className="animate-[fade-up_0.3s_ease-both] border-l-2 border-[var(--accent)] px-3 text-xs font-semibold text-[var(--accent)]">
          {error}
        </p>
      )}
      <button
        disabled={loading}
        className="group flex w-full items-center justify-center gap-2 bg-[var(--ink)] px-5 py-4 text-[11px] font-semibold uppercase tracking-[.14em] text-[var(--paper)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent)] disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? (
          "One moment..."
        ) : (
          <>
            {mode === "register"
              ? "Create your reviewer space"
              : "Enter Mirror"}
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.75}
            />
          </>
        )}
      </button>
    </form>
  );
}
