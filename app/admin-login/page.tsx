import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { AuthForm } from "@/components/auth-form";
export default function AdminLoginPage() {
  return (
    <main className="mirror-grid min-h-screen px-6 py-8 md:px-10">
      <Header variant="auth" backLabel="Mirror" />
      <div className="mx-auto max-w-md py-28">
        <p className="eyebrow mb-6">Private archive / administrator</p>
        <h1 className="display text-7xl leading-[.88]">
          The
          <br />
          <i>keeper.</i>
        </h1>
        <div className="mt-12 border-t hairline pt-8">
          <AuthForm mode="admin" />
        </div>
      </div>
      <Footer />
    </main>
  );
}
