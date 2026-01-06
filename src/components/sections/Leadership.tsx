"use client";

import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function Leadership() {
  return (
    <Section id="leadership" className="bg-navy-darkest">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {siteContent.leadership.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-lighter">
          {siteContent.leadership.subtitle}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mx-auto mt-12 grid max-w-4xl gap-8 md:mt-16 md:grid-cols-2"
      >
        {siteContent.leadership.team.map((leader) => (
          <motion.div key={leader.initials} variants={cardVariants}>
            <Card className="text-center">
              {/* Avatar Placeholder */}
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-electric-blue to-electric-blue-dark text-2xl font-bold text-white md:h-28 md:w-28 md:text-3xl">
                {leader.initials}
              </div>

              <h3 className="text-xl font-semibold md:text-2xl">
                {leader.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-electric-blue">
                {leader.title}
              </p>
              <p className="mt-4 text-slate-lighter">{leader.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
