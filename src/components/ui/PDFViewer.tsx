"use client";

import { useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfPath: string;
  width: number;
  currentPage: number;
  onLoadSuccess: (numPages: number) => void;
}

export function PDFViewer({ pdfPath, width, currentPage, onLoadSuccess }: PDFViewerProps) {
  const handleLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    onLoadSuccess(numPages);
  }, [onLoadSuccess]);

  return (
    <div className="flex items-center justify-center w-full">
      <Document
        file={pdfPath}
        onLoadSuccess={handleLoadSuccess}
        loading={
          <div className="flex items-center justify-center h-[300px] sm:h-[400px] md:h-[500px]">
            <div className="text-slate-dark">Loading presentation...</div>
          </div>
        }
        error={
          <div className="flex items-center justify-center h-[300px] sm:h-[400px] md:h-[500px]">
            <div className="text-red-500">Failed to load PDF</div>
          </div>
        }
      >
        <div className="flex items-center justify-center">
          <Page
            pageNumber={currentPage}
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg"
          />
        </div>
      </Document>
    </div>
  );
}
