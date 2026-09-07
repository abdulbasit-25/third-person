import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function RegisterPage() {
  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Link href="/" className="eyebrow">
        ← Back to Mirror
      </Link>
      <div className="mx-auto grid max-w-5xl items-center gap-16 py-20 md:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="eyebrow mb-6">A considered invitation</p>
          <h1 className="display text-7xl leading-[.88]">
            Say the
            <br />
            <i>real thing.</i>
          </h1>
          <p className="mt-8 max-w-sm font-serif text-xl leading-relaxed text-[var(--muted)]">
            There are no perfect answers here. Specific, kind, honest is plenty.
          </p>
        </div>
        <div className="border-l hairline pl-8 md:pl-14">
          <AuthForm mode="register" />
          <p className="mt-8 text-center text-xs text-[var(--muted)]">
            Already shared your perspective?{" "}
            <Link className="text-[var(--accent)]" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
