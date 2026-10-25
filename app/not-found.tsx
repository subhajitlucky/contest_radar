import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import Footer from "@/app/components/Footer";
import PublicHeader from "@/app/components/public/PublicHeader";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Page not found — ContestRadar",
};

export default async function NotFound() {
  const user = await getSessionUser();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <PublicHeader signedIn={Boolean(user)} />
      <main id="main" className="public-main">
        <section className="shell flex min-h-[60vh] flex-col justify-center py-20">
          <p className="eyebrow flex items-center gap-2">
            <Compass className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
            404 · Off the radar
          </p>
          <h1 className="display mt-4 max-w-2xl text-4xl font-semibold leading-[1] tracking-tight sm:text-5xl">
            This page drifted off the radar.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            The link may be old, or the contest has already ended. The live schedule
            is still right where you left it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-signal">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to radar
            </Link>
            <Link href="/contests" className="btn btn-ghost">
              Browse contests
            </Link>
          </div>
        </section>
      </main>
      <Footer mobileNav={false} />
    </>
  );
}
