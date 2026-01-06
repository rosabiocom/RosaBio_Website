// =============================================================================
// SITE CONTENT - Edit text here without touching component code
// =============================================================================
//
// HOW TO EDIT:
// 1. Find the section you want to edit (hero, valueProps, technology, etc.)
// 2. Change the text inside the quotes
// 3. Save and commit - the site will auto-deploy
//
// IMPORTANT:
// - Don't delete quotes "" or commas ,
// - Don't change iconKey values unless instructed
// - Multi-line text uses backticks ` instead of quotes
//
// =============================================================================

export const siteContent = {
  // ===========================================================================
  // HERO SECTION
  // ===========================================================================
  hero: {
    title: {
      part1: "The New Paradigm for",
      highlight: "Nucleic Acid",
      part2: "Sequence Analysis.",
    },
    subtitle: "Statistics-first. No reference genome required. Unbiased discovery.",
    primaryButton: "View Our Technology",
  },

  // ===========================================================================
  // VALUE PROPS SECTION (Smarter. Better. Faster.)
  // ===========================================================================
  valueProps: {
    title: {
      part1: "Smarter. Better.",
      highlight: "Faster.",
    },
    subtitle: "Our technology delivers breakthrough performance across every metric that matters.",
    items: [
      {
        iconKey: "zap",
        title: "Speed",
        description: "Faster processing, lower overhead.",
      },
      {
        iconKey: "target",
        title: "Accuracy",
        description: "Assess all sequence variation in a sample with no bias.",
      },
      {
        iconKey: "trendingDown",
        title: "Cost",
        description: "High-efficiency analysis tools.",
      },
    ],
  },

  // ===========================================================================
  // TECHNOLOGY SECTION
  // ===========================================================================
  technology: {
    title: {
      part1: "A",
      highlight: "Statistics-First",
      part2: "Approach.",
    },
    paragraphs: [
      "A new paradigm for analysis of nucleic acid sequence information. Unlike traditional methods, we require no reference genome for sequence alignment.",
      "Our approach enables truly unbiased discovery, identifying patterns and variations that conventional tools simply cannot detect.",
    ],
    externalLink: {
      text: "Read Stanford SPLASH Papers",
      href: "#",
    },
  },

  // ===========================================================================
  // LEADERSHIP SECTION
  // ===========================================================================
  leadership: {
    title: "Leadership.",
    subtitle: "Experienced leaders driving innovation in genomic analysis.",
    team: [
      {
        initials: "JS",
        name: "Julia Salzman",
        title: "CFO",
        description: `Developed SPLASH technology during the Covid-19 pandemic, pioneering a new approach to nucleic acid sequence analysis.`,
      },
      {
        initials: "MSR",
        name: "Michael Rodriguez",
        title: "Co-Founder & CEO",
        description: `Leading scientific vision and research strategy, with deep expertise in computational biology and genomics.`,
      },
    ],
  },

  // ===========================================================================
  // NAVBAR / NAVIGATION
  // ===========================================================================
  navbar: {
    logo: {
      part1: "Rosa",
      part2: "Bio",
    },
    links: [
      { href: "#home", label: "Home" },
      { href: "#technology", label: "Technology" },
      { href: "#leadership", label: "About" },
      { href: "#contact", label: "Contact" },
    ],
  },

  // ===========================================================================
  // FOOTER / CONTACT
  // ===========================================================================
  footer: {
    logo: {
      part1: "Rosa",
      part2: "Bio",
    },
    contactText: "For corporate partnerships and business development:",
    email: "BD@rosabio.com",
    copyright: "RosaBio. All rights reserved.",
  },
};
