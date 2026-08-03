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
              I&apos;m a research and development geospatial data engineer from
              the Bronx, currently at Oak Ridge National Laboratory, where I
              work on infrastructure resilience, evacuation modeling, and
              applied geographic research.
            </p>
            <p className="font-mono text-lg leading-[1.6] text-foreground md:text-xl md:leading-[1.55]">
              My path here ran through neighborhood economic development and
              authoritative city mapping at the Office of the Bronx Borough
              President and the NYC Department of City Planning. That work
              shaped how I think about turning fragmented spatial data into
              decisions people can act on. I hold an MS in Geoinformatics,
              speak Arabic and Spanish, and bring an international perspective
              shaped by time in Morocco and Jordan.
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

      <section className="mt-12 md:mt-16">
        <h2 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl mb-6">
          Focus Areas
        </h2>
        <ul className="max-w-[38rem] space-y-2 font-mono text-lg leading-[1.6] text-foreground md:text-xl md:leading-[1.55]">
          <li>Geospatial Systems Architecture</li>
          <li>Geospatial Data Pipelines</li>
          <li>Infrastructure Resilience Modeling</li>
          <li>Evacuation and Emergency Response Modeling</li>
          <li>Critical Infrastructure Analysis</li>
          <li>Climate Risk and Hazard Data</li>
          <li>Authoritative and Municipal Mapping</li>
        </ul>
      </section>

      <section id="contact" className="mt-16 md:mt-20">
        <h2 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl mb-6">
          Contact
        </h2>
        <ContactForm />
      </section>
    </div>
  );
}
