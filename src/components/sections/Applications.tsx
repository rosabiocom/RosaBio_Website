"use client";

import { Card } from "../ui/Card";
import { Microscope, Activity, Users, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";

const applications = [
  {
    icon: Microscope,
    title: "Disease Detection",
    description:
      "Multi-cancer early detection, autoimmune disease identification, and neurological condition screening through comprehensive genetic analysis.",
  },
  {
    icon: Activity,
    title: "MRD Tracking",
    description:
      "Minimal Residual Disease monitoring for cancer patients, enabling precise treatment response assessment and early relapse detection.",
  },
  {
    icon: Users,
    title: "Patient Stratification",
    description:
      "Optimize treatment selection by identifying genetic signatures that predict therapeutic response and patient outcomes.",
  },
  {
    icon: FlaskConical,
    title: "Drug Discovery",
    description:
      "Accelerate drug development by identifying novel targets, biomarkers, and understanding disease mechanisms at the genetic level.",
  },
];

export function Applications() {
  return (
    <section
      id="applications"
      className="relative py-20 md:py-32 bg-navy-darkest overflow-hidden"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            Precision Medicine{" "}
            <span className="text-gradient">Applications</span>
          </h2>
          <p className="text-lg text-slate-lighter">
            Our statistics-first approach powers breakthrough applications
            across the precision medicine landscape.
          </p>
        </motion.div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {applications.map((app, index) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:border-electric-blue/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-electric-blue/10 flex items-center justify-center group-hover:bg-electric-blue/15 transition-colors">
                    <app.icon className="w-6 h-6 text-electric-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary group-hover:text-electric-blue transition-colors">
                      {app.title}
                    </h3>
                    <p className="mt-2 text-slate-lighter">
                      {app.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
