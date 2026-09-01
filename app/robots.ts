import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shine-design-signage-ax.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Business AX는 내부 운영 화면이므로 색인하지 않는다
      { userAgent: "*", allow: "/", disallow: ["/ax"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
