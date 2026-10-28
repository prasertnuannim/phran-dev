import { publicMetadata } from "@/lib/publicMetadata";
import { redirect } from "next/navigation";
import { auth, resolveRoleRedirectPath } from "@/server/services/auth/authService";
import About from "@/components/sections/About";
import Architecture from "@/components/sections/Architecture";
import Hero from "@/components/sections/Hero";
import PublicShell from "@/components/sections/PublicShell";

export default async function Page() {
  const session = await auth();
  const destination = resolveRoleRedirectPath(session?.user?.role);
  if (session?.user && destination !== "/") redirect(destination);
  return <PublicShell active="home"><Hero /><About /><Architecture /></PublicShell>;
}

export async function generateMetadata() {
  return publicMetadata("home");
}
