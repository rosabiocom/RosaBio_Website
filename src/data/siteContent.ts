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
      part1: "Stratification of",
      highlight: "Genomic Sequence Complexity",
      part2: "and Phenotypes for Precision Medicine",
    },
    subtitle: [
      "Statistics-first.",
      "No reference genome required.",
      "Unbiased discovery.",
    ],
    primaryButton: "Benefits of Rosa Bio Technology",
    updateNotice: {
      text: "The website is being updated with additional content.",
      contactPrefix: "Please contact:",
      email: "BD@rosabio.com",
      contactSuffix: "for more information.",
    },
  },

  // ===========================================================================
  // BENEFITS SECTION
  // ===========================================================================
  benefits: {
    title: "Benefits of Rosa Bio Technology",
    items: [
      "ROSA's \"statistics first\" Semore platform allows detection of genomic complexity missed by other methods",
      "Allows faster, cheaper, smarter genomics analysis",
      "Readily scalable",
      "Agnostic to nucleic acid type: DNA (WGS and targeted), RNA, short and long read, exome, non-coding regions, ctDNA, bisulfite, etc.",
      "Detects structure-based changes, not based on gene panels",
      "Can be used with tissue sample or liquid biopsy (plasma cfDNA)",
      "Software = AI ready",
      "Diverse applications: Dx, Tx, other",
    ],
  },

  // ===========================================================================
  // VALUE PROPS SECTION (Smarter. Better. Faster.)
  // ===========================================================================
  valueProps: {
    title: {
      part1: "Panoptic.",
      highlight: "Faster. Cheaper.",
    },
    subtitle: "",
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
    techSummary: [
      {
        title: "Why Statistics First",
        description: "Our statistics-first approach analyzes raw data directly, eliminating reference genome bias and enabling detection of all genomic complexity.",
      },
      {
        title: "White Papers",
        description: "Read our white papers on the benefits of a statistics-first approach to genomic analysis.",
        papers: [
          {
            title: "Benefits of a Statistics-first Approach to Analyzing Nucleic Acid Sequence Data",
            file: "/whitepapers/rosabio-benefits-of-statistics-first-approach.pdf",
          },
          {
            title: "Statistics-First Genomic Analysis: Expanding Detection beyond the Limits of Reference Alignment in Precision Medicine",
            file: "/whitepapers/rosabio-statistics-first-genomic-analysis-oct-2026.pdf",
          },
          {
            title: "Novel Algorithms for Interpretable, Ultra-Efficient Precision Medicine",
            file: "/whitepapers/rosabio-novel-algorithms-precision-medicine.pdf",
          },
        ],
      },
      {
        title: "Precision Medicine Applications",
        description: "Patient stratification using sequence variation that predicts treatment response and disease progression.",
      },
    ],
    slides: {
      pdfPath: "/slides/techsummary.pdf",
      items: [
        { title: "Enhanced Measurement of Genomic Complexity", subtitle: "To Drive Clinical Breakthroughs" },
        { title: "Old Paradigm, New Reality", subtitle: "NGS technologies generating massive amounts of genomic data" },
        { title: "Reference Genomes Poorly Represent Biology", subtitle: "Current methods are dependent on comparisons to reference genomes" },
        { title: "Legacy Genomics Workflows", subtitle: "Complex, time and resource intensive, with unavoidable data loss" },
        { title: "ROSA Changes the Paradigm", subtitle: "A statistics-first approach" },
        { title: "ROSA's Semore Platform", subtitle: "Smarter, faster, cheaper genomic analysis" },
        { title: "Comparison of Approaches", subtitle: "Traditional Alignment vs Statistics-First" },
        { title: "ROSA Semore Software Accuracy", subtitle: "Ability to detect all genetic features" },
        { title: "ROSA Semore Software Overview", subtitle: "Statistics-first detection of genomic complexity" },
        { title: "ROSA BIO Intellectual Property", subtitle: "Differentiated and protectable approach" },
      ],
    },
  },

  // ===========================================================================
  // SINGLE CELL DEMO SECTION (shown right under the hero)
  // Each panel opens a page of the static demo in public/highlights/.
  // featured: true = large card on the top row. chart.min = where the bars start;
  // chart.highlightFirst: true = first bar is p2single, the rest are comparisons.
  // chart.note: optional line under the bars ("" = none).
  // ===========================================================================
  singleCellDemo: {
    label: "p2single results",
    title: "Single Cell Demo",
    description: "Sequence-level models, tested on cells they never saw. Every score is on cells, patients or experiments kept out of training.",
    src: "/highlights/index.html",
    openLabel: "Open the full demo",
    stats: [
      { value: "8", label: "public studies" },
      { value: "3", label: "species" },
      { value: "0.978", label: "AUC on unseen patients" },
      { value: "45 of 46", label: "published pancreas results beaten" },
    ],
    panels: [
      {
        featured: true,
        tag: "Human pancreas · cell types",
        title: "Pancreas cell types: at or above every published method",
        metric: "F1 1.000",
        metricLabel: "45 of 46 published results score lower, 1 ties",
        source: "Xin 2016, Segerstolpe 2016",
        badge: "Top of 17 methods",
        href: "/highlights/index.html#c6",
        chart: { title: "Macro F1 vs published methods", note: "", min: 0.5, highlightFirst: true, bars: [{ label: "p2single", value: "1.000" }, { label: "scGenoByte", value: "0.999" }, { label: "scRGCL", value: "0.994" }, { label: "CIForm", value: "0.991" }, { label: "scGPT", value: "0.980" }, { label: "SingleR", value: "0.952" }, { label: "scBERT", value: "0.793" }, { label: "Seurat", value: "0.594" }] },
      },
      {
        featured: true,
        tag: "Immunotherapy · skin cancer",
        title: "Exhausted vs active killer T cells in patients on immunotherapy",
        metric: "AUC 0.978",
        metricLabel: "on patients the model never saw",
        source: "Yost et al. 2019",
        badge: "Unseen patients",
        href: "/highlights/s/s1/index.html#summary",
        chart: { title: "AUC on 2,326 held-out test cells", note: "2,279 exhausted and 47 active T cells, from patients kept out of training. 0.5 = chance, 1 = perfect.", min: 0, highlightFirst: true, bars: [{ label: "p2single", value: "0.978" }, { label: "chance", value: "0.500" }] },
      },
      {
        featured: false,
        tag: "Lung cancer · PD-L1",
        title: "PD-L1 levels in lung tumour immune cells of a new patient",
        metric: "r = 0.64",
        metricLabel: "vs 0.59 median of 9 published methods",
        source: "Leader et al. 2021",
        badge: "",
        href: "/highlights/index.html#c2",
        chart: { title: "Pearson r, PD-L1 level", note: "", min: 0, highlightFirst: true, bars: [{ label: "p2single", value: "0.64" }, { label: "published median", value: "0.59" }] },
      },
      {
        featured: false,
        tag: "Bone marrow · surface protein",
        title: "Protein-defined cell types predicted from RNA",
        metric: "AUC 0.968",
        metricLabel: "average across 11 cell types",
        source: "Stuart et al. 2019",
        badge: "",
        href: "/highlights/s/s3/index.html#runs",
        chart: { title: "AUC, top 3 of 11 cell types", note: "", min: 0.9, highlightFirst: false, bars: [{ label: "CD14 monocyte", value: "1.000" }, { label: "CD16 monocyte", value: "0.997" }, { label: "naive B", value: "0.992" }] },
      },
      {
        featured: false,
        tag: "CRISPR screen · PD-L1",
        title: "PD-L1 protein predicted from RNA on a separate experiment",
        metric: "r = 0.74",
        metricLabel: "vs 0.40 from PD-L1's own RNA alone",
        source: "Papalexi et al. 2021",
        badge: "",
        href: "/highlights/s/s4/index.html#regr",
        chart: { title: "Pearson r, PD-L1 protein", note: "", min: 0, highlightFirst: true, bars: [{ label: "p2single", value: "0.74" }, { label: "PD-L1 RNA alone", value: "0.40" }] },
      },
      {
        featured: false,
        tag: "Human Cell Atlas",
        title: "Cell types predicted across tissues and donors",
        metric: "AUC 0.88",
        metricLabel: "trained on artery, tested on uterus",
        source: "Zhao 2025, Ulrich 2024",
        badge: "",
        href: "/highlights/index.html#c5",
        chart: { title: "AUC across tissues", note: "", min: 0.5, highlightFirst: false, bars: [{ label: "artery → uterus", value: "0.88" }, { label: "uterus → artery", value: "0.86" }] },
      },
      {
        featured: false,
        tag: "Brain · across species",
        title: "Brain cell types predicted across species",
        metric: "AUC 0.932",
        metricLabel: "trained on human, tested on mouse",
        source: "Allen Brain Atlas",
        badge: "",
        href: "/highlights/index.html#c7",
        chart: { title: "Median AUC per transfer", note: "", min: 0.5, highlightFirst: false, bars: [{ label: "human → humans", value: "0.972" }, { label: "between macaques", value: "0.950" }, { label: "human → mouse", value: "0.932" }] },
      },
      {
        featured: false,
        tag: "CRISPR · gene response",
        title: "How cells respond when 2 genes are changed at once",
        metric: "0.890",
        metricLabel: "vs 0.790 best published method",
        source: "Norman 2019",
        badge: "",
        href: "/highlights/index.html#c8",
        chart: { title: "Cosine similarity, PerturBench", note: "", min: 0.3, highlightFirst: true, bars: [{ label: "p2single", value: "0.890" }, { label: "latent additive", value: "0.790" }, { label: "CPA", value: "0.760" }] },
      },
    ],
  },

  // ===========================================================================
  // LEADERSHIP SECTION
  // ===========================================================================
  leadership: {
    title: "Leadership",
    subtitle: "",
    team: [
      {
        initials: "JS",
        name: "Julia Salzman",
        title: "Founder",
        description: `Associate Professor in the Department of Biomedical Data Science, and by courtesy in Biology and Statistics at Stanford University. A.B. in Mathematics from Princeton University magna cum laude and Ph.D. from Stanford University in Statistics. Developed statistical algorithms that discovered circular RNA and statistics-first genomic algorithms. Research funded by NIH, NSF, CZI. Recognized with Alfred P. Sloan Fellowship, McCormick-Gabilan Fellowship, and NSF CAREER Award.`,
      },
      {
        initials: "MR",
        name: "Michael Rabson",
        title: "Co-Founder & CEO",
        description: `More than 25 years of experience in life sciences. Former partner at Wilson Sonsini Goodrich & Rosati for 15 years. Served as General Counsel of Maxygen (MAXY) and Cytokinetics (CYTK). Former patent examiner at USPTO focused on biotechnology. Member of the patent bar. Author of scientific publications in Science, Nature, PNAS. Ph.D. from Yale University and J.D. from Yale Law School.`,
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
      { href: "#demo", label: "Single Cell Demo" },
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