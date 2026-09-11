import type { MetadataRoute } from "next"

const siteUrl = "https://www.dohadindia.org"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: siteUrl, lastModified },
    { url: `${siteUrl}/who-are-we`, lastModified },
    { url: `${siteUrl}/who-are-we/governance`, lastModified },
    { url: `${siteUrl}/who-are-we/equity-diversity`, lastModified },
    { url: `${siteUrl}/events`, lastModified },
    { url: `${siteUrl}/join-us`, lastModified },
    { url: `${siteUrl}/contact`, lastModified },
    { url: `${siteUrl}/privacy`, lastModified },
    { url: `${siteUrl}/terms`, lastModified },
  ]
}
