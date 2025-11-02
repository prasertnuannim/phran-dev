import "./globals.css";
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from "next/font/google";

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

export const metadata = {
  title: "Phran.Dev – สร้างความฝัน ล่าความคิด",
  description: "Where instinct meets innovation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${plusJakarta.variable} ${notoThai.variable}`} suppressHydrationWarning>
      <body
        className="
          font-sans transition-colors duration-500
          bg-gradient-to-br from-white via-[#f8f6f1] to-[#e9e6df] text-neutral-900
        "
      >
      {children}
      </body>
    </html>
  );
}
