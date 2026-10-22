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
    ...["hotel-near-ayodhya", "hotel-in-akbarpur", "banquet-hall-ambedkar-nagar", "events"].map((path) => ({
      url: `${SITE_URL}/${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    // Hindi versions
    {
      url: `${SITE_URL}/hi`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...Object.keys(ROOMS_DATA).map((slug) => ({
      url: `${SITE_URL}/hi/rooms/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/feedback`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
