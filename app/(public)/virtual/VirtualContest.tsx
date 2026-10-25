"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw, Square } from "lucide-react";
import type { Contest } from "@/lib/contestService";
import { formatDate } from "@/lib/contestService";

const SESSIONS_KEY = "cr-virtual:v1";
const SESSIONS_EVENT = "cr-virtual-updated";

interface Session {
  id: string;
  contestId: number;
  name: string;
  durationMinutes: number;
  completedAt: number;
}

function getSessionsSnapshot(): string {
  try {
    return window.localStorage.getItem(SESSIONS_KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribeSessions(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(SESSIONS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SESSIONS_EVENT, callback);
  };
}

function parseSessions(raw: string): Session[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Session[]) : [];
  } catch {
    return [];
  }
}

function formatClock(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export default function VirtualContest({
  contests,
  timeZone,
}: {
  contests: Contest[];
  timeZone: string;
}) {
  const [selectedId, setSelectedId] = useState(String(contests[0]?.id ?? ""));
  const [duration, setDuration] = useState(contests[0]?.duration ?? 120);
  const [phase, setPhase] = useState<"idle" | "running" | "paused" | "done">("idle");
  const [secondsLeft, setSecondsLeft] = useState((contests[0]?.duration ?? 120) * 60);
  const deadlineRef = useRef(0);
  const rawSessions = useSyncExternalStore(subscribeSessions, getSessionsSnapshot, () => "");
  const sessions = useMemo(() => parseSessions(rawSessions), [rawSessions]);

  const contest = contests.find((item) => String(item.id) === selectedId) ?? contests[0];

  useEffect(() => {
    if (phase !== "running") return;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const start = () => {
    const total = Math.max(1, duration) * 60;
    setSecondsLeft(total);
    deadlineRef.current = Date.now() + total * 1000;
    setPhase("running");
  };

  const resume = () => {
    deadlineRef.current = Date.now() + secondsLeft * 1000;
    setPhase("running");
  };

  const finish = () => {
    if (!contest) return;
    const session: Session = {
      id: `${contest.id}-${Date.now()}`,
      contestId: Number(contest.id),
      name: contest.name,
      durationMinutes: duration,
      completedAt: Date.now(),
    };
    try {
      const next = [session, ...sessions].slice(0, 8);
      window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(SESSIONS_EVENT));
    } catch {
      // Storage can be unavailable; the timer still works.
    }
    setPhase("done");
  };

  const reset = () => {
    setPhase("idle");
    setSecondsLeft(duration * 60);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="panel p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
            <div>
              <label htmlFor="virtual-contest" className="eyebrow">
                Past contest
              </label>
              <select
                id="virtual-contest"
                value={selectedId}
                onChange={(event) => {
                  const next = contests.find((item) => String(item.id) === event.target.value);
                  setSelectedId(event.target.value);
                  setPhase("idle");
                  if (next) {
                    setDuration(next.duration);
                    setSecondsLeft(next.duration * 60);
                  }
                }}
                className="field mt-2 h-10"
              >
                {contests.map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.name} · {formatDate(item.startTime, timeZone)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="virtual-duration" className="eyebrow">
                Minutes
              </label>
              <input
                id="virtual-duration"
                type="number"
                min={5}
                max={300}
                value={duration}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setDuration(value);
                  if (phase === "idle") setSecondsLeft(Math.max(1, value) * 60);
                }}
                className="field mt-2 h-10"
              />
            </div>
          </div>

          {contest && (
            <div className="mt-5 border-t border-line pt-4">
              <p className="eyebrow">Selected</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">{contest.name}</h2>
              <p className="mt-1 text-xs text-muted">
                {contest.type} · originally {contest.duration} minutes
              </p>
            </div>
          )}
        </div>

        <div className="panel p-6 text-center sm:p-8">
          <p className="eyebrow">{phase === "done" ? "Session complete" : "Virtual timer"}</p>
          <p className="mono mt-3 text-5xl font-medium tabular-nums tracking-tight text-signal sm:text-6xl">
            {formatClock(secondsLeft)}
          </p>
          <p className="mt-2 text-xs text-muted">
            Solve on the original contest page. This timer does not judge submissions.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {phase === "idle" && (
              <button type="button" onClick={start} className="btn btn-signal">
                <Play className="h-4 w-4" aria-hidden="true" />
                Start
              </button>
            )}
            {phase === "running" && (
              <button type="button" onClick={() => setPhase("paused")} className="btn btn-outline">
                <Pause className="h-4 w-4" aria-hidden="true" />
                Pause
              </button>
            )}
            {phase === "paused" && (
              <button type="button" onClick={resume} className="btn btn-signal">
                <Play className="h-4 w-4" aria-hidden="true" />
                Resume
              </button>
            )}
            {(phase === "running" || phase === "paused") && (
              <button type="button" onClick={finish} className="btn btn-outline">
                <Square className="h-4 w-4" aria-hidden="true" />
                Finish
              </button>
            )}
            {phase === "done" && (
              <button type="button" onClick={reset} className="btn btn-signal">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                New session
              </button>
            )}
            {contest && (
              <a
                href={contest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Open problems
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>

      <aside className="panel h-fit p-5">
        <p className="eyebrow">Recent sessions</p>
        {sessions.length > 0 ? (
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {sessions.map((session) => (
              <li key={session.id} className="py-3">
                <p className="truncate text-[13px] font-medium">{session.name}</p>
                <p className="mono mt-0.5 text-[10px] uppercase tracking-wider text-muted">
                  {session.durationMinutes} min ·{" "}
                  {new Date(session.completedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Finished sessions are stored on this device. Start one to build a history.
          </p>
        )}
      </aside>
    </div>
  );
}
