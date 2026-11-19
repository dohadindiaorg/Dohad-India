import type { MetadataRoute } from "next"
import dbConnect from "@/lib/mongodb"
import Event from "@/lib/models/Event"

const siteUrl = "https://www.dohadindia.org"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/who-are-we`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/events`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/join-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/who-are-we/governance`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/who-are-we/equity-diversity`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  let eventRoutes: MetadataRoute.Sitemap = []
  try {
    await dbConnect()
    const events = await Event.find({ published: true })
      .select("slug updatedAt startDate")
      .lean()

    eventRoutes = events
      .filter((e) => (e as { slug?: string }).slug)
      .map((e) => ({
        url: `${siteUrl}/events/${(e as { slug: string }).slug}`,
        lastModified: (e as { updatedAt?: Date }).updatedAt || now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
  } catch (error) {
    console.error("Failed to fetch dynamic sitemap events:", error)
  }

  return [...staticRoutes, ...eventRoutes]
}
