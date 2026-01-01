"use client";

import { PillarCard } from "../ui/PillarCard";
import { PDFSlideCarousel } from "../ui/PDFSlideCarousel";
import { Brain, Zap, FileText, ExternalLink, Sparkles, Database, Layers, Cpu, TestTube, Dna, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { siteContent } from "@/data/siteContent";

// Icon mapping - maps string keys to icon components
const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  zap: Zap,
  layers: Layers,
  database: Database,
  testTube: TestTube,
  cpu: Cpu,
  dna: Dna,
  brain: Brain,
  fileText: FileText,
  externalLink: ExternalLink,
};

export function Technology() {
  const { technology } = siteContent;

  return (
    <section id="technology" className="relative py-20 md:py-32 bg-navy-dark overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            {technology.header.titlePrefix} <span className="text-gradient">{technology.header.titleHighlight}</span> {technology.header.titleSuffix}
          </h2>
          <p className="text-lg text-slate-lighter">
            {technology.header.description}
          </p>
        </motion.div>

        {/* 2. THREE PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {technology.pillars.map((pillar, index) => {
            const IconComponent = ICON_MAP[pillar.iconKey] || Sparkles;
            return (
              <PillarCard
                key={pillar.title}
                icon={IconComponent}
                title={pillar.title}
                description={pillar.description}
                delay={index * 0.1}
              />
            );
          })}
        </div>

        {/* 3. TECHNOLOGY DECK & RESOURCES GRID */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* Left Side: Interactive Deck (Larger) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-text-primary mb-2">{technology.deck.title}</h3>
              <p className="text-slate-lighter">{technology.deck.description}</p>
            </div>

            {/* PDF Slide Carousel with tabs */}
            <PDFSlideCarousel />
          </motion.div>

          {/* Right Side: Scientific Resources (Smaller) */}
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, delay: 0.4 }}
             className="lg:col-span-4 flex flex-col gap-6"
          >
            <div className="mb-2">
              <h3 className="text-2xl font-bold text-text-primary mb-2">{technology.resources.title}</h3>
              <p className="text-slate-lighter">{technology.resources.description}</p>
            </div>

            {technology.resources.items.map((res) => {
              const IconComponent = ICON_MAP[res.iconKey] || ExternalLink;
              return (
                <a
                  key={res.title}
                  href={res.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-6 bg-navy-medium rounded-xl border border-slate-dark hover:border-electric-blue/50 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-electric-blue/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-electric-blue/10 text-electric-blue group-hover:bg-electric-blue group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-text-primary">{res.title}</h4>
                  </div>
                  <p className="text-sm text-slate-lighter mb-4">
                    {res.description}
                  </p>
                  <Button variant="secondary" size="sm" className="w-full justify-between group-hover:border-electric-blue/50">
                    {res.action}
                    <IconComponent className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100" />
                  </Button>
                </a>
              );
            })}
          </motion.div>

        </div>

        {/* 4. SEMORE CAPABILITIES */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              {technology.capabilities.title} <span className="text-gradient">{technology.capabilities.titleHighlight}</span>
            </h3>
            <p className="text-slate-lighter max-w-2xl mx-auto">
              {technology.capabilities.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technology.capabilities.items.map((capability, index) => {
              const IconComponent = ICON_MAP[capability.iconKey] || Database;
              return (
                <motion.div
                  key={capability.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 bg-navy-medium rounded-xl border border-slate-dark hover:border-electric-blue/30 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-electric-blue/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-electric-blue/10 text-electric-blue">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-text-primary">{capability.title}</h4>
                  </div>
                  <p className="text-sm text-slate-lighter">
                    {capability.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 5. PROPRIETARY TOOLS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              {technology.tools.title} <span className="text-gradient">{technology.tools.titleHighlight}</span>
            </h3>
            <p className="text-slate-lighter max-w-2xl mx-auto">
              {technology.tools.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {technology.tools.items.map((tool, index) => {
              const IconComponent = ICON_MAP[tool.iconKey] || Dna;
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 bg-navy-medium rounded-xl border border-slate-dark hover:border-electric-blue/30 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-electric-blue/5 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-electric-blue/10 text-electric-blue">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{tool.title}</h4>
                      <p className="text-xs text-electric-blue mb-2">{tool.subtitle}</p>
                      <p className="text-sm text-slate-lighter">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
