import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { SocialIconLinks } from "@/components/social-icons";

export const metadata: Metadata = {
  metadataBase: new URL("https://radleyciego.com"),
  title: "Radley Ciego",
  description:
    "Research and development geospatial data engineering, infrastructure resilience, and applied geographic research.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://radleyciego.com",
    siteName: "Radley Ciego",
    title: "Radley Ciego",
    description:
      "Research and development geospatial data engineering, infrastructure resilience, and applied geographic research.",
    images: [
      {
        url: "/images/radley-ciego-og-v3.png",
        width: 1200,
        height: 630,
        alt: "Radley Ciego",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Radley Ciego",
    description:
      "Research and development geospatial data engineering, infrastructure resilience, and applied geographic research.",
    images: ["/images/radley-ciego-og-v3.png"],
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
