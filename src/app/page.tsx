"use client";

// ──────────────────────────────────────────────────────────────────────────────
// APPROVED — Do NOT modify any visual/rendering values in this file.
// See docs/globe-implementation.md for the authoritative reference.
// ──────────────────────────────────────────────────────────────────────────────

import HeroGlobeLoader from "@/components/hero-globe-loader";
import { DubaiMap } from "@/components/dubai-map";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 72% 78% at 12% 40%, rgba(154,178,216,0.28) 0%, rgba(176,194,224,0.16) 35%, rgba(205,218,236,0.08) 62%, transparent 82%), radial-gradient(ellipse 58% 62% at 46% 48%, rgba(185,200,225,0.14) 0%, transparent 72%)",
          backgroundSize: "auto, auto",
          backgroundPosition: "center, center",
        }}
      >
        <div className="container-site relative">
          <div className="relative z-10 max-w-[700px] pt-10 sm:pt-14">
            {/* Bio */}
            <p className="font-mono text-xl leading-snug text-foreground mb-5 md:text-2xl md:leading-[1.35] lg:text-[24px]">
              I build geospatial data systems that turn complex data into
              reliable infrastructure insight.
            </p>
            <p className="font-mono text-xl leading-snug text-foreground md:text-2xl md:leading-[1.35] lg:text-[24px]">
              Currently at{" "}
              <span className="text-primary">
                Oak Ridge National Laboratory
              </span>
              , previously at the NYC Department of City Planning and the
              Office of The Bronx Borough President.
            </p>
          </div>

          {/* 3D Globe visualization */}
          <div className="pt-[7.3vh] lg:pt-[8.5vh]">
            <div className="globe-stage h-[60vh] relative -mt-[11.5px] sm:mt-4 md:-mt-12 lg:h-[70vh] lg:-mt-[130px]">
              <HeroGlobeLoader />
            </div>
          </div>
        </div>
      </section>

      {/* Projects section */}
      <section id="projects" className="container-site py-20">
        <h2 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl mb-16">
          Projects
        </h2>

        {/* Project card */}
        <article className="border border-border bg-white">
          <div className="grid sm:grid-cols-[1fr_1fr]">
            {/* Text side */}
            <div className="p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-4 block">
                  01
                </span>
                <h3 className="font-heading text-xl font-bold mb-4">
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
                  <p className="font-mono text-[10px] text-primary mb-3">
                    Built on
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                    DEWA Green Charger Network · Open Charge Map · Dubai Pulse ·
                    RTA Transport Data
                  </p>
                </div>
              </div>

              <a
                href="mailto:radleykc@gmail.com"
                className="inline-flex items-center gap-2 font-mono text-[12px] text-foreground transition-colors hover:text-primary group"
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
              <span className="absolute top-4 right-4 font-mono text-[10px] border border-muted-foreground/30 text-muted-foreground px-3 py-1 z-10">
                In development
              </span>
            </div>
          </div>
        </article>

        {/* Placeholder for future projects */}
        <div className="border border-dashed border-border bg-white mt-8 p-8 text-center">
          <p className="font-mono text-[11px] text-muted-foreground">
            More projects coming soon
          </p>
        </div>
      </section>
    </>
  );
}
