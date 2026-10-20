import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PLATFORM_META, type PlatformKey } from "@/lib/contestService";

const PRODUCT = [
  { href: "/contests", label: "All contests" },
  { href: "/alerts", label: "Alerts" },
  { href: "/practice", label: "Practice" },
  { href: "/support", label: "Support" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-line">
      <div className="shell py-14 pb-24 lg:pb-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.22em] text-muted">ContestRadar</p>
            <p className="display mt-4 max-w-md text-4xl font-bold leading-[0.95] tracking-tight">
              Never miss the <span className="serif-accent text-signal">next round</span>.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              A free, multi-platform contest radar for competitive programmers. No paywalls,
              no sponsored rankings, no noise.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_10px_var(--signal)]" />
              <span className="mono text-[10px] uppercase tracking-wider text-muted">
                Free forever · {new Date().getFullYear()}
              </span>
            </div>
          </div>

          <div>
            <h2 className="eyebrow">Product</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PRODUCT.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow">Platforms</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {(Object.keys(PLATFORM_META) as PlatformKey[]).map((key) => (
                <li key={key}>
                  <Link
                    href={`/contests?platform=${key}`}
                    className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
                  >
                    <span className="platform-dot" data-platform={key} />
                    {PLATFORM_META[key].name}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href="https://github.com/subhajitlucky/contest_radar"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-foreground"
            >
              Source on GitHub
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line/70 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Built for competitive programmers. Data from official and normalized platform APIs.</p>
          <p className="mono text-[10px] uppercase tracking-wider">Signal over noise</p>
        </div>
      </div>
    </footer>
  );
}
