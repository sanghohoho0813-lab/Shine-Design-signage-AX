import type { MetadataRoute } from "next";
import { portfolio } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shine-design-signage-ax.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/about", "/services", "/portfolio", "/process", "/inquiry"];
  return [
    ...pages.map((p) => ({
      url: BASE + p,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
    })),
    ...portfolio.map((w) => ({
      url: `${BASE}/portfolio/${w.id}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
