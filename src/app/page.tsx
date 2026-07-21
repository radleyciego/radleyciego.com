"use client";

// ──────────────────────────────────────────────────────────────────────────────
// APPROVED — Do NOT modify any visual/rendering values in this file.
// See docs/globe-implementation.md for the authoritative reference.
// ──────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

import HeroGlobeLoader from "@/components/hero-globe-loader";
import { DubaiMap } from "@/components/dubai-map";


const skills = [
  "PREFECT",
  "AIRFLOW",
  "POSTGIS",
  "DUCKDB",
  "GEOPARQUET",
  "POLARS",
  "GEOPANDAS",
  "AWS S3",
  "DOCKER",
  "KUBERNETES",
  "PYTHON",
  "SQL",
  "BASH",
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#020306",
          backgroundImage:
            "linear-gradient(rgba(43,59,91,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(43,59,91,0.12) 1px, transparent 1px), radial-gradient(ellipse 72% 78% at 12% 40%, rgba(18,39,92,0.34) 0%, rgba(12,28,69,0.22) 35%, rgba(7,16,39,0.08) 62%, transparent 82%), radial-gradient(ellipse 58% 62% at 46% 48%, rgba(12,28,66,0.12) 0%, transparent 72%)",
          backgroundSize: "48px 48px, 48px 48px, auto, auto",
          backgroundPosition: "0 0, 0 0, center, center",
        }}
      >

        <div className="relative mx-auto flex w-full flex-col items-center pt-10 text-center sm:px-10 sm:pt-14">
          <div className="max-w-4xl">
            {/* Status bar */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block size-2 bg-emerald-500" />
                Open to Consulting
              </span>
              <span className="text-border">|</span>
              <span>New York · 40°42&apos;N 74°00&apos;W</span>
            </div>

            {/* Tagline */}
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              [ Geospatial Data Engineering · Infrastructure Resilience ·
              Regional Market Access ]
            </p>

            {/* Name */}
            <h1 className="font-heading text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              Radley Ciego
            </h1>

            {/* Bio */}
            <p className="mt-8 max-w-2xl mx-auto font-mono text-base leading-7 text-foreground">
              I architect fault-tolerant data pipelines and the research
              analysis behind them, turning raw geospatial data into actionable
              infrastructure resilience insight, from government shapefiles to
              published federal datasets. I currently work at{" "}
              <span className="text-primary">
                Oak Ridge National Laboratory
              </span>
              . Previously, I helped maintain the official maps of{" "}
              <span className="text-primary">New York City</span>.
            </p>

            {/* CTA */}
            <div className="mt-6 flex w-full flex-col gap-3 sm:inline-flex sm:w-fit sm:flex-row sm:items-center">
              <Link
                href="#services"
                className="group inline-flex w-full items-center justify-center gap-3 bg-gradient-to-br from-primary to-primary/80 px-7 py-4 font-mono text-[12px] uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:from-primary/90 hover:to-primary/70 sm:w-auto sm:justify-start"
              >
                View Services
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
              </Link>
              <Link
                href="#projects"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                or see recent work →
              </Link>
            </div>
          </div>
        </div>

        {/* 3D Globe visualization */}
        <div className="h-[60vh] lg:h-[70vh] w-full overflow-hidden relative mt-4">
          <HeroGlobeLoader />
        </div>
      </section>

      {/* Skills ticker */}
      <div className="relative border-y border-border bg-background">
        <div className="mx-auto max-w-6xl overflow-hidden">
          <div className="ticker-track whitespace-nowrap py-4">
            {[...skills, ...skills].map((skill, i) => (
              <span
                key={`${skill}-${i}`}
                className="inline-flex items-center gap-6 px-6 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
              >
                {skill}
                <span className="text-primary">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          [ What I Do ]
        </p>
        <h2 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl mb-16">
          Services
        </h2>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="border border-border p-6 sm:p-8">
            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.08em] mb-3">
              Infrastructure Resilience Assessment
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Quantitative risk scoring for critical infrastructure against
              climate, seismic, and operational stress scenarios.
            </p>
          </div>
          <div className="border border-border p-6 sm:p-8">
            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.08em] mb-3">
              Custom Geospatial Data Pipelines
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              End-to-end ETL/ELT design — from raw source ingestion through
              schema validation to analytics-ready storage.
            </p>
          </div>
          <div className="border border-border p-6 sm:p-8">
            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.08em] mb-3">
              GIS Modernization &amp; Data Governance
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Migration from legacy desktop GIS to cloud-native spatial data
              infrastructure with versioned schemas.
            </p>
          </div>
          <div className="border border-border p-6 sm:p-8">
            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.08em] mb-3">
              Regional Infrastructure Market Analysis
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Working proficiency in Arabic and Spanish supports source review
              and stakeholder engagement in MENA and Latin American
              infrastructure markets underserved by English-language analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Projects section */}
      <section id="projects" className="mx-auto max-w-6xl px-6 py-20 sm:px-10 border-t border-border">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          [ Selected Projects ]
        </p>
        <h2 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl mb-16">
          Projects
        </h2>

        {/* Project card */}
        <article className="border border-border">
          <div className="grid sm:grid-cols-[1fr_1fr]">
            {/* Text side */}
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

                {/* Data foundation */}
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
                href="mailto:radleykc@gmail.com"
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

            {/* Visual side — live Dubai map */}
            <div className="relative border-t sm:border-t-0 sm:border-l border-border bg-card min-h-[300px]">
              <DubaiMap />
              <span className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest border border-muted-foreground/30 text-muted-foreground px-3 py-1 z-10">
                In Development
              </span>
            </div>
          </div>
        </article>

        {/* Placeholder for future projects */}
        <div className="border border-dashed border-border mt-8 p-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            More projects coming soon
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Geospatial data pipeline work, additional case studies in development
          </p>
        </div>
      </section>
    </>
  );
}
