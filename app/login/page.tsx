import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function LoginPage() {
  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Link href="/" className="eyebrow">
        ← Back to Mirror
      </Link>
      <div className="mx-auto grid max-w-5xl items-center gap-16 py-24 md:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="eyebrow mb-6">Reviewer access</p>
          <h1 className="display text-7xl leading-[.88]">
            Pick up
            <br />
            <i>the thread.</i>
          </h1>
          <p className="mt-8 max-w-sm font-serif text-xl leading-relaxed text-[var(--muted)]">
            Your review is a living note. Come back when your perspective has
            moved.
          </p>
        </div>
        <div className="border-l hairline pl-8 md:pl-14">
          <AuthForm mode="login" />
          <p className="mt-8 text-center text-xs text-[var(--muted)]">
            New here?{" "}
            <Link className="text-[var(--accent)]" href="/register">
              Create a reviewer account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
