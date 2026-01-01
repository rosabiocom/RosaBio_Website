"use client";

import { Button } from "../ui/Button";
import { Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { siteContent } from "@/data/siteContent";

export function Contact() {
  const { contact } = siteContent;

  return (
    <section id="contact" className="relative py-20 md:py-32 bg-navy-dark overflow-hidden">

      {/* Background Dot Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Badge - Mail icon is UI, kept hardcoded */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-electric-blue/10 border border-electric-blue/20 mb-8 backdrop-blur-sm">
            <Mail className="w-4 h-4 text-electric-blue" />
            <span className="text-electric-blue text-sm font-medium">
              {contact.badge}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6">
            {contact.title} <span className="text-gradient">{contact.titleHighlight}</span>?
          </h2>

          {/* Description */}
          <p className="text-lg text-slate-lighter mb-10">
            {contact.description}
          </p>

          {/* CTA Button - ArrowRight is UI icon, kept hardcoded */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <a href={`mailto:${contact.email}`}>
              <Button size="lg" className="text-lg px-10 py-6 h-auto">
                <Mail className="w-5 h-5 mr-2" />
                {contact.email}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>

          {/* Subtext */}
          <p className="mt-6 text-slate-lighter text-sm opacity-80">
            {contact.subtext}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
