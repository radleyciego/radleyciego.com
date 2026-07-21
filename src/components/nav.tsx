"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
];

export function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary"
        >
          Radley Ciego
        </Link>
        <div className="hidden items-center gap-8 font-mono text-[12px] uppercase tracking-[0.18em] sm:flex">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`transition-colors ${
                isActive(tab.href)
                  ? "text-foreground"
                  : "border border-border bg-background px-4 py-2 text-foreground transition-colors hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
