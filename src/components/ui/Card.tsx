"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-navy-medium bg-navy-dark/50 p-6 md:p-8",
        "backdrop-blur-sm",
        hover &&
          "transition-all duration-300 hover:border-electric-blue/50 hover:bg-navy-dark hover:shadow-lg hover:shadow-electric-blue/5",
        className
      )}
    >
      {children}
    </div>
  );
}
