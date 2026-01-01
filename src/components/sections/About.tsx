"use client";

import { Card } from "../ui/Card";
import { Dna, FlaskConical, Microscope, Pill } from "lucide-react";
import { motion } from "framer-motion";

const applications = [
  {
    icon: Microscope,
    title: "Diagnostics",
    description: "Rapid, accurate detection and analysis for clinical applications.",
  },
  {
    icon: Pill,
    title: "Therapeutics",
    description: "Enabling targeted treatment development through precise sequence analysis.",
  },
  {
    icon: FlaskConical,
    title: "Research",
    description: "Accelerating discovery with unbiased, comprehensive sequence insights.",
  },
];

export function About() {
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
              About <span className="text-gradient">RosaBio</span>
            </h2>

            <div className="space-y-4 text-slate-lighter text-lg">
              <p>
                Rosa Bio, Inc. has developed a robust, highly efficient,
                statistics-first approach for analyzing all types of genetic
                sequence variation in raw nucleic acid data.
              </p>
              <p>
                This approach enables more comprehensive, accurate, faster and
                cheaper analysis of nucleic acid information, fundamentally
                reimagining how sequence data is processed and interpreted.
              </p>
              <p>
                By eliminating dependency on reference genomes, we enable truly
                unbiased discovery—capturing all sequence variation in a sample
                without the blind spots inherent in traditional alignment-based
                methods.
              </p>
            </div>

            {/* DNA icon decoration */}
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-electric-blue/10 flex items-center justify-center">
                <Dna className="w-6 h-6 text-electric-blue" />
              </div>
              <div>
                <p className="text-text-primary font-semibold">
                  Statistics-First Paradigm
                </p>
                <p className="text-slate-lighter text-sm">
                  A new standard in sequence analysis
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
            {applications.map((app, index) => (
              <motion.div
                key={app.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Card className="group flex items-start gap-4 p-6 hover:border-electric-blue/30 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-md bg-electric-blue/10 flex items-center justify-center group-hover:bg-electric-blue/15 transition-colors">
                    <app.icon className="w-6 h-6 text-electric-blue" />
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
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
