"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, Instagram, Mail, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

/* ── Newsletter ─────────────────────────────────── */
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="text-sm text-muted-foreground">
        You're on the list —{" "}
        <span className="text-olive">first word on what's new</span> lands in
        your inbox.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.trim()) setDone(true);
      }}
      className="flex items-center gap-3 border-b border-hairline pb-3 transition-colors focus-within:border-olive"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
      />
      <button
        type="submit"
        className="label-caps group flex shrink-0 items-center gap-1.5 text-olive transition-colors hover:text-foreground"
      >
        Subscribe
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </form>
  );
}

/* ── WhatsApp glyph (not in lucide-react) ───────── */
function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="h-4 w-4"
    >
      <path
        d="M12.02 3C7.32 3 3.5 6.82 3.5 11.52c0 1.62.45 3.13 1.24 4.42L3 21l5.19-1.68a8.47 8.47 0 0 0 3.83.92h.01c4.7 0 8.52-3.82 8.52-8.52C20.55 6.82 16.73 3 12.02 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.1 8.2c.18-.4.37-.41.54-.42.14-.01.3-.01.44-.01.14 0 .34-.05.53.41.2.47.68 1.62.74 1.74.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.32-.36.43-.12.12-.24.25-.1.49.14.24.62 1.02 1.33 1.65.92.82 1.69 1.07 1.93 1.19.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.14-.2.56-1.16 1.1-1.6 1.17-.4.06-.9.09-1.46-.09-.34-.1-.78-.25-1.34-.49-2.36-1.02-3.9-3.4-4.02-3.56-.12-.16-.96-1.28-.96-2.44 0-1.16.6-1.73.82-1.97Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ── Brand-colored contact icon ─────────────────────
   Zyence's tooltip + hairline-border treatment, but each icon washes
   to its own platform's brand color on hover (ARCHER's footer). ── */
function ContactIcon({
  href,
  label,
  icon,
  brand,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  brand: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          aria-label={label}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = brand;
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "";
            e.currentTarget.style.borderColor = "";
            e.currentTarget.style.color = "";
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-muted-foreground transition-all duration-300 hover:-translate-y-0.5"
        >
          {icon}
        </a>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/* ── Data ───────────────────────────────────────── */
// 3rd Person's own contact points — swap in the real handles/addresses.
const contacts = [
  {
    href: "mailto:hello@3rdperson.com",
    label: "Email us",
    icon: <Mail className="h-4 w-4" />,
    brand: "#EA4335",
  },
  {
    href: "https://instagram.com/3rdperson",
    label: "Follow us on Instagram",
    icon: <Instagram className="h-4 w-4" />,
    brand:
      "linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 70%, #515bd4 100%)",
  },
  {
    href: "https://wa.me/10000000000",
    label: "Message us on WhatsApp",
    icon: <WhatsAppIcon />,
    brand: "#25D366",
  },
] as const;

const columns = [
  {
    heading: "Platform",
    links: [
      { label: "Overview", to: "/" },
      { label: "Features", to: "/features" },
      { label: "Pricing", to: "/pricing" },
      { label: "Changelog", to: "/changelog" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Sign in", to: "/login" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms & Conditions", to: "/terms-conditions" },
      { label: "Cookie Policy", to: "/cookie-policy" },
    ],
  },
] as const;

// The studio that designed & built the site — from ARCHER's own footer.
const STUDIO = {
  name: "ARCHER",
  portfolio: "https://abdulbasit-archer.vercel.app/",
  email: "abdulbasit.alpha25@gmail.com",
  whatsapp: "https://wa.me/923415878569",
};

export function SiteFooter() {
  return (
    <footer className="group/footer rule-top relative mt-24 overflow-hidden bg-surface">
      {/* ── Animated accent line (from ARCHER) ─────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px w-24 bg-olive transition-all duration-500 ease-out group-hover/footer:w-56"
      />

      {/* ── Brand + newsletter ─────────────────── */}
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-16 md:grid-cols-12 md:px-10 md:py-20">
        <div className="md:col-span-5">
          <p className="label-caps mb-5 text-muted-foreground">
            Est. 2026 — Independent platform
          </p>
          <p className="font-display text-5xl leading-none tracking-tight md:text-6xl">
            3rd Person<span className="text-olive">.</span>
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Built with precision, told from the outside in.
          </p>
          <div className="mt-7 flex items-center gap-3">
            {contacts.map((c) => (
              <ContactIcon key={c.label} {...c} />
            ))}
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:self-end">
          <p className="label-caps mb-4 text-muted-foreground">
            First word on what we ship
          </p>
          <NewsletterForm />
          <p className="mt-3 text-xs text-muted-foreground">
            One email per update. No noise, unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* ── Link columns ───────────────────────── */}
      <div className="rule-top">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 sm:grid-cols-4 md:px-10">
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="label-caps mb-5 text-muted-foreground">
                {col.heading}
              </p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.to} className="link-underline w-fit">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ── Colophon ───────────────────────────── */}
      <div className="rule-top">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-5 py-5 text-center text-xs text-muted-foreground md:px-10">
          <Sparkles className="h-3.5 w-3.5 text-olive" aria-hidden />
          <span>Designed &amp; built by</span>
          <a
            href={STUDIO.portfolio}
            target="_blank"
            rel="noreferrer"
            className="link-underline text-foreground"
          >
            {STUDIO.name}
          </a>
          <span aria-hidden>—</span>
          <span>available for remote work worldwide</span>
          <span aria-hidden>·</span>
          <a href={`mailto:${STUDIO.email}`} className="link-underline">
            Email
          </a>
          <span aria-hidden>·</span>
          <a
            href={STUDIO.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="link-underline"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* ── Giant cropped wordmark ─────────────── */}
      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden"
      >
        <p className="mx-auto -mb-[0.18em] whitespace-nowrap text-center font-display text-[clamp(3.5rem,13vw,13rem)] leading-[0.8] tracking-tight text-foreground/[0.05]">
          3rd Person
        </p>
      </div>

      {/* ── Arrow-detail divider (from ARCHER) ─── */}
      <div className="rule-top">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-5 py-5 md:px-10">
          <div className="h-px flex-1 bg-hairline" />
          <div className="flex h-7 w-7 items-center justify-center border border-hairline transition-all duration-300 group-hover/footer:border-olive">
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M7 1L12 12L8.5 9.5L7 13L5.5 9.5L2 12L7 1Z"
                className="fill-olive"
              />
            </svg>
          </div>
          <div className="h-px flex-1 bg-hairline" />
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────── */}
      <div className="rule-top relative bg-surface">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-10">
          <span>© 2026 3rd Person</span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-olive" aria-hidden />
            Independent digital work
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="label-caps group flex w-fit items-center gap-1.5 transition-colors hover:text-foreground"
          >
            Back to top
            <ArrowUp className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
