"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" | "admin" }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
            className="w-full border-b hairline bg-transparent px-0 py-3 outline-none focus:border-[var(--accent)]"
            placeholder="e.g. Sana Khan"
          />
        </label>
      )}
      <label className="block">
        <span className="eyebrow mb-2 block">Username</span>
        <input
          required
          name="username"
          className="w-full border-b hairline bg-transparent px-0 py-3 outline-none focus:border-[var(--accent)]"
          placeholder="your_name or email"
        />
      </label>
      <label className="block">
        <span className="eyebrow mb-2 block">Password</span>
        <input
          required
          minLength={8}
          type="password"
          name="password"
          className="w-full border-b hairline bg-transparent px-0 py-3 outline-none focus:border-[var(--accent)]"
          placeholder="At least 8 characters"
        />
      </label>
      {mode === "register" && (
        <label className="block">
          <span className="eyebrow mb-2 block">You are a</span>
          <select
            name="status"
            className="w-full border-b hairline bg-transparent py-3 outline-none"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </label>
      )}
      {error && (
        <p className="border-l-2 border-[var(--accent)] px-3 text-xs text-[var(--accent)]">
          {error}
        </p>
      )}
      <button
        disabled={loading}
        className="w-full bg-[var(--ink)] px-5 py-4 text-[11px] uppercase tracking-[.14em] text-[var(--paper)] transition-colors hover:bg-[var(--accent)] disabled:opacity-50"
      >
        {loading
          ? "One moment..."
          : mode === "register"
            ? "Create your reviewer space ↗"
            : "Enter Mirror ↗"}
      </button>
    </form>
  );
}
