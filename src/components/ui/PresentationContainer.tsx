"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { ExternalLink, Play, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";

interface PresentationContainerProps {
  embedUrl?: string;
  fallbackUrl?: string;
  title?: string;
}

export function PresentationContainer({
  embedUrl,
  fallbackUrl = "#",
  title = "Technology Deck",
}: PresentationContainerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const showPlaceholder = !embedUrl || hasError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Document Previewer Container */}
      <div className="bg-blue-50 rounded-lg shadow-soft-xl border border-border overflow-hidden">
        {/* Browser-like header bar */}
        <div className="bg-blue-100/50 border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Traffic light dots */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-200" />
              <div className="w-3 h-3 rounded-full bg-blue-200" />
              <div className="w-3 h-3 rounded-full bg-blue-200" />
            </div>
            <span className="ml-4 text-sm font-medium text-foreground-muted">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-blue-200/50 rounded transition-colors">
              <Maximize2 className="w-4 h-4 text-foreground-muted" />
            </button>
          </div>
        </div>

        {/* Content area with 16:9 aspect ratio */}
        <div className="relative aspect-video bg-blue-50/50">
          {/* Loading state */}
          {isLoading && !showPlaceholder && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                <p className="text-foreground-muted text-sm">Loading presentation...</p>
              </div>
            </div>
          )}

          {/* Placeholder state */}
          {showPlaceholder ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-50/50 p-8">
              {/* Dot pattern background */}
              <div className="absolute inset-0 bg-dot-pattern opacity-50" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center max-w-md">
                {/* Icon */}
                <div className="w-16 h-16 rounded-md bg-accent/10 flex items-center justify-center mb-6">
                  <Play className="w-8 h-8 text-accent" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">
                  Interactive {title}
                </h3>
                <p className="text-foreground-muted mb-6">
                  {hasError
                    ? "Unable to load the presentation. Please try viewing it directly."
                    : "Interactive Technology Deck Loading..."}
                </p>

                {/* Fallback button */}
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => window.open(fallbackUrl, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full Deck
                </Button>
              </div>
            </div>
          ) : (
            /* Actual iframe embed */
            <iframe
              src={embedUrl}
              className={cn(
                "absolute inset-0 w-full h-full",
                isLoading ? "opacity-0" : "opacity-100",
                "transition-opacity duration-500"
              )}
              onLoad={() => setIsLoading(false)}
              onError={() => setHasError(true)}
              allow="fullscreen"
              title={title}
            />
          )}
        </div>
      </div>

      {/* Caption */}
      <p className="text-center text-foreground-muted text-sm mt-4">
        {title} — Statistics-First Analysis Platform
      </p>
    </motion.div>
  );
}
