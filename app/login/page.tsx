import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Header variant="auth" />
      <div className="mx-auto grid max-w-5xl items-center gap-14 py-16 md:grid-cols-[.9fr_1.1fr] md:gap-16 md:py-24">
        <div>
          <p className="eyebrow mb-6">Reviewer access</p>
          <h1 className="display text-5xl leading-[.9] sm:text-6xl lg:text-7xl lg:leading-[.88]">
            Pick up
            <br />
            the thread.
          </h1>
          <p className="mt-8 max-w-sm font-serif text-xl leading-relaxed text-[var(--muted)]">
            Your review is a living note. Come back when your perspective has
            moved.
          </p>
        </div>
        <div className="border-t hairline pt-10 md:border-l md:border-t-0 md:pl-14 md:pt-0">
          <AuthForm mode="login" />
          {/* <p className="mt-8 text-center text-xs text-[var(--muted)]">
            New here?{" "}
            <Link className="action-link text-[var(--accent)]" href="/register">
              Create a reviewer account
            </Link>
          </p> */}
          <p className="mt-3 text-center text-xs text-[var(--muted)]">
            Administrator?{" "}
            <Link
              className="action-link text-[var(--accent)]"
              href="/admin-login"
            >
              Use administrator sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
