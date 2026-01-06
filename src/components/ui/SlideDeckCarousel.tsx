"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
}

interface SlideDeckCarouselProps {
  slides?: Slide[];
  autoPlay?: boolean;
  interval?: number;
}

const defaultSlides: Slide[] = [
  {
    src: "https://picsum.photos/seed/rosabio1/1200/675",
    alt: "Technology Overview - Slide 1",
    title: "SPLASH Technology",
    subtitle: "Statistics-First Sequence Analysis",
  },
  {
    src: "https://picsum.photos/seed/rosabio2/1200/675",
    alt: "Technology Overview - Slide 2",
    title: "No Reference Genome Required",
    subtitle: "Unbiased Discovery Pipeline",
  },
  {
    src: "https://picsum.photos/seed/rosabio3/1200/675",
    alt: "Technology Overview - Slide 3",
    title: "Clinical Applications",
    subtitle: "From Research to Results",
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function SlideDeckCarousel({
  slides = defaultSlides,
}: SlideDeckCarouselProps) {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    const newIndex =
      (currentIndex + newDirection + slides.length) % slides.length;
    setCurrentIndex([newIndex, newDirection]);
  };

  const goToSlide = (index: number) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setCurrentIndex([index, newDirection]);
  };

  return (
    <div className="w-full">
      {/* Carousel Container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl",
          "border border-electric-blue/30",
          "shadow-lg shadow-electric-blue/10",
          "bg-navy-dark"
        )}
      >
        {/* Slide Display */}
        <div className="relative aspect-video w-full">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 h-full w-full"
            >
              {/* Background Image */}
              <img
                src={slides[currentIndex].src}
                alt={slides[currentIndex].alt}
                className="h-full w-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-darkest/90 via-navy-darkest/40 to-transparent" />

              {/* Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
                  {slides[currentIndex].title}
                </h3>
                {slides[currentIndex].subtitle && (
                  <p className="mt-3 text-lg text-slate-lighter md:text-xl">
                    {slides[currentIndex].subtitle}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => paginate(-1)}
            className={cn(
              "absolute left-4 top-1/2 z-10 -translate-y-1/2",
              "flex h-10 w-10 items-center justify-center rounded-full",
              "bg-navy-medium/80 backdrop-blur-sm",
              "text-slate-lighter transition-all duration-200",
              "hover:bg-electric-blue/20 hover:text-electric-blue hover:shadow-lg hover:shadow-electric-blue/20",
              "focus:outline-none focus:ring-2 focus:ring-electric-blue"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={() => paginate(1)}
            className={cn(
              "absolute right-4 top-1/2 z-10 -translate-y-1/2",
              "flex h-10 w-10 items-center justify-center rounded-full",
              "bg-navy-medium/80 backdrop-blur-sm",
              "text-slate-lighter transition-all duration-200",
              "hover:bg-electric-blue/20 hover:text-electric-blue hover:shadow-lg hover:shadow-electric-blue/20",
              "focus:outline-none focus:ring-2 focus:ring-electric-blue"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-2 py-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-navy-dark",
                index === currentIndex
                  ? "bg-electric-blue shadow-md shadow-electric-blue/50"
                  : "bg-slate-dark hover:bg-slate-medium"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Caption */}
      <p className="mt-4 text-center text-sm text-slate-light">
        Technology Overview Slide Deck
      </p>
    </div>
  );
}
