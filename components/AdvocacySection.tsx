"use client"

import React from "react"
import { FileHeart, Handshake, Globe, Megaphone } from "lucide-react"
import { SpecialNarrativesData, DEFAULT_NARRATIVES } from "@/lib/cms-defaults"

const iconMap: Record<string, React.ElementType> = {
  FileHeart,
  Handshake,
  Globe,
  Megaphone,
}

const cardStyles = [
  {
    card: "bg-gradient-to-br from-gray-200 to-gray-300 text-slate-900 dark:from-slate-800 dark:to-slate-900 dark:text-slate-100",
    iconBox: "bg-slate-900/10 dark:bg-slate-100/10 text-slate-900 dark:text-slate-100",
    defaultIcon: FileHeart,
  },
  {
    card: "bg-gradient-to-br from-[#006d68] to-[#004d4a] text-white dark:from-indigo-600 dark:to-indigo-800 dark:text-white",
    iconBox: "bg-white/15 text-white",
    defaultIcon: Handshake,
  },
  {
    card: "bg-gradient-to-br from-[#d4e2cc] to-[#c0d4b5] text-slate-900 dark:from-teal-700 dark:to-teal-900 dark:text-white",
    iconBox: "bg-slate-900/10 dark:bg-white/15 text-slate-900 dark:text-white",
    defaultIcon: Globe,
  },
  {
    card: "bg-gradient-to-br from-[#e6f7f6] to-[#d0ebe9] text-slate-900 dark:from-slate-700 dark:to-slate-800 dark:text-white",
    iconBox: "bg-slate-900/10 dark:bg-white/15 text-slate-900 dark:text-white",
    defaultIcon: Megaphone,
  },
]

export interface AdvocacySectionProps {
  data?: SpecialNarrativesData["advocacy"]
}

const AdvocacySection = ({ data }: AdvocacySectionProps = {}) => {
  const title = data?.title || DEFAULT_NARRATIVES.advocacy.title
  const subtitle = data?.subtitle || DEFAULT_NARRATIVES.advocacy.subtitle
  const items = (Array.isArray(data?.items) && data.items.length > 0)
    ? data.items
    : DEFAULT_NARRATIVES.advocacy.items

  return (
    <section className="max-w-6xl mx-auto px-6 py-8 md:py-10 xl:py-20 2xl:py-28 text-center bg-background">
      {/* Heading */}
      <div className="text-center mb-4 md:mb-5 xl:mb-6 [@media(min-height:768px)]:mb-12 [@media(min-height:850px)]:2xl:mb-20">
        <h2 className="text-xl md:text-2xl xl:text-3xl [@media(min-height:768px)]:xl:text-5xl [@media(min-height:850px)]:2xl:text-6xl font-bold text-foreground mb-1 xl:mb-2 [@media(min-height:768px)]:mb-4 [@media(min-height:850px)]:mb-6">
          {title}
        </h2>
        <p className="text-[10px] sm:text-xs xl:text-sm [@media(min-height:768px)]:xl:text-lg [@media(min-height:850px)]:2xl:text-xl text-muted-foreground max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Policy Cards - 2×2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 xl:gap-8 2xl:gap-10">
        {items.map((item, idx) => {
          const style = cardStyles[idx % cardStyles.length]
          const IconComp = iconMap[item.icon || ""] || style.defaultIcon

          return (
            <div
              key={idx}
              className={`group rounded-3xl px-4 py-5 sm:px-5 sm:py-6 xl:px-8 xl:py-10 2xl:px-10 2xl:py-12 flex flex-col text-left shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${style.card}`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 xl:mb-6 transition-transform duration-300 group-hover:scale-110 shrink-0 ${style.iconBox}`}>
                <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-sm sm:text-base xl:text-xl font-bold mb-2 xl:mb-4 2xl:mb-6">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs xl:text-sm leading-relaxed opacity-95">
                {item.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default AdvocacySection
