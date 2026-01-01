"use client";

import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface PillarCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function PillarCard({ icon: Icon, title, description, delay = 0 }: PillarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="group h-full">
        {/* Icon container - geometric, sharp */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-md bg-electric-blue/10 flex items-center justify-center group-hover:bg-electric-blue/15 transition-colors duration-200">
            <Icon className="w-6 h-6 text-electric-blue" />
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-electric-blue transition-colors duration-200">
            {title}
          </h3>
          <p className="text-slate-lighter leading-relaxed">
            {description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
