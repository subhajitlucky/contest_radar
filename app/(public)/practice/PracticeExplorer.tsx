"use client";

import { useState } from "react";
import { ArrowUpRight, BookOpen, Boxes, Route, Terminal } from "lucide-react";

interface Resource {
  name: string;
  url: string;
}

interface LearningPath {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  topics: string[];
}

interface TopicModule {
  id: number;
  title: string;
  description: string;
  topics: string[];
  difficulty: string;
  resources: Resource[];
}

interface PracticePlatform {
  name: string;
  description: string;
  url: string;
  level: string;
  specialties: string[];
}

type Tab = "paths" | "structures" | "algorithms" | "platforms";

const TABS: Array<{ id: Tab; label: string; icon: typeof Route }> = [
  { id: "paths", label: "Learning paths", icon: Route },
  { id: "structures", label: "Data structures", icon: Boxes },
  { id: "algorithms", label: "Algorithms", icon: Terminal },
  { id: "platforms", label: "Platforms", icon: BookOpen },
];

function difficultyClass(value: string): string {
  const normalized = value.toLowerCase();
  if (normalized.includes("hard")) return "text-[var(--signal)]";
  if (normalized.includes("medium")) return "text-[var(--cyan)]";
  return "text-[var(--muted)]";
}

export default function PracticeExplorer({
  paths,
  dataStructures,
  algorithms,
  platforms,
}: {
  paths: LearningPath[];
  dataStructures: TopicModule[];
  algorithms: TopicModule[];
  platforms: PracticePlatform[];
}) {
  const [tab, setTab] = useState<Tab>("paths");

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 border-b border-line bg-background/95 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-1 overflow-x-auto py-2" role="tablist" aria-label="Practice sections">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-[12px] font-medium transition-colors ${
                  active ? "bg-panel-2 text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-6">
        {tab === "paths" && (
          <section aria-label="Learning paths">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
              <div>
                <p className="eyebrow">Structured routes</p>
                <h2 className="display mt-2 text-2xl font-semibold tracking-tight">
                  Pick a track, not a random problem
                </h2>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-muted">
                Every track is a sequence. Move through it in order, then use the module tabs
                for topic-level resources.
              </p>
            </div>

            <div className="grid gap-3 pt-5 lg:grid-cols-3">
              {paths.map((path, index) => (
                <article key={path.id} className="panel p-5">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      0{index + 1}
                    </span>
                    <span className="chip">{path.level}</span>
                  </div>
                  <h3 className="display mt-5 text-xl font-semibold tracking-tight">{path.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{path.description}</p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {path.topics.map((topic) => (
                      <span key={topic} className="chip">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
                    <span className="mono text-[10px] uppercase tracking-wider text-muted">
                      {path.duration}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTab("structures")}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-signal"
                    >
                      Start with basics
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {(tab === "structures" || tab === "algorithms") && (
          <section aria-label={tab === "structures" ? "Data structures" : "Algorithms"}>
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
              <div>
                <p className="eyebrow">{tab === "structures" ? "Data structures" : "Algorithms"}</p>
                <h2 className="display mt-2 text-2xl font-semibold tracking-tight">
                  {tab === "structures" ? "The building blocks" : "The techniques"}
                </h2>
              </div>
              <p className="mono text-[10px] uppercase tracking-wider text-muted">
                {tab === "structures" ? dataStructures.length : algorithms.length} modules
              </p>
            </div>

            <div className="divide-y divide-line">
              {(tab === "structures" ? dataStructures : algorithms).map((module) => (
                <article key={module.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_260px] lg:gap-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15px] font-semibold">{module.title}</h3>
                      <span className={`mono text-[10px] uppercase tracking-wider ${difficultyClass(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
                      {module.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {module.topics.map((topic) => (
                        <span key={topic} className="chip">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {module.resources.map((resource) => (
                      <a
                        key={resource.url}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-2 border-b border-line/70 py-1.5 text-[12px] text-muted transition-colors hover:text-ink"
                      >
                        {resource.name}
                        <ArrowUpRight className="h-3 w-3 shrink-0 opacity-60 group-hover:opacity-100" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === "platforms" && (
          <section aria-label="Practice platforms">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
              <div>
                <p className="eyebrow">External practice</p>
                <h2 className="display mt-2 text-2xl font-semibold tracking-tight">
                  Where to solve
                </h2>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-muted">
                ContestRadar links out. We do not host problems or judge submissions.
              </p>
            </div>

            <div className="divide-y divide-line">
              {platforms.map((platform) => (
                <article
                  key={platform.name}
                  className="grid gap-3 py-5 lg:grid-cols-[180px_1fr_auto] lg:items-start lg:gap-6"
                >
                  <div>
                    <h3 className="text-[14px] font-semibold">{platform.name}</h3>
                    <p className="mono mt-1 text-[10px] uppercase tracking-wider text-muted">
                      {platform.level}
                    </p>
                  </div>
                  <div>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted">
                      {platform.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {platform.specialties.map((item) => (
                        <span key={item} className="chip">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm w-fit"
                  >
                    Visit
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
