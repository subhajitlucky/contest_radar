"use client";

import { useState } from "react";
import { BellRing, Check } from "lucide-react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToArrayBuffer(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const output = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return buffer;
}

export default function PushSubscribe() {
  const [status, setStatus] = useState<"idle" | "loading" | "enabled" | "error">("idle");
  const [message, setMessage] = useState("");

  const enable = async () => {
    if (!VAPID_PUBLIC_KEY) {
      setStatus("error");
      setMessage("Browser push is not available yet.");
      return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("error");
      setMessage("This browser does not support web push.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("error");
        setMessage("Notification permission was not granted.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToArrayBuffer(VAPID_PUBLIC_KEY),
        }));

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          platforms: [],
          leadMinutes: 60,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setMessage(payload.error || "Could not enable browser push.");
        return;
      }

      setStatus("enabled");
      setMessage("Browser push enabled for every platform, 1 hour before start.");
    } catch {
      setStatus("error");
      setMessage("Could not enable browser push. Try again.");
    }
  };

  return (
    <div className="space-y-4">
      <p className="max-w-xl text-sm leading-relaxed text-muted">
        Get a native notification before contests start. Push works in Chrome, Edge, and
        Android browsers; iOS requires the site to be installed to the home screen.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={enable}
          disabled={status === "loading" || status === "enabled"}
          className="btn btn-signal"
        >
          {status === "enabled" ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Enabled
            </>
          ) : (
            <>
              <BellRing className="h-4 w-4" aria-hidden="true" />
              {status === "loading" ? "Enabling…" : "Enable browser push"}
            </>
          )}
        </button>
        <span className="text-[10px] text-muted">No account required</span>
      </div>

      {message && (
        <p className={`text-xs ${status === "error" ? "text-hot" : "text-signal"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
