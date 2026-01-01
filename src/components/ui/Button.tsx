"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles - sharp corners for tech look
          "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-navy-darkest disabled:opacity-50 disabled:cursor-not-allowed",
          // Variants
          {
            // Primary - Solid Electric Blue
            "bg-electric-blue text-white hover:bg-electric-dark active:bg-electric-dark shadow-lg shadow-electric-blue/20 hover:shadow-xl hover:shadow-electric-blue/30":
              variant === "primary",
            // Secondary - Outline on dark
            "bg-transparent border-2 border-electric-blue text-electric-blue hover:bg-electric-blue/10":
              variant === "secondary",
            // Ghost - Text only
            "bg-transparent text-slate-lighter hover:text-electric-blue hover:bg-navy-medium":
              variant === "ghost",
          },
          // Sizes
          {
            "text-sm px-4 py-2 gap-1.5": size === "sm",
            "text-base px-6 py-3 gap-2": size === "md",
            "text-lg px-8 py-4 gap-2.5": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
