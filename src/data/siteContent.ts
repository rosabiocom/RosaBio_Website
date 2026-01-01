// =============================================================================
// SITE CONTENT - Edit text here without touching component code
// =============================================================================
//
// HOW TO EDIT:
// 1. Find the section you want to edit (hero, about, technology, etc.)
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
    badge: "Statistics-First Analysis",
    title: {
      part1: "Smarter.",
      part2: "Better.",
      part3: "Faster.",
    },
    subtitle: "A new paradigm for analysis of nucleic acid sequence information.",
    primaryButton: "View Technology",
    secondaryButton: "Get in Touch",
  },

  // ===========================================================================
  // ABOUT SECTION
  // ===========================================================================
  about: {
    title: "RosaBio",
    paragraphs: [
      `Rosa Bio, Inc. has developed a robust, highly efficient, statistics-first approach for analyzing all types of genetic sequence variation in raw nucleic acid data.`,
      `This approach enables more comprehensive, accurate, faster and cheaper analysis of nucleic acid information, fundamentally reimagining how sequence data is processed and interpreted.`,
      `By eliminating dependency on reference genomes, we enable truly unbiased discovery—capturing all sequence variation in a sample without the blind spots inherent in traditional alignment-based methods.`,
    ],
    feature: {
      title: "Statistics-First Paradigm",
      subtitle: "A new standard in sequence analysis",
    },
    applications: [
      {
        iconKey: "microscope",
        title: "Diagnostics",
        description: "Rapid, accurate detection and analysis for clinical applications.",
      },
      {
        iconKey: "pill",
        title: "Therapeutics",
        description: "Enabling targeted treatment development through precise sequence analysis.",
      },
      {
        iconKey: "flask",
        title: "Research",
        description: "Accelerating discovery with unbiased, comprehensive sequence insights.",
      },
    ],
  },

  // ===========================================================================
  // TECHNOLOGY SECTION
  // ===========================================================================
  technology: {
    header: {
      titlePrefix: "The",
      titleHighlight: "Semore",
      titleSuffix: "Platform",
      description: "Statistics-first genomic analysis that detects complexity missed by other methods. Diverse applications: Diagnostics, Therapeutics, and beyond.",
    },
    pillars: [
      {
        iconKey: "sparkles",
        title: "Detects Hidden Complexity",
        description: "ROSA's statistics-first Semore platform allows detection of genomic complexity missed by other methods.",
      },
      {
        iconKey: "zap",
        title: "Faster, Cheaper, Smarter",
        description: "Enables faster, cheaper, smarter genomics analysis with computationally light processing.",
      },
      {
        iconKey: "layers",
        title: "Readily Scalable",
        description: "Scales to meet any analysis demands - from single samples to population-scale studies.",
      },
    ],
    deck: {
      title: "Interactive Technology Deck",
      description: "Explore the core algorithms driving our platform.",
    },
    resources: {
      title: "Scientific Validation",
      description: "Review our peer-reviewed research.",
      items: [
        {
          iconKey: "externalLink",
          title: "Scientific Publications",
          description: "Read the foundational research behind our statistics-first methodology.",
          action: "Read Papers",
          href: "https://www.cell.com/cell/fulltext/S0092-8674(23)01158-3",
        },
        {
          iconKey: "fileText",
          title: "Benefits of Statistics-First",
          description: "Deep dive into the benefits of reference-free sequence analysis.",
          action: "Download PDF",
          href: "/documents/benefits-statistics-first.pdf",
        },
      ],
    },
    capabilities: {
      title: "Semore",
      titleHighlight: "Capabilities",
      description: "A unified platform agnostic to sample type and nucleic acid.",
      items: [
        {
          iconKey: "database",
          title: "Nucleic Acid Agnostic",
          description: "Works with DNA (WGS and targeted), RNA, short and long read, exome, non-coding regions, ctDNA, bisulfite, and more.",
        },
        {
          iconKey: "layers",
          title: "Structure-Based Detection",
          description: "Detects structure-based changes, not limited by gene panels. Captures the full complexity of genomic variation.",
        },
        {
          iconKey: "testTube",
          title: "Flexible Sample Types",
          description: "Can be used with tissue sample or liquid biopsy (plasma cfDNA) for maximum clinical flexibility.",
        },
        {
          iconKey: "cpu",
          title: "AI-Ready Output",
          description: "Semore software output is AI-ready, enabling seamless integration with machine learning pipelines.",
        },
      ],
    },
    tools: {
      title: "Proprietary",
      titleHighlight: "Tools",
      description: "Purpose-built analysis tools powered by our statistics-first approach.",
      items: [
        {
          iconKey: "dna",
          title: "Rosa-V",
          subtitle: "Variant Caller",
          description: "Detects ALL forms of variation directly from raw sequencing reads. No reference genome required. Identifies indels, fusions, structural variants, CNVs, and more.",
        },
        {
          iconKey: "brain",
          title: "Syve",
          subtitle: "Disease Classifier",
          description: "Leverages deep sequencing data to classify patients using machine learning models trained on comprehensive genetic signatures.",
        },
      ],
    },
  },

  // ===========================================================================
  // APPLICATIONS SECTION
  // ===========================================================================
  applications: {
    title: "Precision Medicine",
    titleHighlight: "Applications",
    description: "Our statistics-first approach powers breakthrough applications across the precision medicine landscape.",
    items: [
      {
        iconKey: "microscope",
        title: "Disease Detection",
        description: "Multi-cancer early detection, autoimmune disease identification, and neurological condition screening through comprehensive genetic analysis.",
      },
      {
        iconKey: "activity",
        title: "MRD Tracking",
        description: "Minimal Residual Disease monitoring for cancer patients, enabling precise treatment response assessment and early relapse detection.",
      },
      {
        iconKey: "users",
        title: "Patient Stratification",
        description: "Optimize treatment selection by identifying genetic signatures that predict therapeutic response and patient outcomes.",
      },
      {
        iconKey: "flask",
        title: "Drug Discovery",
        description: "Accelerate drug development by identifying novel targets, biomarkers, and understanding disease mechanisms at the genetic level.",
      },
    ],
  },

  // ===========================================================================
  // LEADERSHIP SECTION
  // ===========================================================================
  leadership: {
    title: "Our",
    titleHighlight: "Leadership",
    description: "World-class scientists and leaders driving innovation in nucleic acid sequence analysis.",
    team: [
      {
        initials: "JS",
        name: "Julia Salzman",
        role: "Founder & Consultant",
        bio: `Associate Professor at Stanford University in Biomedical Data Science, Biology, and Statistics. Developer of statistical algorithms that discovered circular RNA and pioneering statistics-first genomic analysis methods. Recognized with an Alfred P. Sloan Fellowship, NSF CAREER Award, and funding from NIH, NSF, and CZI.`,
      },
      {
        initials: "MR",
        name: "Michael Rabson",
        role: "Chief Executive Officer",
        bio: `25+ years in life sciences with focus on platform companies. Former partner at Wilson Sonsini Goodrich & Rosati and General Counsel at Maxygen and Cytokinetics. Patent bar member with publications in Science, Nature, and PNAS. Ph.D. from Yale University, J.D. from Yale Law School.`,
      },
    ],
  },

  // ===========================================================================
  // CONTACT SECTION
  // ===========================================================================
  contact: {
    badge: "Business Development",
    title: "Ready to",
    titleHighlight: "Connect",
    description: "RosaBio is actively seeking partnerships with life science, diagnostic and pharma companies to develop and commercialize its transformative technology.",
    email: "BD@rosabio.com",
    subtext: "For partnership inquiries and business development opportunities",
  },

  // ===========================================================================
  // HEADER / NAVIGATION
  // ===========================================================================
  header: {
    logo: {
      part1: "Rosa",
      part2: "Bio",
    },
    navLinks: [
      { href: "#technology", label: "Technology" },
      { href: "#about", label: "About" },
      { href: "#leadership", label: "Leadership" },
      { href: "#contact", label: "Contact" },
    ],
    ctaButton: "Get in Touch",
  },

  // ===========================================================================
  // FOOTER
  // ===========================================================================
  footer: {
    logo: {
      part1: "Rosa",
      part2: "Bio",
    },
    copyright: "RosaBio. All rights reserved.",
    contactLink: "Contact",
    contactEmail: "BD@rosabio.com",
  },
};
