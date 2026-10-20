"use client";

import { useState } from "react";
import { PLATFORM_META, type PlatformKey } from "@/lib/contestService";

const PLATFORM_KEYS = Object.keys(PLATFORM_META) as PlatformKey[];

export default function EmailAlertForm() {
  const [email, setEmail] = useState("");
  const [platforms, setPlatforms] = useState<PlatformKey[]>(PLATFORM_KEYS);
  const [leadMinutes, setLeadMinutes] = useState(60);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const togglePlatform = (key: PlatformKey) => {
    setPlatforms((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, platforms, leadMinutes }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setMessage(payload.error || "Could not save your subscription.");
        return;
      }

      setStatus("success");
      setMessage(payload.message || "Check your inbox to confirm.");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="alert-email" className="block text-sm font-semibold text-gray-900 dark:text-white">
          Email address
        </label>
        <input
          id="alert-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-gray-900 dark:text-white">Platforms</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PLATFORM_KEYS.map((key) => (
            <label
              key={key}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                platforms.includes(key)
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={platforms.includes(key)}
                onChange={() => togglePlatform(key)}
                className="sr-only"
              />
              {PLATFORM_META[key].name}
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Leave all unchecked to receive every platform.
        </p>
      </fieldset>

      <div>
        <label htmlFor="alert-lead" className="block text-sm font-semibold text-gray-900 dark:text-white">
          Remind me before
        </label>
        <select
          id="alert-lead"
          value={leadMinutes}
          onChange={(event) => setLeadMinutes(Number(event.target.value))}
          className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={120}>2 hours</option>
          <option value={240}>4 hours</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
      >
        {status === "loading" ? "Saving…" : "Get email alerts"}
      </button>

      {message && (
        <p
          className={`text-sm ${
            status === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        You will receive a confirmation email. Email alerts require server configuration; if
        it is missing, Telegram and calendar feeds still work.
      </p>
    </form>
  );
}
