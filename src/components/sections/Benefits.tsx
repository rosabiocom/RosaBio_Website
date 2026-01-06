"use client";

import { Section } from "@/components/ui/Section";
import { siteContent } from "@/data/siteContent";
import { Check } from "lucide-react";

export function Benefits() {
  return (
    <Section id="benefits" className="bg-navy-darkest">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {siteContent.benefits.title}
        </h2>

        <ul className="mt-10 space-y-4">
          {siteContent.benefits.items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-4 rounded-lg border border-slate-dark/50 bg-navy-dark/50 p-4 backdrop-blur-sm transition-all duration-200 hover:border-electric-blue/30 hover:bg-navy-dark"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric-blue/20">
                <Check className="h-4 w-4 text-electric-blue" />
              </div>
              <span className="text-lg text-slate-lighter">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
