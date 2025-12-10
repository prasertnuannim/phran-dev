import SessionProvider from "@/components/auth/SessionProvider";
import "./globals.css";
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from "next/font/google";
import { auth } from "@/server/services/auth/authService";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="th" className={`${plusJakarta.variable} ${notoThai.variable}`} suppressHydrationWarning>
      <body
        className="
          font-sans transition-colors duration-500
          bg-gradient-to-br from-white via-[#f8f6f1] to-[#e9e6df] text-neutral-900
        "
      >
      <SessionProvider session={session}>  {children}</SessionProvider>
      </body>
    </html>
  );
}
