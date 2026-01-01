"use client";

import { cn } from "@/lib/utils";
import { Card } from "./Card";
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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="group h-full">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Avatar - geometric square with rounded corners */}
          <div className="flex-shrink-0">
            <div
              className={cn(
                "w-16 h-16 rounded-md flex items-center justify-center",
                "bg-electric-blue text-white font-bold text-xl",
                "group-hover:shadow-lg group-hover:shadow-electric-blue/20 transition-shadow duration-200"
              )}
            >
              {initials}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-text-primary group-hover:text-electric-blue transition-colors duration-200">
              {name}
            </h3>
            <p className="text-electric-blue text-sm font-medium mb-3">
              {role}
            </p>
            <p className="text-slate-lighter leading-relaxed">
              {bio}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
