"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles - dark card with subtle border
          "bg-navy-dark border border-slate-dark rounded-lg p-6 transition-all duration-200",
          // Hover effects
          hover && "hover:shadow-xl hover:shadow-electric-blue/5 hover:border-slate-medium",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
