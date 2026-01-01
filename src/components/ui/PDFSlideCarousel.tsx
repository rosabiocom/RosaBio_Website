"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PDFDocument {
  id: string;
  label: string;
  url: string;
}

const defaultDocuments: PDFDocument[] = [
  { id: "tech", label: "Tech Summary", url: "/documents/techsummary.pdf" },
  { id: "benefits", label: "Benefits", url: "/documents/benefits-statistics-first.pdf" },
];

interface PDFSlideCarouselProps {
  documents?: PDFDocument[];
}

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

export function PDFSlideCarousel({
  documents = defaultDocuments,
}: PDFSlideCarouselProps) {
  const [activeDoc, setActiveDoc] = useState<PDFDocument>(documents[0]);
  const [[currentPage, direction], setCurrentPage] = useState([1, 0]);
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [PDFComponents, setPDFComponents] = useState<{
    Document: React.ComponentType<any>;
    Page: React.ComponentType<any>;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Dynamically import react-pdf only on client side
    import("react-pdf")
      .then((pdfModule) => {
        // Set up the worker
        pdfModule.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        setPDFComponents({
          Document: pdfModule.Document,
          Page: pdfModule.Page,
        });
      })
      .catch((error) => {
        console.error("Failed to load react-pdf:", error);
        setLoadError(`Failed to load PDF viewer: ${error.message}`);
      });
  }, []);

  // Responsive width calculation
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Get container width minus padding, max 800px
        const width = Math.min(containerRef.current.offsetWidth - 32, 800);
        setContainerWidth(width > 0 ? width : 300);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isMounted]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setIsLoading(false);
      setLoadError(null);
    },
    []
  );

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("PDF load error:", error);
    setLoadError(error.message || "Failed to load PDF");
    setIsLoading(false);
  }, []);

  const paginate = (newDirection: number) => {
    const newPage = currentPage + newDirection;
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage([newPage, newDirection]);
    } else if (newPage < 1) {
      setCurrentPage([numPages, newDirection]);
    } else {
      setCurrentPage([1, newDirection]);
    }
  };

  const goToPage = (page: number) => {
    const newDirection = page > currentPage ? 1 : -1;
    setCurrentPage([page, newDirection]);
  };

  const handleDocumentSwitch = (doc: PDFDocument) => {
    if (doc.id !== activeDoc.id) {
      setActiveDoc(doc);
      setCurrentPage([1, 0]);
      setNumPages(0);
      setIsLoading(true);
      setLoadError(null);
    }
  };

  // Show loading state while mounting or loading PDF components
  if (!isMounted || (!PDFComponents && !loadError)) {
    return (
      <div className="w-full">
        <div
          className={cn(
            "relative overflow-hidden rounded-xl",
            "border border-electric-blue/30",
            "shadow-lg shadow-electric-blue/10",
            "bg-navy-dark"
          )}
        >
          <div className="relative aspect-video w-full flex items-center justify-center">
            <div className="text-slate-lighter">Loading PDF viewer...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if PDF components failed to load
  if (loadError && !PDFComponents) {
    return (
      <div className="w-full">
        <div
          className={cn(
            "relative overflow-hidden rounded-xl",
            "border border-red-500/30",
            "shadow-lg shadow-red-500/10",
            "bg-navy-dark"
          )}
        >
          <div className="relative aspect-video w-full flex flex-col items-center justify-center gap-2">
            <div className="text-red-400">Failed to load PDF viewer</div>
            <div className="text-slate-lighter text-sm">{loadError}</div>
          </div>
        </div>
      </div>
    );
  }

  const { Document, Page } = PDFComponents;

  return (
    <div className="w-full">
      {/* Document Tabs */}
      {documents.length > 1 && (
        <div className="flex justify-center gap-2 mb-4">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleDocumentSwitch(doc)}
              className={cn(
                "px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200",
                activeDoc.id === doc.id
                  ? "bg-electric-blue text-white shadow-md shadow-electric-blue/30"
                  : "bg-navy-medium text-slate-lighter hover:bg-electric-blue/10 hover:text-text-primary"
              )}
            >
              {doc.label}
            </button>
          ))}
        </div>
      )}

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
        <div ref={containerRef} className="relative aspect-video w-full flex items-center justify-center bg-white">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-navy-dark z-20">
              <div className="text-slate-lighter">Loading slides...</div>
            </div>
          )}

          {loadError && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-dark z-20">
              <div className="text-red-400 mb-2">Error loading PDF</div>
              <div className="text-slate-lighter text-sm">{loadError}</div>
            </div>
          )}

          <Document
            key={activeDoc.id}
            file={activeDoc.url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className="flex items-center justify-center"
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="flex items-center justify-center"
              >
                <Page
                  pageNumber={currentPage}
                  width={containerWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                />
              </motion.div>
            </AnimatePresence>
          </Document>

          {/* Navigation Arrows */}
          <button
            onClick={() => paginate(-1)}
            className={cn(
              "absolute left-2 md:left-4 top-1/2 z-10 -translate-y-1/2",
              "flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full",
              "bg-navy-dark/80 backdrop-blur-sm border border-slate-dark",
              "text-slate-lighter transition-all duration-200",
              "hover:bg-electric-blue/10 hover:text-electric-blue hover:border-electric-blue/30",
              "focus:outline-none focus:ring-2 focus:ring-electric-blue"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          <button
            onClick={() => paginate(1)}
            className={cn(
              "absolute right-2 md:right-4 top-1/2 z-10 -translate-y-1/2",
              "flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full",
              "bg-navy-dark/80 backdrop-blur-sm border border-slate-dark",
              "text-slate-lighter transition-all duration-200",
              "hover:bg-electric-blue/10 hover:text-electric-blue hover:border-electric-blue/30",
              "focus:outline-none focus:ring-2 focus:ring-electric-blue"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-2 py-4 bg-navy-medium">
          {numPages > 0 &&
            Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-navy-medium",
                  page === currentPage
                    ? "bg-electric-blue shadow-md shadow-electric-blue/50"
                    : "bg-slate-dark hover:bg-slate-medium"
                )}
                aria-label={`Go to slide ${page}`}
              />
            ))}
        </div>
      </div>

      {/* Caption */}
      <p className="mt-4 text-center text-sm text-slate-lighter">
        {activeDoc.label}{" "}
        {numPages > 0 && `(${currentPage} / ${numPages})`}
      </p>
    </div>
  );
}
