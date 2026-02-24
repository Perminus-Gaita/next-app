import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://appnyumbani.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/i/",
        disallow: ["/api/", "/profile/", "/settings/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
