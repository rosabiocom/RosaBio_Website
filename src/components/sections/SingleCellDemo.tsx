"use client";

import { Section } from "@/components/ui/Section";
import { ArrowUpRight, Microscope } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { cn } from "@/lib/utils";

type Panel = (typeof siteContent.singleCellDemo.panels)[number];

function ArrowCircle({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-medium text-slate-lighter transition-colors duration-200",
        "group-hover:border-electric-blue group-hover:bg-electric-blue group-hover:text-white",
        className
      )}
    >
      <ArrowUpRight className="h-4 w-4" />
    </span>
  );
}

function Chart({ chart, badge, large }: { chart: Panel["chart"]; badge: string; large: boolean }) {
  return (
    <div className={cn("flex grow flex-col justify-center gap-2 rounded-xl bg-navy-darkest", large ? "p-6 md:p-7" : "p-5")}>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-lighter">{chart.title}</span>
        {badge && (
          <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
            {badge}
          </span>
        )}
      </div>
      {chart.bars.map((bar, i) => {
        const hi = !chart.highlightFirst || i === 0;
        const strong = chart.highlightFirst && i === 0;
        const width = Math.max(0, ((Number(bar.value) - chart.min) / (1 - chart.min)) * 100);
        return (
          <div
            key={bar.label}
            className={cn(
              "grid items-center gap-3 text-xs md:text-[13px]",
              large ? "grid-cols-[112px_minmax(0,1fr)_44px]" : "grid-cols-[124px_minmax(0,1fr)_40px]"
            )}
          >
            <span className={cn("truncate", strong ? "font-semibold text-white" : "text-slate-lighter")}>
              {bar.label}
            </span>
            <span className={cn("overflow-hidden rounded-full bg-navy-medium", large && chart.bars.length < 4 ? "h-3" : "h-2")}>
              <span
                className={cn("block h-full rounded-full", hi ? "bg-electric-blue" : "bg-slate-medium")}
                style={{ width: `${width}%` }}
              />
            </span>
            <span
              className={cn(
                "text-right tabular-nums",
                strong ? "font-semibold text-white" : "text-slate-lighter"
              )}
            >
              {bar.value}
            </span>
          </div>
        );
      })}
      {chart.note && <p className="mt-3 text-sm leading-relaxed text-slate-lighter">{chart.note}</p>}
    </div>
  );
}

function DemoCard({ panel }: { panel: Panel }) {
  const large = panel.featured;
  return (
    <a
      href={panel.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-col rounded-2xl border border-slate-dark/50 bg-navy-medium/40 transition-all duration-200",
        "hover:-translate-y-1 hover:border-electric-blue/40 hover:bg-navy-medium/70 hover:shadow-lg hover:shadow-electric-blue/10",
        large ? "gap-6 p-5 md:p-6" : "gap-5 p-4 md:p-5"
      )}
    >
      <div className="flex grow flex-col">
        <Chart chart={panel.chart} badge={panel.badge} large={large} />
      </div>
      <div className={cn("flex flex-col", large ? "gap-3 px-2 pb-2" : "grow gap-2.5 px-1.5 pb-1.5")}>
        <span className="self-start rounded-full bg-electric-blue/15 px-2.5 py-1 text-xs text-electric-blue-light">
          {panel.tag}
        </span>
        <h3
          className={cn(
            "font-normal tracking-tight text-white",
            large ? "text-2xl leading-snug md:text-[28px]" : "text-xl leading-snug"
          )}
        >
          {panel.title}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-4 pt-2">
          <div className="flex flex-col gap-1">
            <span
              className={cn(
                "tracking-tight text-electric-blue",
                large ? "text-4xl md:text-[40px]" : "text-3xl"
              )}
            >
              {panel.metric}
            </span>
            <span className={cn("text-slate-lighter", large ? "text-[15px]" : "text-sm")}>
              {panel.metricLabel} · {panel.source}
            </span>
          </div>
          <ArrowCircle />
        </div>
      </div>
    </a>
  );
}

export function SingleCellDemo() {
  const { label, title, description, src, openLabel, stats, panels } =
    siteContent.singleCellDemo;
  const featured = panels.filter((p) => p.featured);
  const rest = panels.filter((p) => !p.featured);

  return (
    <Section id="demo" className="bg-navy-dark">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-3xl flex-col gap-6">
          <div className="flex items-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-light text-slate-lighter">
              <Microscope className="h-4 w-4" />
            </span>
            <span className="flex h-8 items-center rounded-full border border-slate-light px-4 text-sm text-slate-lighter">
              {label}
            </span>
          </div>
          <h2 className="text-5xl font-normal tracking-tight text-white md:text-6xl">{title}</h2>
          <p className="text-lg leading-relaxed text-slate-lighter md:text-xl">{description}</p>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center self-start md:self-auto"
        >
          <span className="flex h-12 items-center rounded-full bg-electric-blue px-6 font-medium text-white transition-[padding] duration-[1200ms] ease-[cubic-bezier(0.175,1.4,0.32,1)] group-hover:pr-[72px]">
            {openLabel}
          </span>
          {/* On hover the circle slides into the pill and the arrow turns from ↗ to →.
              pr-[72px] = px-6 + the circle's 48px, so the button keeps its width */}
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-electric-blue text-electric-blue-light transition-[margin,background-color,color] duration-[1200ms] ease-[cubic-bezier(0.175,1.4,0.32,1)] group-hover:-ml-12 group-hover:bg-electric-blue group-hover:text-white">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-[1200ms] ease-[cubic-bezier(0.175,1.4,0.32,1)] group-hover:rotate-45" />
          </span>
        </a>
      </div>

      <div className="mt-12 grid grid-cols-2 border-y border-slate-dark/70 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-2.5 py-6 pr-4">
            <span className="whitespace-nowrap text-2xl tracking-tight text-white md:text-3xl">{stat.value}</span>
            <span className="text-sm text-slate-lighter">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {featured.map((panel) => (
          <DemoCard key={panel.href} panel={panel} />
        ))}
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((panel) => (
          <DemoCard key={panel.href} panel={panel} />
        ))}
      </div>
    </Section>
  );
}
