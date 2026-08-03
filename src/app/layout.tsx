import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { SocialIconLinks } from "@/components/social-icons";

export const metadata: Metadata = {
  metadataBase: new URL("https://radleyciego.com"),
  title: "Radley Ciego — Geospatial Data Engineer & Infrastructure Resilience Consultant",
  description:
    "I build fault-tolerant data pipelines that transform raw geospatial data into actionable infrastructure resilience insights.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Radley Ciego — Geospatial Data Engineer & Infrastructure Resilience Consultant",
    description:
      "I build fault-tolerant data pipelines that transform raw geospatial data into actionable infrastructure resilience insights.",
    type: "website",
    url: "/",
    siteName: "Radley Ciego",
    images: [
      {
        url: "/images/radley-ciego-og.png",
        width: 1200,
        height: 630,
        alt: "Radley Ciego",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Radley Ciego — Geospatial Data Engineer & Infrastructure Resilience Consultant",
    description:
      "I build fault-tolerant data pipelines that transform raw geospatial data into actionable infrastructure resilience insights.",
    images: ["/images/radley-ciego-og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
          <div className="container-site py-12">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <SocialIconLinks />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
