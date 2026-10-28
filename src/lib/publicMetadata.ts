import type { Metadata } from "next";
import { headers } from "next/headers";
import { isLanguage, localizedPath } from "./publicLocale";

export async function getPublicLanguage() {
  const value = (await headers()).get("x-public-language");
  return isLanguage(value) ? value : "th";
}

const copy = {
  home: {
    title: { th: "นักพัฒนาอิสระและโซลูชัน Industrial IoT", en: "Freelance Developer & Industrial IoT Solutions", zh: "自由开发者与工业物联网解决方案" },
    description: { th: "รับพัฒนาเว็บไซต์ เว็บแอป และระบบตามความต้องการ พร้อมโซลูชัน Industrial IoT และ Smart Factory เชื่อมต่ออุปกรณ์ ข้อมูล และ Dashboard สำหรับธุรกิจและโรงงาน", en: "Custom websites, web apps, and systems, plus Industrial IoT and Smart Factory solutions connecting devices, data, and dashboards for businesses and factories.", zh: "定制网站、Web 应用与系统，并为企业与工厂提供工业物联网及智能工厂解决方案，连接设备、数据与仪表盘。" },
  },
  about: {
    title: { th: "พัฒนาเว็บไซต์และโซลูชัน Industrial IoT", en: "Web Development & Industrial IoT Solutions", zh: "网站开发与工业物联网解决方案" },
    description: { th: "บริการพัฒนาเว็บไซต์ เว็บแอป และระบบตามความต้องการ พร้อมโซลูชัน Industrial IoT และ Smart Factory สำหรับธุรกิจและโรงงาน", en: "Website, web app, and custom system development, plus Industrial IoT and Smart Factory solutions for businesses and factories.", zh: "提供网站、Web 应用与定制系统开发服务，并为企业与工厂提供工业物联网及智能工厂解决方案。" },
  },
  architecture: {
    title: { th: "สถาปัตยกรรมระบบที่เชื่อมถึงกัน", en: "Connected System Architecture", zh: "互联系统架构" },
    description: { th: "แนวคิดการเชื่อมต่อเว็บไซต์ แอปพลิเคชัน เครื่องมือ และบริการ ผ่าน API และแพลตฟอร์มส่วนกลาง พร้อมข้อมูลตัวอย่าง", en: "Explore how websites, applications, tools, and services connect through APIs and a shared platform, with illustrative data.", zh: "了解网站、应用、工具与服务如何通过 API 和共享平台连接，附示例数据。" },
  },
};

export async function publicMetadata(page: keyof typeof copy): Promise<Metadata> {
  const language = await getPublicLanguage();
  const path = page === "home" ? "/" : `/${page}`;
  const title = `${copy[page].title[language]} | Phran.Dev`;
  const description = copy[page].description[language];
  const url = localizedPath(language, path);
  const image = { url: "/images/phran-hunter.png", alt: "Phran.Dev" };
  return {
    title: { absolute: title }, description,
    alternates: { canonical: url, languages: { th: localizedPath("th", path), en: localizedPath("en", path), "zh-Hans": localizedPath("zh", path), "x-default": localizedPath("th", path) } },
    openGraph: { title, description, url, siteName: "Phran.Dev", locale: { th: "th_TH", en: "en_US", zh: "zh_CN" }[language], type: "website", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
