import React from "react"

// Generic JSON-LD injector — renders a <script> tag with the given schema
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 0) }}
    />
  )
}

// ─── Preset schema builders ─────────────────────────────────────────────────

const siteUrl = "https://www.dohadindia.org"

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["Organization", "ResearchOrganization", "MedicalOrganization"],
        "@id": `${siteUrl}/#organization`,
        name: "DOHaD India",
        alternateName: [
          "DOHaD India Regional Society",
          "Developmental Origins of Health and Disease India",
        ],
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/dohad-india-rgb.png`,
          width: 1024,
          height: 640,
        },
        description:
          "DOHaD India Regional Society advances research, training, and policy on the developmental origins of health and disease in India, connecting researchers, clinicians, and policymakers.",
        foundingDate: "2020",
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "New Delhi",
          addressCountry: "IN",
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: "contact@dohadindia.org",
          contactType: "General Enquiries",
          areaServed: "IN",
          availableLanguage: "English",
        },
        sameAs: [
          "https://www.linkedin.com/company/dohad-india",
          "https://dohadsociety.org",
        ],
        memberOf: {
          "@type": "Organization",
          name: "DOHaD International Society",
          url: "https://dohadsociety.org",
        },
        knowsAbout: [
          "Developmental Origins of Health and Disease",
          "Fetal programming",
          "Epigenetics",
          "Maternal nutrition",
          "Non-communicable diseases",
          "Perinatal health",
          "Early life nutrition",
          "Adolescent health",
          "Maternal and child health in India",
        ],
      }}
    />
  )
}

export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "DOHaD India",
        description:
          "DOHaD India Regional Society – advancing research, training, and policy on the developmental origins of health and disease in India.",
        publisher: { "@id": `${siteUrl}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/events?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en-IN",
      }}
    />
  )
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  )
}

export function EventSchema({
  events,
}: {
  events: Array<{
    title: string
    shortDescription?: string
    startDate: string
    endDate?: string
    location?: string
    image?: string
    slug?: string
  }>
}) {
  if (!events.length) return null
  const schemas = events.map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.shortDescription || "",
    startDate: event.startDate,
    ...(event.endDate && { endDate: event.endDate }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location || "India",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
    },
    organizer: { "@id": `${siteUrl}/#organization` },
    ...(event.image && {
      image: { "@type": "ImageObject", url: event.image },
    }),
    url: event.slug
      ? `${siteUrl}/events/${event.slug}`
      : `${siteUrl}/events`,
  }))

  return <JsonLd data={schemas} />
}

export function FAQSchema({
  items,
}: {
  items: { question: string; answer: string }[]
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  )
}
