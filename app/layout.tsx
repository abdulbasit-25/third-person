import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mirror / Abdul Basit",
  description: "A private perception archive.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
