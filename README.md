# RosaBio Website

Official website for RosaBio, Inc.

**Smarter. Better. Faster.**
A new paradigm for analysis of nucleic acid sequence information.

## About

RosaBio's **Semore Platform** is a statistics-first genomic analysis platform that detects complexity missed by other methods.

### The Semore Platform

- **Statistics-First Approach**: ROSA's Semore platform allows detection of genomic complexity missed by other methods
- **Faster, Cheaper, Smarter**: Enables efficient genomics analysis with computationally light processing
- **Readily Scalable**: From single samples to population-scale studies
- **Nucleic Acid Agnostic**: Works with DNA (WGS and targeted), RNA, short and long read, exome, non-coding regions, ctDNA, bisulfite, and more
- **Structure-Based Detection**: Detects structure-based changes, not limited by gene panels
- **Flexible Sample Types**: Tissue samples or liquid biopsy (plasma cfDNA)
- **AI-Ready Output**: Semore software output enables seamless ML pipeline integration

### Applications

- **Diagnostics (Dx)**: Disease detection and classification
- **Therapeutics (Tx)**: Patient stratification and MRD tracking
- **Research**: Drug discovery and genomic studies

## Repository Structure

```
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   │   ├── layout/       # Header, Footer, Navbar
│   │   ├── sections/     # Hero, Technology, Applications, etc.
│   │   └── ui/           # Reusable UI components
│   └── lib/              # Utilities
├── public/
│   ├── documents/        # PDF resources for Technology section
│   └── pdf.worker.min.js # PDF.js worker
├── docs/                 # Reference documents (bios, content sources)
└── ...config files
```

## Tech Stack

- **Framework**: Next.js 14.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **PDF Viewer**: react-pdf 7.7
- **Icons**: Lucide React

## Development

### Prerequisites
- Node.js 18+
- npm

### Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm run start
```

## Deployment

Deployed on [Vercel](https://vercel.com).

## License

Proprietary - RosaBio, Inc. All rights reserved.
