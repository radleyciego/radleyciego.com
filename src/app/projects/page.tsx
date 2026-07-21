"use client";

import dynamic from "next/dynamic";

const DubaiMap = dynamic(
  () => import("@/components/dubai-map").then((m) => ({ default: m.DubaiMap })),
  { ssr: false }
);

export default function Projects() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
        [ Selected Projects ]
      </p>
      <h1 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl mb-16">
        Projects
      </h1>

      <article className="border border-border">
        <div className="grid sm:grid-cols-[1fr_1fr]">
          <div className="p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-4 block">
                01
              </span>
              <h3 className="font-heading text-xl font-bold uppercase tracking-[0.05em] mb-4">
                Dubai EV Charging Resilience Index
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
                A neighborhood-level resilience score for Dubai&apos;s EV
                charging infrastructure, benchmarking exposure to flooding,
                land use pressure, and transport disruption. Built on
                validated public infrastructure data and a proprietary scoring
                model, developed for utilities, planning agencies, and
                infrastructure investors evaluating risk ahead of the next
                stress event.
              </p>

              <div className="border border-border bg-card p-4 mb-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary mb-3">
                  Built On
                </p>
                <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                  DEWA Green Charger Network · Open Charge Map · Dubai Pulse ·
                  RTA Transport Data
                </p>
              </div>
            </div>

            <a
              href="mailto:radley@radleyciego.com"
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary group"
            >
              Request a briefing
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="relative border-t sm:border-t-0 sm:border-l border-border bg-card min-h-[300px]">
            <DubaiMap />
            <span className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest border border-muted-foreground/30 text-muted-foreground px-3 py-1 z-10">
              In Development
            </span>
          </div>
        </div>
      </article>

      <div className="border border-dashed border-border mt-8 p-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          More projects coming soon
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Geospatial data pipeline work, additional case studies in development
        </p>
      </div>
    </div>
  );
}
