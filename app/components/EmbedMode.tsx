"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function EmbedMode() {
  const pathname = usePathname();

  useEffect(() => {
    const embed = pathname.startsWith("/embed");
    document.documentElement.dataset.embed = embed ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.embed;
    };
  }, [pathname]);

  return null;
}
