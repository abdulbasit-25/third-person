import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mirror / Abdul Basit",
  description: "A private perception archive.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Mirror / Abdul Basit",
    description: "A private perception archive.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mirror / Abdul Basit",
    description: "A private perception archive.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3efe7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
