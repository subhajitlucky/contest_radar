import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PLATFORM_META, type PlatformKey } from "@/lib/contestService";

const PRODUCT = [
  { href: "/contests", label: "All contests" },
  { href: "/alerts", label: "Alerts" },
  { href: "/virtual", label: "Virtual contest" },
  { href: "/practice", label: "Practice" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
];

const PROJECT = [
  { href: "/developers", label: "Developers" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
];

export default function Footer() {
  return (
    <footer className="app-footer mt-12 border-t border-line">
      <div className="shell py-12 pb-24 lg:pb-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <p className="text-base font-semibold tracking-tight">ContestRadar</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
              A free, multi-platform contest schedule for competitive programmers. No
              paywalls, no sponsored rankings, no noise.
            </p>
            <p className="mono mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
              Free forever · {new Date().getFullYear()}
            </p>
          </div>

          <FooterColumn title="Product" links={PRODUCT} />
          <FooterColumn title="Project" links={PROJECT} />

          <div>
            <h2 className="mono text-[11px] uppercase tracking-[0.14em] text-muted">Platforms</h2>
            <ul className="mt-3 space-y-2">
              {(Object.keys(PLATFORM_META) as PlatformKey[]).map((key) => (
                <li key={key}>
                  <Link
                    href={`/contests?platform=${key}`}
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                  >
                    <span className="platform-dot" data-platform={key} aria-hidden="true" />
                    {PLATFORM_META[key].name}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href="https://github.com/subhajitlucky/contest_radar"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-ink"
            >
              Source on GitHub
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Data from official and normalized platform APIs.</p>
          <p className="mono text-[10px] uppercase tracking-[0.14em]">Signal over noise</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h2 className="mono text-[11px] uppercase tracking-[0.14em] text-muted">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
