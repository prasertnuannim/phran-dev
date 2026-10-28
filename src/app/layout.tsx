import { getPublicLanguage } from "@/lib/publicMetadata";
import SessionProvider from "@/components/auth/SessionProvider";
import "./globals.css";
import { Plus_Jakarta_Sans, Noto_Sans_Thai, Kalam, IBM_Plex_Mono } from "next/font/google";
import { auth } from "@/server/services/auth/authService";
import type { Metadata } from "next";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
  display: "swap",
});

const telemetryMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-telemetry-mono",
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-thai",
  display: "swap",
});

const siteTitle = "Phran.Dev – นักพัฒนาอิสระและโซลูชัน Industrial IoT";
const siteDescription =
  "รับพัฒนาเว็บไซต์ เว็บแอป และระบบตามความต้องการ พร้อมโซลูชัน Industrial IoT และ Smart Factory เชื่อมต่ออุปกรณ์ ข้อมูล และ Dashboard สำหรับธุรกิจและโรงงาน";

// Shared search and social metadata.
export const metadata: Metadata = {
  metadataBase: new URL("https://phran.dev"),
  title: {
    default: siteTitle,
    template: "%s | Phran.Dev",
  },
  description: siteDescription,
  keywords: [
    "Pharan Dev",
    "พราน",
    "นักพัฒนา",
    "โปรแกรมเมอร์",
    "Phran.Dev",
    "Next.js Developer",
    "Full Stack Developer Thailand",
    "Freelance Developer",
    "รับพัฒนาเว็บไซต์",
    "รับทำเว็บแอป",
    "Industrial IoT Solutions",
    "Industrial IoT Engineer",
    "Smart Factory Engineer",
    "Industrial IoT",
    "Smart Factory",
    "Edge Gateway",
    "Dashboard",
    "เชื่อมต่อ API",
  ],
  authors: [{ name: "Pharan Dev", url: "https://phran.dev" }],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "https://phran.dev",
    siteName: "Phran.Dev",
    images: [
      {
        url: "https://phran.dev/images/phran-hunter.png",
        width: 1200,
        height: 630,
        alt: "Pharan Dev Hero Image",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["https://phran.dev/images/phran-hunter.png"],
    creator: "@phrandev",
  },
  alternates: {
    canonical: "https://phran.dev",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const language = await getPublicLanguage();
  return (
    <html
      lang={language === "zh" ? "zh-Hans" : language}
      className={`${plusJakarta.variable} ${notoThai.variable} ${kalam.variable} ${telemetryMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Pharan Dev",
              url: "https://phran.dev",
              sameAs: [
                "https://prasertnuannim.vercel.app/#home",
              ],
              jobTitle: "Freelance Developer & Industrial IoT Engineer",
              email: "phrandev@gmail.com",
              knowsAbout: ["Web Development", "Web Applications", "API Integration", "Industrial IoT", "Smart Factory"],
              description: siteDescription,
            }),
          }}
        />
      </head>

      <body className="font-sans transition-colors duration-500">
      <SessionProvider session={session}>  {children}</SessionProvider>
      </body>
    </html>
  );
}
