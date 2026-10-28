"use client";

import { useLanguage } from "./LanguageProvider";
import { Cpu, Radio, Network, Cloud, Activity, Terminal } from "lucide-react";

export default function Architecture({ standalone = false }: { standalone?: boolean }) {
  const { t } = useLanguage();
  return (
    <section id="architecture" className="product-stage architecture-page">
        <div className="product-caption">{standalone ? <h1>{t("From ideas to connected experiences.")}</h1> : <h2>{t("From ideas to connected experiences.")}</h2>}<p>{t("One connected ecosystem.")}</p></div>
        <div className="architecture-panel">
          <div className="panel-header"><span><Terminal size={15} /> {t("SYSTEM ARCHITECTURE")}</span><span className="demo-tag">{t("DEMO SYSTEM")}</span></div>
          <div className="architecture-canvas">
            <div className="diagram-topline"><span>{t("YOUR DIGITAL WORKSPACE")}</span><span>{t("CONNECTED SERVICES")}</span></div>
            <div className="sensor-row">{[{icon:Radio,label:"WEBSITES / APPS",sub:"Everyday experiences"},{icon:Cpu,label:"TOOLS / SERVICES",sub:"The tools you use"}].map(({icon:Icon,label,sub})=><div className="diagram-node" key={t(label)}><Icon size={25}/><strong>{t(label)}</strong><small>{t(sub)}</small><span className="node-port" /></div>)}</div>
            <div className="diagram-connection"><span>REST / HTTPS</span></div>
            <div className="edge-node"><div className="edge-icon"><Network size={28}/></div><div><small>{t("DATA INTEGRATION")}</small><strong>{t("APPLICATION / API")}</strong></div><span className="signal-dot" /></div>
            <div className="diagram-connection"><span>API / HTTPS</span></div>
            <div className="cloud-node"><Cloud size={27}/><div><strong>{t("SHARED PLATFORM")}</strong><small>{t("Collect. Visualize. Act.")}</small></div><Activity size={20}/></div>
            <div className="diagram-footer"><span className="signal-dot"/> {t("CONNECTED BY DESIGN")}<span>{t("END-TO-END INTEGRATION")}</span></div>
          </div>
          <div className="telemetry-header"><span>{t("SYSTEM OVERVIEW")}</span><span>{t("ILLUSTRATIVE DATA")}</span></div>
          <div className="telemetry-row"><div><span>{t("RESPONSE TIME")}</span><strong>128<small> ms</small></strong><svg viewBox="0 0 160 28" aria-label={t("Illustrative response-time trend")}><path d="M0 22 L15 22 L22 14 L34 18 L44 8 L58 12 L69 6 L80 15 L94 11 L107 16 L119 5 L130 10 L143 4 L160 7" /></svg></div><div><span>{t("STORAGE USED")}</span><strong>64.2<small> %</small></strong><svg viewBox="0 0 160 28" aria-label={t("Illustrative storage-usage trend")}><path d="M0 16 L13 14 L24 20 L37 12 L49 17 L62 9 L73 13 L88 6 L99 12 L110 8 L124 13 L139 6 L150 9 L160 5" /></svg></div></div>
        </div>
        </section>
  );
}
