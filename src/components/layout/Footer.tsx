"use client";

import { siteContent } from "@/data/siteContent";

export function Footer() {
  const { footer } = siteContent;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-dark bg-navy-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-text-primary">{footer.logo.part1}</span>
            <span className="text-lg font-bold text-electric-blue">{footer.logo.part2}</span>
          </div>

          {/* Copyright */}
          <p className="text-slate-lighter text-sm text-center">
            &copy; {currentYear} {footer.copyright}
          </p>

          {/* Minimal links */}
          <div className="flex items-center gap-4 text-sm">
            <a
              href={`mailto:${footer.contactEmail}`}
              className="text-slate-lighter hover:text-electric-blue transition-colors"
            >
              {footer.contactLink}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
