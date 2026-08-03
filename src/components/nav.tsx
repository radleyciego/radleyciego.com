"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/about#contact", label: "Contact" },
];

function linkClassName(pathname: string, href: string) {
  const active =
    href === "/"
      ? pathname === "/"
      : href === "/about"
        ? pathname === "/about"
        : false;
  return `transition-colors ${
    active ? "text-primary" : "text-foreground hover:text-primary"
  }`;
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
    }
  }, [open]);

  return (
    <header>
      <nav className="container-site py-4" aria-label="Site">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-heading text-sm font-bold text-foreground transition-colors hover:text-primary lg:text-[22px]"
          >
            Radley Ciego
          </Link>

          <div className="hidden items-center gap-8 font-mono text-[12px] md:flex lg:gap-10 lg:text-[15px]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClassName(pathname, link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            ref={buttonRef}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div id="mobile-menu" ref={menuRef} className="md:hidden">
            <div className="mt-4 flex flex-col border-t border-border font-mono text-[15px]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className={`${linkClassName(pathname, link.href)} py-3`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
