import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/site-settings";
import { DEFAULT_LEGAL_PAGES, LegalDocument } from "@/lib/cms-defaults";
import { LegalContentView } from "@/components/legal-content-view";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms and Conditions | DOHaD India",
  description: "Terms and conditions of use for the official DOHaD India Regional Society website.",
  alternates: {
    canonical: "/terms",
  },
};

export default async function TermsAndConditions() {
  let doc: LegalDocument = DEFAULT_LEGAL_PAGES.termsOfService;

  try {
    const settings = await getSiteSettings();
    if (settings?.legalPages?.termsOfService) {
      const t = settings.legalPages.termsOfService;
      doc = {
        title: t.title || DEFAULT_LEGAL_PAGES.termsOfService.title,
        lastUpdated:
          t.lastUpdated !== undefined
            ? t.lastUpdated
            : DEFAULT_LEGAL_PAGES.termsOfService.lastUpdated,
        sections:
          Array.isArray(t.sections) && t.sections.length > 0
            ? t.sections
            : DEFAULT_LEGAL_PAGES.termsOfService.sections,
      };
    }
  } catch (err) {
    console.error("Error fetching terms and conditions settings", err);
  }

  return <LegalContentView document={doc} />;
}
