"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Blocks,
  TrendingUp,
  Dna,
  Apple,
  FileText,
  ChevronDown,
  Heart,
  Activity,
  Microscope,
  Stethoscope,
  Globe,
  Users,
  Brain,
  Shield,
} from "lucide-react"
import { ResearchFocusData, DEFAULT_RESEARCH_FOCUS } from "@/lib/cms-defaults"

const ICON_MAP: Record<string, React.ElementType> = {
  Baby,
  Blocks,
  TrendingUp,
  Dna,
  Apple,
  FileText,
  Heart,
  Activity,
  Microscope,
  Stethoscope,
  Globe,
  Users,
  Brain,
  Shield,
}

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ElementType
}

const ResearchFocusCard = ({ title, description, icon: Icon }: FeatureCardProps) => {
  const [expanded, setExpanded] = React.useState(false)
  const descriptionRef = React.useRef<HTMLParagraphElement>(null)
  const [isTruncated, setIsTruncated] = React.useState(false)

  React.useEffect(() => {
    const element = descriptionRef.current
    if (!element) return

    const checkTruncation = () => {
      const el = descriptionRef.current
      if (!el) return

      const isShowingFullText = !el.classList.contains("line-clamp-3")
      if (isShowingFullText) {
        el.classList.add("line-clamp-3")
      }

      const truncated = el.scrollHeight > el.clientHeight + 1

      if (isShowingFullText) {
        el.classList.remove("line-clamp-3")
      }

      setIsTruncated(truncated)
      if (!truncated) {
        setExpanded(false)
      }
    }

    checkTruncation()
    window.addEventListener("resize", checkTruncation)
    return () => window.removeEventListener("resize", checkTruncation)
  }, [description, expanded])

  const canToggle = isTruncated || expanded

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <button
        type="button"
        onClick={() => canToggle && setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        disabled={!canToggle}
        className={`group relative flex flex-col items-start p-4 sm:p-5 xl:p-8 2xl:p-10 h-full bg-white dark:bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 text-left w-full ${
          canToggle ? "hover:-translate-y-1 cursor-pointer" : ""
        }`}
      >
        <div className="w-10 h-10 xl:w-14 xl:h-14 bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white flex items-center justify-center rounded-xl xl:rounded-2xl mb-3 xl:mb-6 transition-all duration-300 group-hover:scale-110 shrink-0">
          {Icon && <Icon className="w-5 h-5 xl:w-6 xl:h-6" />}
        </div>

        <h3 className="text-sm sm:text-base xl:text-xl font-bold text-foreground mb-1.5 xl:mb-3 2xl:mb-4 group-hover:text-secondary transition-colors duration-300">
          {title}
        </h3>

        <p
          ref={descriptionRef}
          className={`text-[11px] sm:text-xs xl:text-sm text-muted-foreground leading-relaxed ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          {description}
        </p>

        {canToggle && (
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-secondary mt-2 xl:mt-3">
            {expanded ? "Show less" : "Read more"}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </span>
        )}
      </button>
    </motion.div>
  )
}

export interface BentoCarouselProps {
  data?: ResearchFocusData
}

export function BentoCarousel({ data }: BentoCarouselProps = {}) {
  const title = data?.title || DEFAULT_RESEARCH_FOCUS.title
  const subtitle = data?.subtitle || DEFAULT_RESEARCH_FOCUS.subtitle
  const activePillars = (data?.pillars && Array.isArray(data.pillars) && data.pillars.length > 0)
    ? data.pillars
    : DEFAULT_RESEARCH_FOCUS.pillars

  return (
    <section className="relative w-full px-5 md:px-6 lg:px-8 bg-background py-8 md:py-10 xl:py-20 2xl:py-28">
      <div className="w-full max-w-7xl mx-auto relative">
        <div className="text-center mb-4 md:mb-5 xl:mb-6 [@media(min-height:768px)]:mb-12 [@media(min-height:850px)]:2xl:mb-20">
          <h2 className="text-xl md:text-2xl xl:text-3xl [@media(min-height:768px)]:xl:text-5xl [@media(min-height:850px)]:2xl:text-6xl font-bold text-foreground mb-1 xl:mb-2 [@media(min-height:768px)]:mb-4 [@media(min-height:850px)]:mb-6">
            {title}
          </h2>
          <p className="text-[10px] sm:text-xs xl:text-sm [@media(min-height:768px)]:xl:text-lg [@media(min-height:850px)]:2xl:text-xl text-muted-foreground max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="relative block md:hidden">
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: "auto",
            }}
            className="w-full px-4"
          >
            <div className="flex justify-center items-center gap-4 mb-8">
              <CarouselPrevious className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out relative static">
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Previous slide</span>
              </CarouselPrevious>
              <CarouselNext className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out relative static">
                <ArrowRight className="w-5 h-5" />
                <span className="sr-only">Next slide</span>
              </CarouselNext>
            </div>

            <CarouselContent className="-ml-4">
              {activePillars.map((feature, index) => (
                <CarouselItem key={index} className="pl-4 basis-full">
                  <ResearchFocusCard
                    title={feature.title}
                    description={feature.description}
                    icon={ICON_MAP[feature.icon || ""] || Dna}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 xl:gap-8 2xl:gap-10">
          {activePillars.map((feature, index) => (
            <ResearchFocusCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={ICON_MAP[feature.icon || ""] || Dna}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
