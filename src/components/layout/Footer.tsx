import { Mail } from "lucide-react";
import { siteContent } from "@/data/siteContent";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-navy-medium bg-navy-dark">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 text-2xl font-bold tracking-tight">
            {siteContent.footer.logo.part1}
            <span className="text-electric-blue">{siteContent.footer.logo.part2}</span>
          </div>

          {/* Contact Header */}
          <p className="mb-6 text-lg text-slate-lighter">
            {siteContent.footer.contactText}
          </p>

          {/* Email */}
          <a
            href={`mailto:${siteContent.footer.email}`}
            className="inline-flex items-center gap-3 text-2xl font-semibold text-electric-blue transition-colors hover:text-electric-blue-light md:text-3xl"
          >
            <Mail className="h-6 w-6 md:h-8 md:w-8" />
            {siteContent.footer.email}
          </a>

          {/* Copyright */}
          <div className="mt-12 border-t border-navy-medium pt-8 text-sm text-slate-light">
            &copy; {new Date().getFullYear()} {siteContent.footer.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
}
