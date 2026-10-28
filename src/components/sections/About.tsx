"use client";

import { useLanguage } from "./LanguageProvider";
import Image from "next/image";
import { Code2, Lightbulb, Network } from "lucide-react";

const expertise = [
  { number: "01", icon: Lightbulb, title: "Ideas into solutions", description: "เริ่มจากความเข้าใจโจทย์และสิ่งที่คุณต้องการ เปลี่ยนแนวคิดให้เป็นแนวทางที่ชัดเจนและนำไปใช้ได้จริง", tags: "IDEAS / DESIGN / SOLUTIONS" },
  { number: "02", icon: Code2, title: "Built around you", description: "ออกแบบและพัฒนาเว็บไซต์ แอปพลิเคชัน และระบบให้เหมาะกับการใช้งาน พร้อมปรับเปลี่ยนไปตามการเติบโตของคุณ", tags: "WEB / APPS / DEVELOPMENT" },
  { number: "03", icon: Network, title: "Connected possibilities", description: "เชื่อมต่อข้อมูล เครื่องมือ และบริการให้ทำงานร่วมกัน ลดขั้นตอนที่ซ้ำซ้อน และเปิดโอกาสให้ต่อยอดสิ่งใหม่ได้ง่ายขึ้น", tags: "DATA / INTEGRATION / AUTOMATION" },
];
export default function About({ standalone = false }: { standalone?: boolean }) {
  const { t } = useLanguage();
  const Heading = standalone ? "h1" : "h2";
  return <section id="about" className="factory-about"><div className="section-heading"><div><div className="eyebrow">{t("THE POWER OF CONNECTION")}</div><Heading>{t("Every detail connected.")}<br/><span>{t("Every possibility unlocked.")}</span></Heading></div><p>{t("Understand your needs. Design the whole experience.")}<br/>{t("Bring ideas, data, and technology together.")}</p></div><figure className="expertise-visual"><Image src="/images/industrial-edge-gateway.png" alt={t("ภาพแนวคิด Edge Gateway และโมดูลเซนเซอร์ในตู้ควบคุมอุตสาหกรรม เชื่อมต่อกับสายการผลิตอัจฉริยะ")} width={1536} height={1024} sizes="(max-width: 640px) calc(100vw - 44px), (max-width: 1144px) calc(100vw - 64px), 1080px" /><figcaption><span>{t("Good solutions start with understanding.")}</span><small>{t("Connected technology concept")}</small></figcaption></figure><div className="expertise-grid">{expertise.map(({number,icon:Icon,title,description,tags})=><article key={number}><div className="expertise-top"><Icon size={28}/><span>{number}</span></div><h3>{t(title)}</h3><p>{t(description)}</p><div className="expertise-bottom"><span>{t(tags)}</span></div></article>)}</div></section>;
}
