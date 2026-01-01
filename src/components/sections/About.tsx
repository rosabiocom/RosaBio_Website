"use client";

import { Card } from "../ui/Card";
import { Dna, FlaskConical, Microscope, Pill, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";

// Icon mapping - maps string keys to icon components
const ICON_MAP: Record<string, LucideIcon> = {
  microscope: Microscope,
  pill: Pill,
  flask: FlaskConical,
  dna: Dna,
};

export function About() {
  const { about } = siteContent;

  return (
    <section id="about" className="relative py-20 md:py-32 bg-navy-darkest overflow-hidden">

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
              About <span className="text-gradient">{about.title}</span>
            </h2>

            <div className="space-y-4 text-slate-lighter text-lg">
              {about.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* DNA icon decoration */}
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-electric-blue/10 flex items-center justify-center">
                <Dna className="w-6 h-6 text-electric-blue" />
              </div>
              <div>
                <p className="text-text-primary font-semibold">
                  {about.feature.title}
                </p>
                <p className="text-slate-lighter text-sm">
                  {about.feature.subtitle}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right column - Application cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {about.applications.map((app, index) => {
              const IconComponent = ICON_MAP[app.iconKey] || FlaskConical;
              return (
                <motion.div
                  key={app.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="group flex items-start gap-4 p-6 hover:border-electric-blue/30 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 rounded-md bg-electric-blue/10 flex items-center justify-center group-hover:bg-electric-blue/15 transition-colors">
                      <IconComponent className="w-6 h-6 text-electric-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary group-hover:text-electric-blue transition-colors">
                        {app.title}
                      </h3>
                      <p className="text-slate-lighter">
                        {app.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
