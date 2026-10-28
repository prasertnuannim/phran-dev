"use client";

import { localizedPath } from "@/lib/publicLocale";
import { useLanguage } from "./LanguageProvider";
import Link from "next/link";

export default function SectionLink({ section, href, children, ...props }: {
  section: string;
  href: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "children">) {
  const { language } = useLanguage();
  return <Link {...props} href={localizedPath(language, href)} onClick={(event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const target = document.getElementById(section);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  }}>{children}</Link>;
}
