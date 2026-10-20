"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, CalendarDays, LayoutDashboard } from "lucide-react";

const ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/contests", label: "Schedule", icon: CalendarDays },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/practice", label: "Practice", icon: BookOpen },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="app-mobile-nav fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile primary"
    >
      <div className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-signal" : "text-muted"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
