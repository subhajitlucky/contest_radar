"use client";

import { type FormEvent, useState } from "react";
import { PLATFORM_META, type PlatformKey } from "@/lib/contestService";

const PLATFORM_KEYS = Object.keys(PLATFORM_META) as PlatformKey[];

export default function DiscordForm() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [platforms, setPlatforms] = useState<PlatformKey[]>(PLATFORM_KEYS);
  const [leadMinutes, setLeadMinutes] = useState(60);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const togglePlatform = (key: PlatformKey) => {
    setPlatforms((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/alerts/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl, platforms, leadMinutes }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setMessage(payload.error || "Could not save the webhook.");
        return;
      }

      setStatus("success");
      setMessage(payload.message || "Discord reminders enabled.");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  };

  return (
    <form onSubmit={submit} className="mt-5 space-y-5">
      <div>
        <label htmlFor="discord-webhook" className="eyebrow">
          Discord webhook URL
        </label>
        <input
          id="discord-webhook"
          type="url"
          required
          value={webhookUrl}
          onChange={(event) => setWebhookUrl(event.target.value)}
          placeholder="https://discord.com/api/webhooks/..."
          className="field mt-2"
        />
        <p className="mt-2 text-xs text-muted">
          In Discord: Server Settings → Integrations → Webhooks → New Webhook → Copy URL.
        </p>
      </div>

      <fieldset>
        <legend className="eyebrow">Platforms</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PLATFORM_KEYS.map((key) => (
            <label
              key={key}
              data-platform={key}
              className={`chip cursor-pointer ${platforms.includes(key) ? "chip-active" : ""}`}
            >
              <input
                type="checkbox"
                checked={platforms.includes(key)}
                onChange={() => togglePlatform(key)}
                className="sr-only"
              />
              <span className="platform-dot" aria-hidden="true" />
              {PLATFORM_META[key].name}
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">
          Leave all unchecked to receive every platform.
        </p>
      </fieldset>

      <div>
        <label htmlFor="discord-lead" className="eyebrow">
          Remind me before
        </label>
        <select
          id="discord-lead"
          value={leadMinutes}
          onChange={(event) => setLeadMinutes(Number(event.target.value))}
          className="field mt-2"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={120}>2 hours</option>
          <option value={240}>4 hours</option>
        </select>
      </div>

      <button type="submit" disabled={status === "loading"} className="btn btn-signal w-full">
        {status === "loading" ? "Saving…" : "Enable Discord reminders"}
      </button>

      {message && (
        <p className={`text-sm ${status === "success" ? "text-signal" : "text-hot"}`}>
          {message}
        </p>
      )}

      <p className="text-xs leading-relaxed text-muted">
        The webhook URL is stored on the server and used only to post contest reminders.
      </p>
    </form>
  );
}
