"use client";

import { useLanguage } from "./sections/LanguageProvider";
import BrandWordmark from "./BrandWordmark";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { X, UserRound } from "lucide-react";
import Image from "next/image";
import { SocialSignInButton } from "./auth/SocialSignInButton";
import { FaGithub } from "react-icons/fa";
import LoginForm from "./auth/LoginForm";

export function ButtonLogin() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="factory-login">
        <button type="button" onClick={() => setIsOpen(true)} aria-haspopup="dialog" aria-label={t("เข้าสู่ระบบ")} title={t("เข้าสู่ระบบ")}>
          <UserRound size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="engineer-login-dialog">
        <div className="engineer-login-backdrop" aria-hidden="true" />
        <div className="engineer-login-container">
          <DialogPanel className="engineer-login-panel">
            <button type="button" className="engineer-login-close" onClick={() => setIsOpen(false)} aria-label={t("ปิดหน้าต่างเข้าสู่ระบบ")}><X size={18} /></button>
            <div className="engineer-login-mark"><Image src="/images/phran-hunter.png" alt="" width={32} height={48} /></div>
            <div className="engineer-login-brand"><BrandWordmark /></div>
            <DialogTitle className="engineer-login-title">{t("Welcome back.")}</DialogTitle>
            <Description className="engineer-login-description">{t("เข้าสู่ระบบเพื่อจัดการพื้นที่ทำงานของคุณ")}</Description>
            <div className="engineer-login-social">
              <SocialSignInButton />
              <SocialSignInButton provider="github" label={t("Continue with GitHub")} icon={<FaGithub className="h-5 w-5" />} />
            </div>
            <div className="engineer-login-divider"><span>{t("หรือใช้อีเมล")}</span></div>
            <div className="engineer-login-form"><LoginForm /></div>
            <p className="engineer-login-note">{t("Digital solutions. Thoughtfully built.")}</p>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
