import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Header variant="auth" />
      <div className="mx-auto grid max-w-5xl items-center gap-14 py-16 md:grid-cols-[.9fr_1.1fr] md:gap-16 md:py-24">
        <div>
          <p className="eyebrow mb-6">A considered invitation</p>
          <h1 className="display text-5xl leading-[.9] sm:text-6xl lg:text-7xl lg:leading-[.88]">
            Say the
            <br />
            real thing.
          </h1>
          <p className="mt-8 max-w-sm font-serif text-xl leading-relaxed text-[var(--muted)]">
            There are no perfect answers here. Specific, kind, honest is plenty.
          </p>
        </div>
        <div className="border-t hairline pt-10 md:border-l md:border-t-0 md:pl-14 md:pt-0">
          <AuthForm mode="register" />
          <p className="mt-8 text-center text-xs text-[var(--muted)]">
            Already shared your perspective?{" "}
            <Link className="text-[var(--accent)]" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
