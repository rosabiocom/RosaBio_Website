"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { cn } from "@/lib/utils";

// Dynamically import PDFViewer to avoid SSR issues with react-pdf
const PDFViewer = dynamic(
  () => import("./PDFViewer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[300px] sm:h-[400px] md:h-[500px]">
        <div className="text-slate-dark">Loading presentation...</div>
      </div>
    )
  }
);

export function SlideDeckCarousel() {
  const { pdfPath } = siteContent.technology.slides;
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };

    // Initial width
    updateWidth();

    // Listen for resize
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev <= 1 ? numPages : prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev >= numPages ? 1 : prev + 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden rounded-lg md:rounded-xl",
          "border border-electric-blue/30",
          "shadow-lg shadow-electric-blue/10",
          "bg-white"
        )}
      >
        {/* PDF Page Display */}
        <div className="relative w-full flex items-center justify-center bg-gray-100 min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
          {containerWidth > 0 && (
            <PDFViewer
              pdfPath={pdfPath}
              width={containerWidth - 2}
              currentPage={currentPage}
              onLoadSuccess={setNumPages}
            />
          )}

          {/* Slide Number Badge */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 rounded-full bg-navy-dark/80 px-2 sm:px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {currentPage} / {numPages || "..."}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevPage}
            disabled={numPages === 0}
            className={cn(
              "absolute left-2 sm:left-4 top-1/2 z-10 -translate-y-1/2",
              "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full",
              "bg-navy-dark/80 backdrop-blur-sm",
              "text-white transition-all duration-200",
              "hover:bg-electric-blue hover:shadow-lg",
              "focus:outline-none focus:ring-2 focus:ring-electric-blue",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={goToNextPage}
            disabled={numPages === 0}
            className={cn(
              "absolute right-2 sm:right-4 top-1/2 z-10 -translate-y-1/2",
              "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full",
              "bg-navy-dark/80 backdrop-blur-sm",
              "text-white transition-all duration-200",
              "hover:bg-electric-blue hover:shadow-lg",
              "focus:outline-none focus:ring-2 focus:ring-electric-blue",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        {numPages > 0 && (
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 py-3 sm:py-4 bg-navy-darkest flex-wrap px-4">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={cn(
                  "h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-navy-dark",
                  page === currentPage
                    ? "bg-electric-blue shadow-md shadow-electric-blue/50"
                    : "bg-slate-dark hover:bg-slate-medium"
                )}
                aria-label={`Go to slide ${page}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* View Full PDF Link */}
      <div className="mt-3 sm:mt-4 flex justify-center">
        <a
          href={pdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-electric-blue transition-colors hover:text-electric-blue-light"
        >
          View full presentation (PDF)
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
        </a>
      </div>
    </div>
  );
}
