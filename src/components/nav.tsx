"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  return (
    <header>
      <nav className="container-site py-4">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <Link
            href="/"
            className="font-heading text-sm font-bold text-foreground transition-colors hover:text-primary lg:text-[22px]"
          >
            Radley Ciego
          </Link>
          <div className="flex w-full items-center justify-between gap-6 font-mono text-[12px] md:w-auto md:justify-end md:gap-8 lg:gap-10 lg:text-[15px]">
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
        </div>
      </nav>
    </header>
  );
}
