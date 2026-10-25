"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="shell flex min-h-[70vh] flex-col justify-center py-20">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="display mt-4 max-w-2xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
        The radar hit turbulence.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
        This view could not load. Try again, or head back to the live schedule.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-signal">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to radar
        </Link>
      </div>
    </main>
  );
}
