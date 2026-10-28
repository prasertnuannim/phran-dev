"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const sectionRoutes: Record<string, string> = {
  "#about": "/about",
  "#ablut": "/about",
  "#architecture": "/architecture",
  "#home": "/",
};

export default function LegacySectionRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirectSection = () => {
      const route = sectionRoutes[window.location.hash.toLowerCase()];
      if (route) router.replace(route);
    };

    redirectSection();
    window.addEventListener("hashchange", redirectSection);
    return () => window.removeEventListener("hashchange", redirectSection);
  }, [router]);

  return null;
}
