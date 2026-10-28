import { getSessionMaxAgeSeconds } from "@/server/services/auth/sessionSettings";

import { SessionService } from "@/server/services/auth/sessionService";
import { redirect } from "next/navigation";
import { AuthSettingsForm } from "./authSettingsForm";


export const dynamic = "force-dynamic";

export default async function AuthSettingsPage() {
  const session = await SessionService.get();
  if (!session?.user) redirect("/");
  if (session.user.role !== "admin") redirect("/");

  const sessionMaxAgeSeconds = await getSessionMaxAgeSeconds();

  return (
    <main className="mx-auto py-12">
      <h1 className="text-2xl font-bold">Auth Settings</h1>
      <AuthSettingsForm sessionMaxAge={String(sessionMaxAgeSeconds)} />
    </main>
  );
}
