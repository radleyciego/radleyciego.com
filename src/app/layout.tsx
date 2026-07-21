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
      </body>
    </html>
  );
}
