"use client";

import { Button } from "@/components/ui/Button";
import { ParticlesBackground } from "@/components/particles/ParticlesBackground";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { siteContent } from "@/data/siteContent";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function Hero() {
  const scrollToTechnology = () => {
    const element = document.getElementById("technology");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-darkest"
    >
      {/* Particles Background */}
      <div className="absolute inset-0">
        <ParticlesBackground />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-darkest/50 via-transparent to-navy-darkest" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-5xl px-6 text-center md:px-8"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl xl:text-7xl"
        >
          {siteContent.hero.title.part1}{" "}
          <span className="text-electric-blue">{siteContent.hero.title.highlight}</span>{" "}
          {siteContent.hero.title.part2}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-lighter md:mt-8 md:text-xl lg:text-2xl"
        >
          {siteContent.hero.subtitle}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-10 md:mt-12">
          <Button size="lg" onClick={scrollToTechnology}>
            {siteContent.hero.primaryButton}
            <ArrowDown className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-darkest to-transparent" />
    </section>
  );
}
