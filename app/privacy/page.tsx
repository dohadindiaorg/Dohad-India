import React from "react";
import { getSiteSettings } from "@/lib/data/site-settings";
import { DEFAULT_LEGAL_PAGES, LegalDocument } from "@/lib/cms-defaults";
import { LegalContentView } from "@/components/legal-content-view";

export const revalidate = 60;

export default async function PrivacyPolicy() {
  let doc: LegalDocument = DEFAULT_LEGAL_PAGES.privacyPolicy;

  try {
    const settings = await getSiteSettings();
    if (settings?.legalPages?.privacyPolicy) {
      const p = settings.legalPages.privacyPolicy;
      doc = {
        title: p.title || DEFAULT_LEGAL_PAGES.privacyPolicy.title,
        lastUpdated:
          p.lastUpdated !== undefined
            ? p.lastUpdated
            : DEFAULT_LEGAL_PAGES.privacyPolicy.lastUpdated,
        sections:
          Array.isArray(p.sections) && p.sections.length > 0
            ? p.sections
            : DEFAULT_LEGAL_PAGES.privacyPolicy.sections,
      };
    }
  } catch (err) {
    console.error("Error fetching privacy policy settings", err);
  }

  return <LegalContentView document={doc} />;
}
