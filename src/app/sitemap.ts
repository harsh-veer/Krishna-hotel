import type { MetadataRoute } from "next";
import { ROOMS_DATA } from "@/lib/rooms";
import { SITE_URL } from "@/lib/hotel";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...Object.keys(ROOMS_DATA).map((slug) => ({
      url: `${SITE_URL}/rooms/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/feedback`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
