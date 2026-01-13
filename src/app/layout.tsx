import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RosaBio | Statistics-First Nucleic Acid Sequence Analysis",
  description:
    "The new paradigm for nucleic acid sequence analysis. Statistics-first approach with no reference genome required for unbiased discovery.",
  keywords: [
    "biotech",
    "genomics",
    "nucleic acid",
    "sequence analysis",
    "bioinformatics",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
