import { redirect } from "next/navigation";
import { auth } from "@/server/services/auth/authService";
import { resolveRoleRedirectPath } from "@/lib/auth/accessRole";

export default async function Redirect() {
  const session = await auth();
  const targetPath = resolveRoleRedirectPath(session?.user?.role ?? undefined);
  console.log("Can access in redirect")
  redirect(targetPath);
}
