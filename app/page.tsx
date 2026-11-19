import AboutSection from "@/components/about-section"
import { AnimatedSection } from "@/components/animated-section"
import { FAQSection } from "@/components/faq-section"
import CapacityBuilding from "@/components/CapacityBuilding"
import CommunicationOutreach from "@/components/CommunicationOutreach"
import AdvocacySection from "@/components/AdvocacySection"
import { BentoCarousel } from "@/components/four-pillars-section"
import { Header } from "@/components/header"
import Hero from "@/components/about-DOHaD"
import LearnAboutDOHaD from "@/components/learn-dohad"
import { FAQSchema } from "@/components/json-ld"

import { getSiteSettings } from "@/lib/data/site-settings"

const homeFaqs = [
  {
    question: "What is DOHaD and why is it important?",
    answer:
      "The Developmental Origins of Health and Disease (DOHaD) paradigm focuses on how early-life exposures, including during preconception and pregnancy, impact long-term health. The DOHaD India Regional Society is dedicated to advancing this science and creating evidence-based policies and practices, particularly within the Indian context.",
  },
  {
    question: "What is the mission of DOHaD India?",
    answer:
      "DOHaD India aims to promote and coordinate research on the Developmental Origins of Health and Disease, while building the capacity of professionals through research, communication, and advocacy rooted in the Indian context.",
  },
  {
    question: "Who can become a member of DOHaD India?",
    answer:
      "Membership is open to anyone interested in DOHaD research, policy, and practice in India and the South Asian region. Individuals join the International DOHaD Society and select DOHaD India as their Regional Society.",
  },
  {
    question: "What are the benefits of becoming a member?",
    answer:
      "Members gain access to the Journal of Developmental Origins of Health and Disease, newsletters, discounted registration for international/regional conferences and workshops, and professional networking opportunities across India and internationally.",
  },
]

export default async function HomePage() {
  let settings = null
  try {
    settings = JSON.parse(JSON.stringify(await getSiteSettings()))
  } catch {
    settings = null
  }

  return (
    <div className="min-h-screen bg-background relative">
      <FAQSchema items={homeFaqs} />
      <Header />
      <div className="relative z-10">
        <main className="relative z-10">
          <AnimatedSection
            id="hero-section"
            className="relative"
            delay={0.1}
          >
            <Hero settings={settings?.hero} />
          </AnimatedSection>
        </main>

        {/* Learn About DOHaD Section */}
        <AnimatedSection
          id="learn-section"
          className="relative max-w-7xl mx-auto px-0 sm:px-8 md:px-12"
          delay={0.2}
        >
          <LearnAboutDOHaD settings={settings?.learnDohad} />
        </AnimatedSection>

        {/* Main content sections with standardized spacing */}
        <div className="relative">
          {/* About Section (Who We Are) */}
          <AnimatedSection
            id="about-pillars-section"
            className="relative z-10 max-w-7xl mx-auto px-8 md:px-12"
            delay={0.2}
          >
            <AboutSection settings={settings?.about} />
          </AnimatedSection>

          {/* Four Pillars/Bento Section (Research Focus) */}
          <AnimatedSection
            id="features-section"
            className="relative z-10 max-w-7xl mx-auto px-8 md:px-12"
            delay={0.2}
          >
            <BentoCarousel data={settings?.researchFocus} />
          </AnimatedSection>

          {/* Capacity Building Section */}
          <AnimatedSection
            id="capacity-building-section"
            className="relative z-10"
            delay={0.2}
          >
            <CapacityBuilding data={settings?.narratives?.capacityBuilding} />
          </AnimatedSection>

          {/* Communication & Outreach Section */}
          <AnimatedSection
            id="communication-section"
            className="relative z-10"
            delay={0.2}
          >
            <CommunicationOutreach data={settings?.narratives?.communication} />
          </AnimatedSection>

          {/* Advocacy Section */}
          <AnimatedSection
            id="advocacy-section"
            className="relative z-10"
            delay={0.2}
          >
            <AdvocacySection data={settings?.narratives?.advocacy} />
          </AnimatedSection>

          {/* FAQ Section */}
          <AnimatedSection
            id="faq-section"
            className="relative z-10 max-w-7xl mx-auto px-8 md:px-12"
            delay={0.2}
          >
            <FAQSection faqs={settings?.faqs} />
          </AnimatedSection>

        </div>
      </div>
    </div>
  )
}
