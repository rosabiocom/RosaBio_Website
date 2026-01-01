"use client";

import { cn } from "@/lib/utils";

interface DotMatrixProps {
  className?: string;
  density?: "low" | "medium" | "high";
}

export function DotMatrix({ className, density = "medium" }: DotMatrixProps) {
  const dotSize = {
    low: "1px",
    medium: "1.5px",
    high: "2px",
  };

  const gridSize = {
    low: "32px",
    medium: "24px",
    high: "16px",
  };

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        backgroundImage: `radial-gradient(circle, #cbd5e1 ${dotSize[density]}, transparent ${dotSize[density]})`,
        backgroundSize: `${gridSize[density]} ${gridSize[density]}`,
      }}
    />
  );
}
