import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://archiveme.vercel.app"),
  title: "Mirror / Abdul Basit",
  description:
    "Mirror is a private perception archive for Abdul Basit - honest perspectives, remembered moments, and a more complete picture over time.",
  applicationName: "Mirror",
  generator: "Next.js",
  keywords: [
    "Mirror",
    "Abdul Basit",
    "private perception archive",
    "personal feedback",
    "honest perspectives",
  ],
  authors: [{ name: "Abdul Basit" }],
  creator: "Abdul Basit",
  publisher: "Abdul Basit",
  alternates: {
    canonical: "/",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Mirror / Abdul Basit",
    description:
      "A private perception archive for honest perspectives and a more complete picture over time.",
    type: "website",
    locale: "en_US",
    siteName: "Mirror",
    url: "/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1254,
        height: 1254,
        alt: "Mirror - a private perception archive for Abdul Basit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirror / Abdul Basit",
    description:
      "A private perception archive for honest perspectives and a more complete picture over time.",
    images: ["/og-image.jpg"],
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
