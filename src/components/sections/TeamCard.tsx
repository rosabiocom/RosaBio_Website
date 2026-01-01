"use client";

import { motion } from "framer-motion";

interface TeamCardProps {
  initials: string;
  name: string;
  role: string;
  bio: string;
  delay?: number;
}

export function TeamCard({ initials, name, role, bio, delay = 0 }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start"
    >
      {/* Initials Avatar */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xl shadow-sm">
        {initials}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl font-bold text-foreground">{name}</h3>
        <p className="text-accent font-medium text-sm mb-3">{role}</p>
        <p className="text-foreground-muted leading-relaxed text-sm">
          {bio}
        </p>
      </div>
    </motion.div>
  );
}