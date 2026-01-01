"use client";

import { Card } from "../ui/Card";
import { Microscope, Activity, Users, FlaskConical, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";

// Icon mapping - maps string keys to icon components
const ICON_MAP: Record<string, LucideIcon> = {
  microscope: Microscope,
  activity: Activity,
  users: Users,
  flask: FlaskConical,
};

export function Applications() {
  const { applications } = siteContent;

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
            {applications.title}{" "}
            <span className="text-gradient">{applications.titleHighlight}</span>
          </h2>
          <p className="text-lg text-slate-lighter">
            {applications.description}
          </p>
        </motion.div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {applications.items.map((app, index) => {
            const IconComponent = ICON_MAP[app.iconKey] || FlaskConical;
            return (
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
                      <IconComponent className="w-6 h-6 text-electric-blue" />
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
