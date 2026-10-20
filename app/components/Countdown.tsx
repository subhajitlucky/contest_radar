"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  startTime: string;
  className?: string;
}

function formatRemaining(diffMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export default function Countdown({ startTime, className }: CountdownProps) {
  const [label, setLabel] = useState("—");

  useEffect(() => {
    const target = new Date(startTime).getTime();

    const tick = () => {
      const diff = target - Date.now();
      setLabel(diff <= 0 ? "LIVE" : formatRemaining(diff));
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [startTime]);

  return (
    <span className={className} suppressHydrationWarning>
      {label}
    </span>
  );
}
