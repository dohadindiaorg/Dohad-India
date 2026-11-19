export const revalidate = 60;

import type { Metadata } from "next";
import { Header } from "@/components/header";
import { WhoWeAreContent } from "@/components/who-we-are-content";
import dbConnect from "@/lib/mongodb";
import AdvisoryMember from "@/lib/models/AdvisoryMember";
import SiteSettings from "@/lib/models/SiteSettings";
import { normalizeWhoWeArePageSettings } from "@/lib/who-we-are-defaults";
import { BreadcrumbSchema } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Who We Are | Leadership & Advisory",
  description:
    "Meet the leadership, researchers, clinicians, and advisory council members driving DOHaD India Regional Society.",
  alternates: {
    canonical: "/who-are-we",
  },
  openGraph: {
    title: "Who We Are | Leadership & Advisory | DOHaD India",
    description:
      "Meet the leadership, researchers, clinicians, and advisory council members driving DOHaD India Regional Society.",
    url: "https://www.dohadindia.org/who-are-we",
  },
};

async function getPageData() {
  try {
    await dbConnect();
    const [members, settings] = await Promise.all([
      AdvisoryMember.find().sort({ displayOrder: 1 }).lean(),
      SiteSettings.findOne({}).lean(),
    ]);
    return {
      members: JSON.parse(JSON.stringify(members)),
      pageContent: normalizeWhoWeArePageSettings(settings?.whoWeArePage),
    };
  } catch (error) {
    console.error("Failed to fetch who-we-are page data:", error);
    return {
      members: [],
      pageContent: normalizeWhoWeArePageSettings(null),
    };
  }
}

export default async function WhoAreWePage() {
  const { members, pageContent } = await getPageData();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.dohadindia.org" },
          { name: "Who We Are", url: "https://www.dohadindia.org/who-are-we" },
        ]}
      />
      <WhoWeAreContent pageContent={pageContent} members={members} />
    </div>
  );
}
