"use client";

type FooterVariant = "public-home";
import Link from "next/link";
import { Mail, Phone, Globe } from "lucide-react";
import type { ReactNode } from "react";

interface FooterProps {
  variant?: FooterVariant;
}

/* ------------------------------------------------------------------ */
/* Contact data                                                        */
/* ------------------------------------------------------------------ */

const CONTACT = {
  instagramHandle: "__abdul.basitt",
  email: "abdulbasit.alpha25@gmail.com",
  phoneDisplay: "0341 5878569",
  // WhatsApp/tel links need the raw digits, country code, no leading 0.
  phoneIntl: "923415878569",
};

/* ------------------------------------------------------------------ */
/* Brand-mark SVGs (not in lucide-react, so hand-drawn to match stroke  */
/* weight / sizing of the rest of the icon set)                        */
/* ------------------------------------------------------------------ */

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
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

/* ------------------------------------------------------------------ */
/* Contact link — bordered icon box matching the footer's arrow-detail  */
/* treatment, with a tooltip label that rises on hover, and a hover     */
/* state colored to match that platform's own brand color. Uses inline  */
/* style handlers (not Tailwind hover: classes) so each icon can carry  */
/* its own literal brand color reliably, independent of the theme.      */
/* ------------------------------------------------------------------ */

function ContactLink({
  href,
  label,
  icon,
  external = true,
  brand,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
  /** Solid hex, or a CSS gradient string for multi-color brands (Instagram). */
  brand: string;
}) {
  const idleStyle: React.CSSProperties = {
    borderColor: "var(--line-strong)",
    background: "var(--paper)",
    color: "var(--ink-soft)",
    transform: "translateY(0)",
    boxShadow: "none",
  };

  const handleEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.borderColor = "transparent";
    e.currentTarget.style.background = brand;
    e.currentTarget.style.color = "#ffffff";
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 10px 22px rgba(24,35,41,0.22)";
  };

  const handleLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    Object.assign(e.currentTarget.style, idleStyle);
  };

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={label}
      title={label}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        ...idleStyle,
        position: "relative",
        display: "flex",
        height: "36px",
        width: "36px",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid var(--line-strong)",
        transition: "all 250ms ease",
      }}
      className="group/contact focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
    >
      {icon}

      {/* Tooltip */}
      <span
        aria-hidden="true"
        className="footer-tooltip pointer-events-none absolute -top-9 left-1/2 whitespace-nowrap px-2 py-1 text-[9px] font-medium uppercase opacity-0"
      >
        {label}
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function Footer({ variant = "public-home" }: FooterProps) {
  if (variant !== "public-home") {
    return null;
  }

  return (
    <footer className="group relative mt-20 overflow-hidden border-t border-[var(--line)] bg-[var(--paper-deep)]">
      {/* Animated accent line */}
      <div className="absolute left-0 top-0 h-px w-32 origin-left bg-gradient-to-r from-[var(--accent)] to-transparent transition-all duration-500 ease-out group-hover:w-72" />

      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 lg:px-10">
        {/* Main footer */}
        <div className="flex flex-col gap-12 sm:flex-row sm:items-end sm:justify-between">
          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              {/* ARCHER precision mark */}
              <div className="relative flex h-9 w-9 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-0 blur-md transition-all duration-500 group-hover:opacity-20" />

                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative h-9 w-9 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                  aria-hidden="true"
                >
                  <path
                    d="M20 3L34 35L23.5 27L20 37L16.5 27L6 35L20 3Z"
                    fill="url(#archer-footer)"
                  />

                  <path
                    d="M20 5V34"
                    stroke="var(--paper)"
                    strokeOpacity="0.45"
                    strokeWidth="1"
                  />

                  <defs>
                    <linearGradient
                      id="archer-footer"
                      x1="9"
                      y1="5"
                      x2="31"
                      y2="35"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="var(--accent-soft)" />
                      <stop offset="0.5" stopColor="var(--accent)" />
                      <stop offset="1" stopColor="var(--accent-hover)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Divider */}
              <div className="h-5 w-px bg-[var(--line-strong)] transition-colors duration-300 group-hover:bg-[var(--accent)]" />

              {/* Brand name */}
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.42em] text-[var(--muted)] transition-all duration-300 hover:tracking-[0.5em] hover:text-[var(--accent)] group-hover:text-[var(--ink-soft)]">
                  Powered by
                </p>

                <Link
                  href="https://abdulbasit-archer.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit ARCHER portfolio"
                  className="action-link group/link relative mt-0.5 inline-block text-lg font-semibold tracking-[0.28em] text-[var(--ink)] underline-offset-4 transition-all duration-300 ease-out hover:translate-x-1 hover:tracking-[0.34em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                >
                  ARCHER
                  <span
                    aria-hidden="true"
                    className="footer-tooltip pointer-events-none absolute -top-9 left-1/2 whitespace-nowrap px-2 py-1 text-[9px] font-medium uppercase opacity-0"
                  >
                    Visit portfolio
                  </span>
                </Link>
              </div>
            </div>

            <p className="max-w-md text-sm leading-6 text-[var(--ink-soft)] transition-colors duration-300 group-hover:text-[var(--ink)]">
              Built with precision. Designed with intent.
            </p>

            {/* Contact row */}
            <div className="mt-6 flex items-center gap-2.5">
              <ContactLink
                href="https://www.instagram.com/__abdul.basitt/"
                label={`Instagram @${CONTACT.instagramHandle}`}
                icon={<InstagramIcon />}
                brand="linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 70%, #515bd4 100%)"
              />
              <ContactLink
                href={`https://wa.me/${CONTACT.phoneIntl}`}
                label="WhatsApp"
                icon={<WhatsAppIcon />}
                brand="#25D366"
              />
              <ContactLink
                href={`mailto:${CONTACT.email}`}
                label={CONTACT.email}
                icon={<Mail className="h-4 w-4" strokeWidth={1.6} />}
                external={false}
                brand="#EA4335"
              />
              <ContactLink
                href={`tel:+${CONTACT.phoneIntl}`}
                label={CONTACT.phoneDisplay}
                icon={<Phone className="h-4 w-4" strokeWidth={1.6} />}
                external={false}
                brand="#34C759"
              />
              <ContactLink
                href="https://abdulbasit-archer.vercel.app/"
                label="Portfolio"
                icon={<Globe className="h-4 w-4" strokeWidth={1.6} />}
                brand="var(--accent)"
              />
            </div>
          </div>

          {/* Signature */}
          <div className="sm:text-right">
            <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-[var(--muted)] transition-all duration-300 group-hover:tracking-[0.4em] group-hover:text-[var(--ink-soft)]">
              Precision{" "}
              <span className="text-[var(--accent)] transition-transform duration-300 group-hover:inline-block group-hover:scale-125">
                •
              </span>{" "}
              Intelligence{" "}
              <span className="text-[var(--accent)] transition-transform duration-300 group-hover:inline-block group-hover:scale-125">
                •
              </span>{" "}
              Design
            </p>

            <p className="mt-3 text-xs text-[var(--muted)] transition-colors duration-300 hover:text-[var(--accent)] group-hover:text-[var(--ink-soft)]">
              © {new Date().getFullYear()} ARCHER
            </p>
          </div>
        </div>

        {/* Bottom architectural divider */}
        <div className="mt-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--line)] transition-colors duration-500 group-hover:bg-[var(--line-strong)]" />

          {/* Arrow detail */}
          <div className="group/arrow flex h-7 w-7 cursor-default items-center justify-center border border-[var(--line-strong)] bg-[var(--paper)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:border-[var(--accent)] hover:bg-[var(--paper-deep)]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover/arrow:scale-110"
            >
              <path
                d="M7 1L12 12L8.5 9.5L7 13L5.5 9.5L2 12L7 1Z"
                fill="var(--accent)"
                className="transition-opacity duration-300 group-hover/arrow:opacity-80"
              />
            </svg>
          </div>

          <div className="h-px flex-1 bg-[var(--line)] transition-colors duration-500 group-hover:bg-[var(--line-strong)]" />
        </div>

        {/* Minimal footer metadata */}
        <div className="mt-5 flex flex-col gap-2 text-[9px] uppercase tracking-[0.2em] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span className="cursor-default transition-all duration-300 hover:translate-x-1 hover:text-[var(--ink-soft)]">
            Independent digital work
          </span>

          <span className="hidden opacity-40 transition-opacity duration-300 group-hover:opacity-100 sm:block">
            /
          </span>

          <span className="cursor-default transition-all duration-300 hover:-translate-x-1 hover:text-[var(--ink-soft)]">
            Built for Clouser
          </span>
        </div>
      </div>
    </footer>
  );
}
