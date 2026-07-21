import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Radley Ciego — Geospatial Data Engineer & Infrastructure Resilience Consultant",
  description:
    "I build fault-tolerant data pipelines that transform raw geospatial data into actionable infrastructure resilience insights.",
  openGraph: {
    title: "Radley Ciego — Geospatial Data Engineer & Infrastructure Resilience Consultant",
    description:
      "I build fault-tolerant data pipelines that transform raw geospatial data into actionable infrastructure resilience insights.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-4">
                  Let&apos;s Talk
                </p>
                <a
                  href="mailto:radleykc@gmail.com"
                  className="font-mono text-sm text-foreground transition-colors hover:text-primary"
                >
                  radleykc@gmail.com
                </a>
              </div>
              <div className="flex gap-8 font-mono text-[11px] uppercase tracking-[0.18em]">
                <a
                  href="https://www.linkedin.com/in/radleykc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  LinkedIn
                </a>
                <a
                  href="https://substack.com/@radleyciego"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Substack
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
