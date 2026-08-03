"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  return (
    <header>
      <nav className="container-site flex items-center justify-between py-4">
        <Link
          href="/"
          className="font-heading text-sm font-bold text-foreground transition-colors hover:text-primary lg:text-[22px]"
        >
          Radley Ciego
        </Link>
        <div className="hidden items-center gap-8 font-mono text-[12px] sm:flex lg:gap-10 lg:text-[15px]">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === "/"
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            Work
          </Link>
          <Link
            href="/about"
            className={`transition-colors ${
              pathname === "/about"
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            About
          </Link>
          <Link
            href="/about#contact"
            className="text-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
