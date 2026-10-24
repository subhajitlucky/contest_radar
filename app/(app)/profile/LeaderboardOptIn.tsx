"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

export default function LeaderboardOptIn({
  initialOptIn,
  hasHandle,
}: {
  initialOptIn: boolean;
  hasHandle: boolean;
}) {
  const router = useRouter();
  const [optIn, setOptIn] = useState(initialOptIn);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggle = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/user/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optIn: !optIn }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setMessage(payload.error || "Could not update the setting.");
        return;
      }
      setOptIn(Boolean(payload.optIn));
      setMessage(payload.optIn ? "You are on the leaderboard." : "Removed from the leaderboard.");
      router.refresh();
    } catch {
      setMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!hasHandle) {
    return (
      <div className="panel p-5">
        <p className="eyebrow">Leaderboard</p>
        <p className="mt-1 text-sm text-muted">
          Link a Codeforces handle before joining the leaderboard.
        </p>
      </div>
    );
  }

  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Leaderboard</p>
          <p className="mt-1 text-sm text-muted">
            {optIn ? "Public: handle, rating, and streak." : "Private by default."}
          </p>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={loading}
          className={`btn btn-sm ${optIn ? "btn-outline" : "btn-signal"}`}
        >
          <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
          {optIn ? "Leave leaderboard" : "Join leaderboard"}
        </button>
      </div>
      {message && <p className="mt-2 text-xs text-muted">{message}</p>}
    </div>
  );
}
