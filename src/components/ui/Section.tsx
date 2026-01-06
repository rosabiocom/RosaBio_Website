"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Section({
  children,
  className,
  id,
  fullWidth = false,
}: SectionProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUpVariants}
      className={cn(
        "py-20 md:py-28 lg:py-32",
        !fullWidth && "mx-auto max-w-7xl px-6 md:px-8 lg:px-12",
        className
      )}
    >
      {children}
    </motion.section>
  );
}
