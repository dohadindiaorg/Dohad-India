import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Event from "@/lib/models/Event"

export const revalidate = 3600 // 1 hour cache

export async function GET() {
  const siteUrl = "https://www.dohadindia.org"
  try {
    await dbConnect()
    const events = await Event.find({ published: true })
      .sort({ startDate: -1 })
      .limit(30)
      .lean()

    const rssItems = events
      .map((event) => {
        const title = (event.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        const desc = (event.shortDescription || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        const link = event.slug ? `${siteUrl}/events/${event.slug}` : `${siteUrl}/events`
        const pubDate = event.createdAt ? new Date(event.createdAt).toUTCString() : new Date().toUTCString()

        return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid>${link}#${event._id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${desc}</description>
    </item>`
      })
      .join("")

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DOHaD India - Events and Scientific Sessions</title>
    <link>${siteUrl}/events</link>
    <description>Latest conferences, workshops, and scientific sessions from the DOHaD India Regional Society.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/events/feed" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("RSS generation failed:", error)
    return new NextResponse("Error generating RSS feed", { status: 500 })
  }
}
