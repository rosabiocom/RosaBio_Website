"use client";

import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Zap, Target, TrendingDown, LucideIcon } from "lucide-react";
import { siteContent } from "@/data/siteContent";

// Icon mapping for siteContent iconKey values
const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  target: Target,
  trendingDown: TrendingDown,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export function ValueProps() {
  return (
    <Section className="bg-navy-darkest">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {siteContent.valueProps.title.part1}{" "}
          <span className="text-electric-blue">{siteContent.valueProps.title.highlight}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-lighter">
          {siteContent.valueProps.subtitle}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8"
      >
        {siteContent.valueProps.items.map((prop) => {
          const Icon = iconMap[prop.iconKey] || Zap;
          return (
            <motion.div key={prop.title} variants={cardVariants}>
              <Card className="h-full text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-electric-blue/10 text-electric-blue">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold md:text-2xl">{prop.title}</h3>
                <p className="mt-3 text-slate-lighter">{prop.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
