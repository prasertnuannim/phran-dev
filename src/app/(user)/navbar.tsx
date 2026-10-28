import Link from "next/link";
import BrandWordmark from "@/components/BrandWordmark";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerAuthSession } from "@/server/services/auth/sessionService";

export default async function Navbar() {
  const session = await getServerAuthSession();
  const userName = session?.user?.name ?? "ผู้ใช้งาน";
  const userInitial = userName.charAt(0).toUpperCase() || "?";

  return (
    <header className="factory-nav dashboard-nav">
      <Link href="/" className="factory-brand" aria-label="Phran.Dev หน้าหลัก"><BrandWordmark /></Link>
      <span className="dashboard-nav-label">Smart Home</span>
      {session?.user && <div className="dashboard-profile">
        <div className="dashboard-profile-name"><small>พื้นที่ทำงานของคุณ</small><span>{userName}</span></div>
        <Avatar className="h-9 w-9 border border-slate-200 bg-slate-100">
          <AvatarImage src={session.user.image ?? undefined} alt={userName} referrerPolicy="no-referrer" />
          <AvatarFallback className="text-sm text-slate-600">{userInitial}</AvatarFallback>
        </Avatar>
        <LogoutButton variant="unstyled" text="ออกจากระบบ" className="dashboard-logout" />
      </div>}
    </header>
  );
}
