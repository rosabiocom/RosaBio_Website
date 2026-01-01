"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import the PDF component with SSR disabled
const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="p-8 bg-gray-800 rounded-lg text-white">
      Loading PDF component...
    </div>
  ),
});

export default function PDFTestPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">PDF Test Page (next/dynamic)</h1>

      {/* Status Log */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Status Log:</h2>
        <div className="font-mono text-sm space-y-1">
          {logs.length === 0 && (
            <div className="text-gray-400">Waiting for logs...</div>
          )}
          {logs.map((msg, i) => (
            <div
              key={i}
              className={
                msg.includes("ERROR")
                  ? "text-red-400"
                  : msg.includes("SUCCESS")
                  ? "text-green-400"
                  : "text-gray-300"
              }
            >
              {i + 1}. {msg}
            </div>
          ))}
        </div>
      </div>

      {/* PDF Viewer */}
      <PDFViewer onLog={addLog} />
    </div>
  );
}
