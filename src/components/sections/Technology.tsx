"use client";

import { Section } from "@/components/ui/Section";
import { SlideDeckCarousel } from "@/components/ui/SlideDeckCarousel";
import { ExternalLink } from "lucide-react";
import { siteContent } from "@/data/siteContent";

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

        {/* Slide Deck Carousel */}
        <div className="mt-12">
          <SlideDeckCarousel />
        </div>

        {/* External Link */}
        <div className="mt-10">
          <a
            href={siteContent.technology.externalLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-electric-blue transition-colors hover:text-electric-blue-light"
          >
            {siteContent.technology.externalLink.text}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Section>
  );
}
