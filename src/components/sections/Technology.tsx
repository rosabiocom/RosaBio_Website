"use client";

import { Section } from "@/components/ui/Section";
import { SlideDeckCarousel } from "@/components/ui/SlideDeckCarousel";
import { ChevronRight, FileText, Presentation, Microscope, BarChart3 } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  "Why Statistics First": BarChart3,
  "White Paper": FileText,
  "Slide Set": Presentation,
  "Precision Medicine Applications": Microscope,
};

export function Technology() {
  return (
    <Section id="technology" className="bg-navy-dark">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {siteContent.technology.title.part1}{" "}
          <span className="text-electric-blue">{siteContent.technology.title.highlight}</span>{" "}
          {siteContent.technology.title.part2}
        </h2>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-slate-lighter md:text-xl">
          {siteContent.technology.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Tech Summary Items - rendered in order with PDF in "Slide Set" position */}
        <div className="mt-12 space-y-4">
          {siteContent.technology.techSummary.map((item, index) => {
            const Icon = iconMap[item.title] || ChevronRight;
            const isSlideSet = "isSlideLink" in item && item.isSlideLink;

            // Render PDF carousel instead of card for "Slide Set"
            if (isSlideSet) {
              return (
                <div key={index}>
                  <SlideDeckCarousel />
                </div>
              );
            }

            return (
              <div
                key={index}
                className={cn(
                  "group flex items-start gap-4 rounded-xl border border-slate-dark/50 bg-navy-darkest/50 p-5 text-left backdrop-blur-sm transition-all duration-200",
                  "hover:border-electric-blue/40 hover:bg-navy-darkest hover:shadow-lg hover:shadow-electric-blue/10"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric-blue/20 transition-colors group-hover:bg-electric-blue/30">
                  <Icon className="h-5 w-5 text-electric-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-electric-blue-light">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </Section>
  );
}
