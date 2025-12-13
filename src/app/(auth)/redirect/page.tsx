import { redirect } from "next/navigation";
import { auth, resolveRoleRedirectPath } from "@/server/services/auth/authService";

export default async function Redirect() {
  const session = await auth();
  const targetPath = resolveRoleRedirectPath(session?.user?.role ?? undefined);
  redirect(targetPath);
}
