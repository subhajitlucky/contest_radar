"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import TimezoneSelect from "../TimezoneSelect";

const LINKS = [
  { href: "/contests", label: "Contests" },
  { href: "/practice", label: "Practice" },
  { href: "/alerts", label: "Alerts" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/about", label: "About" },
  { href: "/developers", label: "Developers" },
];

export default function PublicHeader({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const cta = signedIn
    ? { href: "/dashboard", label: "Dashboard" }
    : { href: "/login", label: "Sign in" };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center border border-ink">
            <span className="h-1.5 w-1.5 bg-signal" />
          </span>
          <span>
            <span className="block text-[17px] font-semibold leading-none tracking-tight">
              ContestRadar
            </span>
            <span className="mono mt-1 block text-[10px] uppercase tracking-[0.16em] text-muted">
              contest intelligence
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Public">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`text-sm transition-colors ${
                isActive(link.href) ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="hidden xl:block">
            <TimezoneSelect />
          </div>
          <ThemeToggle />
          <Link href={cta.href} className="btn btn-signal btn-sm">
            {cta.label}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-panel-2 hover:text-ink"
            aria-expanded={open}
            aria-controls="public-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="public-mobile-menu" className="border-t border-line bg-background lg:hidden">
          <nav className="shell grid gap-1 py-3" aria-label="Public mobile">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-md px-3 py-2.5 text-sm ${
                  isActive(link.href)
                    ? "bg-panel-2 text-ink"
                    : "text-muted hover:bg-panel-2 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <TimezoneSelect />
            </div>
            <Link href={cta.href} onClick={() => setOpen(false)} className="btn btn-signal mt-2">
              {cta.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
