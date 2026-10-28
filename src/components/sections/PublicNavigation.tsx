"use client";

import { useLanguage } from "./LanguageProvider";
import { useEffect, useState } from "react";
import SectionLink from "./SectionLink";

export default function PublicNavigation({ active }: { active: string }) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(active);
  useEffect(() => {
    const update = () => {
      const sections = ["home", "about", "architecture"];
      let visible = active;
      for (const id of sections) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= window.innerHeight * .35) visible = id;
      }
      setCurrent(visible);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [active]);

  return <nav aria-label={t("Main navigation")}>
    {[{id: "home", href: "/", label: "Home"}, {id: "about", href: "/about", label: "Expertise"}, {id: "architecture", href: "/architecture", label: "Architecture"}].map(({id, href, label}) =>
      <SectionLink key={id} section={id} href={href} aria-current={current === id ? "location" : undefined}>{t(label)}</SectionLink>
    )}
  </nav>;
}
