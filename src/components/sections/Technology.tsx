"use client";

import { PillarCard } from "../ui/PillarCard";
import { PDFSlideCarousel } from "../ui/PDFSlideCarousel";
import { Brain, CheckCircle, Zap, FileText, ExternalLink, Sparkles, Database, Layers, Cpu, TestTube, Dna } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

const pillars = [
  {
    icon: Sparkles,
    title: "Detects Hidden Complexity",
    description:
      "ROSA's statistics-first Semore platform allows detection of genomic complexity missed by other methods.",
  },
  {
    icon: Zap,
    title: "Faster, Cheaper, Smarter",
    description:
      "Enables faster, cheaper, smarter genomics analysis with computationally light processing.",
  },
  {
    icon: Layers,
    title: "Readily Scalable",
    description:
      "Scales to meet any analysis demands - from single samples to population-scale studies.",
  },
];

const resources = [
  {
    title: "Scientific Publications",
    description: "Read the foundational research behind our statistics-first methodology.",
    icon: ExternalLink,
    action: "Read Papers",
    href: "https://www.cell.com/cell/fulltext/S0092-8674(23)01158-3",
  },
  {
    title: "Benefits of Statistics-First",
    description: "Deep dive into the benefits of reference-free sequence analysis.",
    icon: FileText,
    action: "Download PDF",
    href: "/documents/benefits-statistics-first.pdf",
  },
];

const capabilities = [
  {
    icon: Database,
    title: "Nucleic Acid Agnostic",
    description: "Works with DNA (WGS and targeted), RNA, short and long read, exome, non-coding regions, ctDNA, bisulfite, and more.",
  },
  {
    icon: Layers,
    title: "Structure-Based Detection",
    description: "Detects structure-based changes, not limited by gene panels. Captures the full complexity of genomic variation.",
  },
  {
    icon: TestTube,
    title: "Flexible Sample Types",
    description: "Can be used with tissue sample or liquid biopsy (plasma cfDNA) for maximum clinical flexibility.",
  },
  {
    icon: Cpu,
    title: "AI-Ready Output",
    description: "Semore software output is AI-ready, enabling seamless integration with machine learning pipelines.",
  },
];

const proprietaryTools = [
  {
    icon: Dna,
    title: "Rosa-V",
    subtitle: "Variant Caller",
    description: "Detects ALL forms of variation directly from raw sequencing reads. No reference genome required. Identifies indels, fusions, structural variants, CNVs, and more.",
  },
  {
    icon: Brain,
    title: "Syve",
    subtitle: "Disease Classifier",
    description: "Leverages deep sequencing data to classify patients using machine learning models trained on comprehensive genetic signatures.",
  },
];

export function Technology() {
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
            The <span className="text-gradient">Semore</span> Platform
          </h2>
          <p className="text-lg text-slate-lighter">
            Statistics-first genomic analysis that detects complexity missed by other methods.
            Diverse applications: Diagnostics, Therapeutics, and beyond.
          </p>
        </motion.div>

        {/* 2. THREE PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {pillars.map((pillar, index) => (
            <PillarCard
              key={pillar.title}
              icon={pillar.icon}
              title={pillar.title}
              description={pillar.description}
              delay={index * 0.1}
            />
          ))}
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
              <h3 className="text-2xl font-bold text-text-primary mb-2">Interactive Technology Deck</h3>
              <p className="text-slate-lighter">Explore the core algorithms driving our platform.</p>
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
              <h3 className="text-2xl font-bold text-text-primary mb-2">Scientific Validation</h3>
              <p className="text-slate-lighter">Review our peer-reviewed research.</p>
            </div>

            {resources.map((res) => (
              <a
                key={res.title}
                href={res.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6 bg-navy-medium rounded-xl border border-slate-dark hover:border-electric-blue/50 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-electric-blue/5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-electric-blue/10 text-electric-blue group-hover:bg-electric-blue group-hover:text-white transition-colors">
                    <res.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-text-primary">{res.title}</h4>
                </div>
                <p className="text-sm text-slate-lighter mb-4">
                  {res.description}
                </p>
                <Button variant="secondary" size="sm" className="w-full justify-between group-hover:border-electric-blue/50">
                  {res.action}
                  <res.icon className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100" />
                </Button>
              </a>
            ))}
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
              Semore <span className="text-gradient">Capabilities</span>
            </h3>
            <p className="text-slate-lighter max-w-2xl mx-auto">
              A unified platform agnostic to sample type and nucleic acid.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, index) => (
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
                    <capability.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-text-primary">{capability.title}</h4>
                </div>
                <p className="text-sm text-slate-lighter">
                  {capability.description}
                </p>
              </motion.div>
            ))}
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
              Proprietary <span className="text-gradient">Tools</span>
            </h3>
            <p className="text-slate-lighter max-w-2xl mx-auto">
              Purpose-built analysis tools powered by our statistics-first approach.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {proprietaryTools.map((tool, index) => (
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
                    <tool.icon className="w-6 h-6" />
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
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
