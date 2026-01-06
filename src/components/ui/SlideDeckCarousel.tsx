"use client";

import { siteContent } from "@/data/siteContent";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export function SlideDeckCarousel() {
  const { pdfPath, items } = siteContent.technology.slides;

  return (
    <div className="w-full">
      {/* PDF Embed Container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-lg md:rounded-xl",
          "border border-electric-blue/30",
          "shadow-lg shadow-electric-blue/10",
          "bg-navy-darkest"
        )}
      >
        {/* PDF Iframe - Responsive height */}
        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px]">
          <iframe
            src={pdfPath}
            className="h-full w-full"
            title="Technology Overview Presentation"
          />
        </div>
      </div>

      {/* Open in new tab link - more prominent on mobile */}
      <div className="mt-3 md:mt-4 flex justify-center">
        <a
          href={pdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-electric-blue transition-colors hover:text-electric-blue-light px-4 py-2 rounded-lg bg-electric-blue/10 md:bg-transparent"
        >
          Open presentation in new tab
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
        </a>
      </div>

      {/* Slide Index - Responsive grid */}
      <div className="mt-4 md:mt-6">
        <h4 className="mb-2 md:mb-3 text-center text-xs sm:text-sm font-medium text-slate-light">
          Presentation Contents ({items.length} slides)
        </h4>
        <div className="grid gap-1.5 sm:gap-2 grid-cols-1 sm:grid-cols-2">
          {items.map((slide, index) => (
            <div
              key={index}
              className="rounded-md md:rounded-lg border border-slate-dark/30 bg-navy-dark/30 px-2 sm:px-3 py-1.5 sm:py-2 text-left"
            >
              <span className="mr-1.5 sm:mr-2 text-[10px] sm:text-xs text-electric-blue">{index + 1}.</span>
              <span className="text-xs sm:text-sm text-slate-lighter">{slide.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
