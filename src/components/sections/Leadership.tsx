"use client";

import { TeamCard } from "../ui/TeamCard";
import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";

export function Leadership() {
  const { leadership } = siteContent;

  return (
    <section id="leadership" className="relative py-20 md:py-32 bg-navy-dark overflow-hidden">
      {/* Background grid pattern */}
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
            {leadership.title} <span className="text-gradient">{leadership.titleHighlight}</span>
          </h2>
          <p className="text-lg text-slate-lighter">
            {leadership.description}
          </p>
        </motion.div>

        {/* Team Cards - Horizontal Layout */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {leadership.team.map((member, index) => (
            <TeamCard
              key={member.name}
              initials={member.initials}
              name={member.name}
              role={member.role}
              bio={member.bio}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
