import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RosaBio | Smarter. Better. Faster.",
  description:
    "A new paradigm for analysis of nucleic acid sequence information. Statistics-first approach for diagnostics, therapeutics, and research.",
  keywords: [
    "RosaBio",
    "biotech",
    "genomics",
    "sequence analysis",
    "Semore",
    "statistics-first",
    "nucleic acid",
    "diagnostics",
    "therapeutics",
  ],
  authors: [{ name: "RosaBio" }],
  openGraph: {
    title: "RosaBio | Smarter. Better. Faster.",
    description:
      "A new paradigm for analysis of nucleic acid sequence information.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
