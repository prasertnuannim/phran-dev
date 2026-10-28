"use client";

import { useLanguage } from "./LanguageProvider";
import { ArrowUpRight } from "lucide-react";
import SectionLink from "./SectionLink";
import Image from "next/image";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section id="home" className="factory-hero">
      <div className="factory-hero-grid">
        <div className="factory-intro">
          <div className="eyebrow"><span className="signal-dot" /> {t("Digital solutions. Thoughtfully built.")}</div>
          <h1>{t("Your ideas, made real.")}<br /><span className="hero-gradient">{t("Beautifully connected.")}</span></h1>
          <p className="hero-description">{t("From ideas to new possibilities.")}<br />{t("Websites, apps, and systems that work together.")}<br className="desktop-break" /> {t("Designed around your everyday needs.")}</p>
          <div className="factory-actions"><SectionLink section="about" href="/about" className="factory-primary">{t("Discover the possibilities")} <ArrowUpRight size={18} /></SectionLink></div>
          <div className="hero-caption"><span>{t("DESIGNED AS ONE")}</span><span>{t("Design. Development. Connection.")}</span></div>
        </div>
        <figure className="factory-hero-visual">
          <Image
            src="/images/smart-factory-engineer.png"
            alt={t("วิศวกรตรวจสอบข้อมูลผ่านแท็บเล็ตในโรงงานอัจฉริยะที่เชื่อมต่อเซนเซอร์และแขนกลอุตสาหกรรม")}
            width={1672}
            height={941}
            sizes="(min-width: 1440px) 1440px, 100vw"
            priority
          />
          <figcaption>{t("Technology shaped by people.")}<span>{t("ภาพแนวคิดประกอบบริการ")}</span></figcaption>
        </figure>
      </div>
      <div className="factory-tech-strip"><span>{t("BUILT FOR YOUR NEXT IDEA")}</span><div>WEB <i>/</i> APPS <i>/</i> API <i>/</i> CLOUD <i>/</i> NEXT.JS</div><SectionLink section="architecture" href="/architecture" aria-label={t("Explore system architecture")}><ArrowUpRight size={18}/></SectionLink></div>
    </section>
  );
}
