"use client";

import { type Language } from "@/lib/publicLocale";
import { LanguageProvider, LanguageSwitcher, useLanguage } from "./LanguageProvider";
import { Check, Copy, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BrandWordmark from "../BrandWordmark";
import Link from "next/link";
import { ButtonLogin } from "../ButtonLogin";
import PublicNavigation from "./PublicNavigation";
import SectionLink from "./SectionLink";
import LegacySectionRedirect from "./LegacySectionRedirect";

function PublicShellContent({ children, active }: {
  children: React.ReactNode;
  active: "home" | "about" | "architecture";
  initialLanguage?: Language;
}) {
  const { t } = useLanguage();
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);
  const copyEmail = async () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText("phrandev@gmail.com");
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    copyTimer.current = setTimeout(() => setCopyStatus("idle"), 3000);
  };
  return (
    <div className="factory-site">
      <LegacySectionRedirect />
      <header className="factory-nav">
        <Link href="/" className="factory-brand" aria-label={t("Phran.Dev home")}>
          <BrandWordmark />
        </Link>
        <PublicNavigation active={active} />
        <div className="factory-nav-tools"><LanguageSwitcher /><ButtonLogin /></div>
      </header>
      <main>
        {children}
        <section id="contact" className="public-contact" aria-labelledby="contact-heading">
          <div className="eyebrow">{t("LET’S TALK")}</div>
          <h2 id="contact-heading">{t("Have an idea or a project in mind?")}</h2>
          <p>{t("Tell me what you’re working on. Let’s explore the possibilities together.")}</p>
          <button type="button" className="public-contact-email" onClick={copyEmail} aria-label={t("Copy email address")}>
            <Mail size={20} aria-hidden="true" />
            <span>phrandev@gmail.com</span>
            {copyStatus === "copied" ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          </button>
          <p className="public-contact-copy-status" role="status">
            {copyStatus === "copied" ? t("Email copied") : copyStatus === "error" ? t("Unable to copy. Please select and copy the email address.") : t("Click to copy email")}
          </p>
        </section>
      </main>
      <footer className="factory-footer">
        <Link href="/" aria-label={t("Phran.Dev home")}><BrandWordmark /></Link>
        <span>{t("ENGINEERED WITH PURPOSE. BUILT TO CONNECT.")}</span>
        <SectionLink section={active === "home" ? "about" : "home"} href={active === "home" ? "/about" : "/"}>{active === "home" ? t("Explore expertise →") : t("← Back to home")}</SectionLink>
      </footer>
    </div>
  );
}

export default function PublicShell(props: Parameters<typeof PublicShellContent>[0]) {
  return <LanguageProvider initialLanguage={props.initialLanguage}><PublicShellContent {...props} /></LanguageProvider>;
}
