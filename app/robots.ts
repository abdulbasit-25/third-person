import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin-login",
        "/dashboard/",
        "/login",
        "/register",
        "/review/",
      ],
    },
    sitemap: new URL(
      "/sitemap.xml",
      process.env.NEXT_PUBLIC_SITE_URL || "https://archiveme.vercel.app",
    ).toString(),
  };
}
