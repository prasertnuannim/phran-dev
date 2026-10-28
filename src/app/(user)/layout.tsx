import { redirect } from "next/navigation";
import { auth } from "@/server/services/auth/authService";

export const dynamic = "force-dynamic";
import Navbar from "./navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id || !["admin", "user"].includes(session.user.role ?? "")) redirect("/");

  return (
    <div className="">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      <div className="flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
