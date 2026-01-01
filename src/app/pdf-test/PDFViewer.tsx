"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Use local worker file (copied from node_modules to public/)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface PDFViewerProps {
  onLog: (msg: string) => void;
}

export default function PDFViewer({ onLog }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const hasLogged = useRef(false);

  useEffect(() => {
    if (!hasLogged.current) {
      hasLogged.current = true;
      onLog("PDFViewer mounted (react-pdf v7)");
      onLog(`pdfjs version: ${pdfjs.version}`);
      onLog(`Worker: /pdf.worker.min.js (local)`);
    }
  }, [onLog]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    onLog(`SUCCESS: PDF loaded with ${numPages} pages`);
    setNumPages(numPages);
  };

  const onDocumentLoadError = (err: Error) => {
    onLog(`ERROR loading PDF: ${err.message}`);
    setError(err.message);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">PDF Render Test (react-pdf v7):</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-900 rounded text-red-200">
          Error: {error}
        </div>
      )}

      <div className="bg-white rounded overflow-hidden inline-block">
        <Document
          file="/documents/techsummary.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="p-8 text-gray-800">Loading PDF document...</div>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={600}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {numPages > 0 && (
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
