"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-navy-darkest",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Size variants
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3 text-base",
          size === "lg" && "px-8 py-4 text-lg",
          // Color variants
          variant === "primary" &&
            "bg-electric-blue text-white hover:bg-electric-blue-light active:bg-electric-blue-dark",
          variant === "secondary" &&
            "border-2 border-slate-light text-slate-lighter hover:border-electric-blue hover:text-white",
          variant === "ghost" && "text-slate-lighter hover:text-white",
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
