"use client";

import { localizedPath } from "@/lib/publicLocale";
import { useLanguage } from "./LanguageProvider";
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
  const { language } = useLanguage();

  useEffect(() => {
    const redirectSection = () => {
      const route = sectionRoutes[window.location.hash.toLowerCase()];
      if (route) router.replace(localizedPath(language, route));
    };

    redirectSection();
    window.addEventListener("hashchange", redirectSection);
    return () => window.removeEventListener("hashchange", redirectSection);
  }, [router, language]);

  return null;
}
