import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "About | Radley Ciego",
  description:
    "Geospatial data engineer from the Bronx working at the intersection of spatial data systems, infrastructure resilience, and public institutions.",
};

export default function About() {
  return (
    <div className="container-site py-20">
      <section className="grid items-start gap-12 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h1 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl mb-10">
            About
          </h1>

          <div className="space-y-6 max-w-[38rem]">
            <p className="font-mono text-lg leading-[1.6] text-foreground md:text-xl md:leading-[1.55]">
              I am a research geospatial data engineer from the Bronx working
              across spatial data systems, infrastructure resilience, climate
              risk, and applied geographic research.
            </p>
            <p className="font-mono text-lg leading-[1.6] text-foreground md:text-xl md:leading-[1.55]">
              My career began in neighborhood economic development at the Long
              Island City Partnership, where I worked with small businesses,
              property owners, and real estate stakeholders in the Sunnyside
              Industrial Business Zone. I later moved into authoritative
              mapping at the Office of the Bronx Borough President and the NYC
              Department of City Planning.
            </p>
            <p className="font-mono text-lg leading-[1.6] text-foreground md:text-xl md:leading-[1.55]">
              Today, I work at Oak Ridge National Laboratory, where I develop
              geospatial data pipelines and research methods for infrastructure
              resilience, evacuation modeling, and national-scale critical
              infrastructure analysis. I speak Arabic and Spanish, and bring an
              international perspective shaped by travel and study in Morocco
              and Jordan.
            </p>
            <p className="font-mono text-lg leading-[1.6] text-foreground md:text-xl md:leading-[1.55]">
              I work with public agencies, utilities, infrastructure
              organizations, and research teams that need to turn fragmented
              spatial data into reliable decision systems.
            </p>
          </div>

          <div className="mt-8">
            <a
              href="/documents/radley-ciego-cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              title="CV"
              className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              CV
            </a>
          </div>
        </div>

        <div className="lg:pt-24">
          <Image
            src="/images/radley-ciego-portrait.jpg"
            alt="Portrait of Radley Ciego"
            width={1100}
            height={1650}
            sizes="(min-width: 1024px) 33vw, 92vw"
            className="h-auto w-full"
          />
        </div>
      </section>

      <section className="mt-24">
        <h2 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl mb-6">
          Contact
        </h2>
        <ContactForm />
      </section>
    </div>
  );
}
