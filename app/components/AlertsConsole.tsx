"use client";

import { useState } from "react";
import { ArrowUpRight, CalendarDays, Mail, Send } from "lucide-react";
import { PLATFORM_META, type PlatformKey } from "@/lib/contestService";
import EmailAlertForm from "./EmailAlertForm";

type Channel = "telegram" | "email" | "calendar";

const CHANNELS: Array<{
  id: Channel;
  label: string;
  description: string;
  icon: typeof Send;
}> = [
  {
    id: "telegram",
    label: "Telegram",
    description: "Chat commands and reminders",
    icon: Send,
  },
  {
    id: "email",
    label: "Email",
    description: "Double opt-in reminders",
    icon: Mail,
  },
  {
    id: "calendar",
    label: "Calendar",
    description: "Subscribe once, stay current",
    icon: CalendarDays,
  },
];

const COMMANDS = [
  { command: "/upcoming", description: "Next five contests" },
  { command: "/platforms", description: "Counts and next round per platform" },
  { command: "/subscribe", description: "Enable reminders" },
  { command: "/status", description: "Show your settings" },
  { command: "/unsubscribe", description: "Disable reminders" },
];

export default function AlertsConsole({ botUsername }: { botUsername?: string }) {
  const [channel, setChannel] = useState<Channel>("telegram");

  return (
    <div className="grid gap-4 lg:grid-cols-[250px_1fr]">
      <div className="grid grid-cols-3 gap-1.5 lg:block lg:space-y-1.5" role="tablist" aria-label="Alert channels">
        {CHANNELS.map((item) => {
          const Icon = item.icon;
          const active = channel === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`channel-${item.id}`}
              onClick={() => setChannel(item.id)}
              className={`flex flex-col items-start gap-2 rounded-lg border px-3 py-3 text-left transition-colors lg:flex-row lg:items-center ${
                active
                  ? "border-ink/25 bg-panel text-ink"
                  : "border-transparent text-muted hover:border-line hover:bg-panel"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-[13px] font-medium leading-tight">{item.label}</span>
                <span className="mt-0.5 hidden text-[11px] leading-tight text-muted lg:block">
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="panel min-h-[420px] p-5 sm:p-7">
        {channel === "telegram" && (
          <section id="channel-telegram" role="tabpanel">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line">
                <Send className="h-4 w-4 text-signal" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Telegram bot</h2>
                <p className="mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  On-demand and scheduled
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Query contests, subscribe to reminders, and manage everything from chat.
            </p>

            <div className="mt-5 divide-y divide-line border-y border-line">
              {COMMANDS.map((item) => (
                <div key={item.command} className="flex items-center justify-between gap-3 py-2.5">
                  <code className="mono text-[11px] font-medium text-ink">{item.command}</code>
                  <span className="text-right text-[11px] text-muted">{item.description}</span>
                </div>
              ))}
            </div>

            {botUsername ? (
              <a
                href={`https://t.me/${botUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-signal mt-6"
              >
                Open @{botUsername}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              <p className="mt-6 text-xs text-muted">
                Telegram invite is not published yet. Calendar feeds are available now.
              </p>
            )}
          </section>
        )}

        {channel === "email" && (
          <section id="channel-email" role="tabpanel">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line">
                <Mail className="h-4 w-4 text-signal" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Email alerts</h2>
                <p className="mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Double opt-in
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Pick platforms and lead time. Confirm once, then reminders arrive by email.
            </p>
            <EmailAlertForm />
          </section>
        )}

        {channel === "calendar" && (
          <section id="channel-calendar" role="tabpanel">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line">
                  <CalendarDays className="h-4 w-4 text-signal" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Calendar feeds</h2>
                  <p className="mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    Subscribe once
                  </p>
                </div>
              </div>
              <a href="/api/calendar.ics" className="btn btn-outline btn-sm">
                All platforms
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Add a live feed to Google Calendar, Apple Calendar, or Outlook. New rounds appear
              automatically after each source refresh.
            </p>

            <div className="mt-5 divide-y divide-line border-y border-line">
              {(Object.keys(PLATFORM_META) as PlatformKey[]).map((key) => (
                <a
                  key={key}
                  href={`/api/calendar.ics?platform=${key}`}
                  data-platform={key}
                  className="flex items-center justify-between gap-3 py-3 text-[13px] transition-colors hover:text-signal"
                >
                  <span className="flex items-center gap-2">
                    <span className="platform-dot" aria-hidden="true" />
                    {PLATFORM_META[key].name}
                  </span>
                  <span className="mono text-[10px] uppercase tracking-wider text-muted">
                    .ics feed
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
