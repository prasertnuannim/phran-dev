import SessionProvider from "@/components/auth/SessionProvider";
import "./globals.css";
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from "next/font/google";
import { auth } from "@/server/services/auth/authService";
import type { Metadata } from "next";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-thai",
  display: "swap",
});

// ✅ ข้อมูล SEO / OG / Twitter / JSON-LD
export const metadata: Metadata = {
  metadataBase: new URL("https://phran.dev"),
  title: {
    default: "Phran.Dev – สร้างความฝัน ล่าความคิด",
    template: "%s | Phran.Dev",
  },
  description:
    "Pharan Dev – นักพัฒนาและนักออกแบบที่ล่าความฉลาดในระบบของคุณ (Hunt the intelligence in your system). Where instinct meets innovation.",
  keywords: [
    "Pharan Dev",
    "พราน",
    "นักพัฒนา",
    "โปรแกรมเมอร์",
    "Phran.Dev",
    "Next.js Developer",
    "Full Stack Developer Thailand",
    "Creative Tech Developer",
    "System Intelligence",
  ],
  authors: [{ name: "Pharan Dev", url: "https://phran.dev" }],
  openGraph: {
    title: "Phran.Dev – ล่าความฉลาดในระบบของคุณ",
    description:
      "นักพัฒนาและนักออกแบบที่สร้างระบบอัจฉริยะ ผสานความคิดสร้างสรรค์และเทคโนโลยี",
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
    title: "Phran.Dev – สร้างความฝัน ล่าความคิด",
    description:
      "Where instinct meets innovation. นักพัฒนาและนักออกแบบระบบอัจฉริยะ",
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
  return (
    <html
      lang="th"
      className={`${plusJakarta.variable} ${notoThai.variable}`}
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
              jobTitle: "Full Stack Developer",
              description:
                "นักพัฒนาและนักออกแบบที่ล่าความฉลาดในระบบของคุณ (Hunt the intelligence in your system)",
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
