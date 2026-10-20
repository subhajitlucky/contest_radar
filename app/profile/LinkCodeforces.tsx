"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, RefreshCw } from "lucide-react";

export default function LinkCodeforces({
  initialHandle,
  initialRating,
}: {
  initialHandle: string | null;
  initialRating: number | null;
}) {
  const router = useRouter();
  const [handle, setHandle] = useState(initialHandle ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/user/codeforces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setMessage(payload.error || "Could not link that handle.");
        return;
      }

      setStatus("success");
      setMessage(
        `Linked ${payload.handle}${payload.rating ? ` · ${payload.rating}` : ""} · ${
          payload.contests
        } contests.`
      );
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  };

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Codeforces identity</p>
          <p className="mt-1 text-sm text-muted">
            {initialHandle
              ? `Linked as ${initialHandle}${initialRating ? ` · ${initialRating}` : ""}.`
              : "Link a handle to store rating history and streaks."}
          </p>
        </div>
        {initialHandle && (
          <span className="chip">
            <Link2 className="h-3 w-3" aria-hidden="true" />
            Linked
          </span>
        )}
      </div>

      <form onSubmit={submit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={handle}
          onChange={(event) => setHandle(event.target.value)}
          placeholder="tourist"
          className="field h-10"
          aria-label="Codeforces handle"
          autoComplete="username"
        />
        <button type="submit" disabled={status === "loading"} className="btn btn-outline">
          {initialHandle ? (
            <>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Refresh
            </>
          ) : (
            "Link handle"
          )}
        </button>
      </form>

      {message && (
        <p className={`mt-2 text-xs ${status === "success" ? "text-signal" : "text-hot"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
