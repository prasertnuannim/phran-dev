import { redirect } from "next/navigation";
import { auth } from "@/server/services/auth/authService";
import { resolveRoleRedirectPath } from "@/lib/auth/accessRole";

export default async function RedirectPage() {
  const session = await auth();

  if (!session?.user?.role) {
    redirect("/");
  }

  const target = resolveRoleRedirectPath(session.user.role);

  if (!target || target === "/redirect") {
    redirect("/");
  }

  redirect(target);
}
