"use client";

import { TeamCard } from "../ui/TeamCard";
import { motion } from "framer-motion";

const team = [
  {
    initials: "JS",
    name: "Julia Salzman",
    role: "Founder & Consultant",
    bio: "Associate Professor at Stanford University in Biomedical Data Science, Biology, and Statistics. Developer of statistical algorithms that discovered circular RNA and pioneering statistics-first genomic analysis methods. Recognized with an Alfred P. Sloan Fellowship, NSF CAREER Award, and funding from NIH, NSF, and CZI.",
  },
  {
    initials: "MR",
    name: "Michael Rabson",
    role: "Chief Executive Officer",
    bio: "25+ years in life sciences with focus on platform companies. Former partner at Wilson Sonsini Goodrich & Rosati and General Counsel at Maxygen and Cytokinetics. Patent bar member with publications in Science, Nature, and PNAS. Ph.D. from Yale University, J.D. from Yale Law School.",
  },
];

export function Leadership() {
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
            Our <span className="text-gradient">Leadership</span>
          </h2>
          <p className="text-lg text-slate-lighter">
            World-class scientists and leaders driving innovation in nucleic
            acid sequence analysis.
          </p>
        </motion.div>

        {/* Team Cards - Horizontal Layout */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {team.map((member, index) => (
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
