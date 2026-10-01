"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/stats";

/** Mounted once in the layout: reports each page view to the privacy-friendly counter. */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const m = pathname.match(/^\/blog\/([^/]+)\/?$/);
    void track(m ? m[1] : undefined);
  }, [pathname]);

  return null;
}
