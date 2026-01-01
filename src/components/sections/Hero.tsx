"use client";

import { Button } from "../ui/Button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// --- COMPONENT 1: GAS CLOUD (Dark theme - use screen blend mode) ---
const GasCloud = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0">
      {/* Primary cloud - responsive sizes */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] bg-electric-blue/30 blur-[80px] md:blur-[100px] lg:blur-[120px] rounded-full mix-blend-screen"
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: "-50%", y: "-50%" }}
      />

      {/* Secondary cloud - responsive sizes */}
      <motion.div
        className="absolute top-1/3 left-1/2 w-[150px] h-[150px] md:w-[225px] md:h-[225px] lg:w-[300px] lg:h-[300px] bg-blue-400/20 blur-[60px] md:blur-[80px] lg:blur-[100px] rounded-full mix-blend-screen"
        animate={{ x: ["-60%", "-40%", "-60%"], y: ["-20%", "0%", "-20%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Tertiary cloud - responsive sizes */}
      <motion.div
        className="absolute bottom-1/3 right-1/2 w-[175px] h-[175px] md:w-[260px] md:h-[260px] lg:w-[350px] lg:h-[350px] bg-indigo-500/15 blur-[60px] md:blur-[80px] lg:blur-[100px] rounded-full mix-blend-screen"
        animate={{ x: ["60%", "40%", "60%"], y: ["10%", "-10%", "10%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

// --- COMPONENT 2: PARTICLE FIELD ---
const ParticleField = () => {
  // Initialize with an empty array so server & client match initially
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate particles ONLY in the browser (client-side)
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 + "%",
      yStart: Math.random() * 20 + 100 + "%",
      yEnd: Math.random() * -20 - 20 + "%",
      size: Math.random() * 4 + 2 + "px",
      duration: Math.random() * 10 + 15 + "s",
      delay: Math.random() * 5 + "s",
      opacity: Math.random() * 0.5 + 0.3,
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-electric-blue blur-[1px]"
          // The style prop is now safe because 'particles' is only populated on the client
          style={{ left: p.x, width: p.size, height: p.size }}
          initial={{ top: p.yStart, opacity: 0 }}
          animate={{ top: p.yEnd, opacity: [0, p.opacity, 0] }}
          transition={{
            duration: parseFloat(p.duration),
            repeat: Infinity,
            ease: "linear",
            delay: parseFloat(p.delay),
          }}
        />
      ))}
    </div>
  );
};

// --- COMPONENT 3: DNA HELIX ---
function DNAHelix() {
  const rows = 15;
  return (
    <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full flex items-center justify-center isolate z-20">

      <GasCloud />
      <ParticleField />

      <div className="relative h-full w-48 md:w-56 lg:w-64 flex flex-col justify-between py-6 md:py-8 lg:py-10 z-20">
        {[...Array(rows)].map((_, i) => (
          <DNARow key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

function DNARow({ index }: { index: number }) {
  const delay = index * 0.15;
  const duration = 3;

  const solidColor = "bg-electric-blue";
  const hollowBorder = "border-[2px] border-electric-blue bg-navy-dark";
  const lineColor = "bg-electric-blue/40";

  const letterIndex = Math.floor(index / 2) % 4;
  const letter = ["T", "G", "C", "A"][letterIndex];
  const showLetter = index % 2 === 0;

  return (
    <div className="relative w-full h-6 flex items-center justify-center">

      {/* 1. THE LINE */}
      <motion.div
        className={`absolute h-[1px] ${lineColor}`}
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: ["100px", "0px", "100px", "0px", "100px"],
          opacity: [1, 0, 1, 0, 1],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />

      {/* 2. THE LETTER - BLENDED */}
      {showLetter && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: delay }}
            className="flex items-center justify-center w-6 h-6 bg-transparent"
          >
            <span className="text-[12px] font-black text-electric-blue leading-none drop-shadow-sm">
              {letter}
            </span>
          </motion.div>
        </div>
      )}

      {/* 3. SOLID DOT */}
      <motion.div
        className={`absolute w-3.5 h-3.5 rounded-full ${solidColor} z-20`}
        animate={{
          x: [-50, 50, -50],
          scale: [1, 0.7, 1],
          zIndex: [20, 0, 20],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
        }}
      />

      {/* 4. HOLLOW DOT */}
      <motion.div
        className={`absolute w-3.5 h-3.5 rounded-full ${hollowBorder} z-20 box-content`}
        animate={{
          x: [50, -50, 50],
          scale: [0.7, 1, 0.7],
          zIndex: [0, 20, 0],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
        }}
      />
    </div>
  );
}

// --- HERO COMPONENT ---
export function Hero() {
  const handleScrollToTechnology = () => {
    const element = document.querySelector("#technology");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy-darkest">

      {/* Layer 1: The "Statistics" Dot Matrix */}
      <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none" />

      {/* Layer 2: The "Raw Sequence" Floating Letters */}
      <div className="absolute inset-0 bg-dna-letters z-0 pointer-events-none" />

      {/* 3. MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column (Text) */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-electric-blue/10 border border-electric-blue/20 mb-6 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-sm bg-electric-blue" />
              <span className="text-electric-blue text-sm font-medium">Statistics-First Analysis</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-text-primary">Smarter.</span>{" "}
              <span className="text-gradient">Better.</span>{" "}
              <span className="text-text-primary">Faster.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-lighter max-w-lg mb-8"
            >
              A new paradigm for analysis of nucleic acid sequence information.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" onClick={handleScrollToTechnology}>
                View Technology <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => {
                  const element = document.querySelector("#contact");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}>
                Get in Touch
              </Button>
            </motion.div>
          </div>

          {/* Right Column (DNA + Atmosphere) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex relative items-center justify-center h-[600px]"
          >
            <DNAHelix />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
