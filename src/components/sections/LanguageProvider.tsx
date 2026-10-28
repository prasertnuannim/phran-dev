"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Globe2, ArrowRightLeft } from "lucide-react";
import { translations } from "./translations";

import { isLanguage, type Language } from "@/lib/publicLocale";
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (key: string) => string }>({
  language: "th" as Language,
  setLanguage: () => {},
  t: (key: string): string => translations[key]?.th ?? key,
});

export function LanguageProvider({ children, initialLanguage = "th" }: { children: React.ReactNode; initialLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  useEffect(() => {
    const saved = document.cookie.split("; ").find((item) => item.startsWith("phran-language="))?.split("=")[1] ?? null;
    if (isLanguage(saved)) queueMicrotask(() => setLanguage(saved));
  }, []);
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = language === "zh" ? "zh-Hans" : language;
    return () => { document.documentElement.lang = previous; };
  }, [language]);
  const changeLanguage = (next: Language) => {
    setLanguage(next);
    document.cookie = `phran-language=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  };
  return <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: (key) => translations[key]?.[language] ?? key }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const languages = [
    { value: "th", label: "ไทย", lang: "th", nextLabel: "เปลี่ยนเป็นภาษาอังกฤษ" },
    { value: "en", label: "EN", lang: "en", nextLabel: "Switch to Chinese" },
    { value: "zh", label: "中文", lang: "zh-Hans", nextLabel: "切换到泰语" },
  ] as const;
  const index = languages.findIndex((option) => option.value === language);
  const current = languages[index];
  const next = languages[(index + 1) % languages.length];

  return <div className="language-switcher">
    <button
      type="button"
      lang={current.lang}
      aria-label={`${current.label}: ${current.nextLabel}`}
      title={current.nextLabel}
      onClick={() => setLanguage(next.value)}
    >
      <Globe2 className="language-globe" size={17} strokeWidth={1.7} aria-hidden="true" />
      <span className="language-label" key={language}>{current.label}</span>
      <ArrowRightLeft className="language-cycle" size={13} strokeWidth={1.8} aria-hidden="true" />
    </button>
  </div>;
}
