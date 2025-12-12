// import { redirect } from "next/navigation";
// import { auth } from "@/server/services/auth/authService";
// import { resolveRoleRedirectPath } from "@/lib/auth/accessRole";

// export default async function Redirect() {
//   const session = await auth();
//   const targetPath = resolveRoleRedirectPath(session?.user?.role ?? undefined);
//   redirect(targetPath);
// }


import { redirect } from "next/navigation";
import { auth } from "@/server/services/auth/authService";
import { resolveRoleRedirectPath } from "@/lib/auth/accessRole";

export default async function RedirectPage() {
  const session = await auth();

  // ❌ ยังไม่ login → กลับหน้าแรก
  if (!session?.user) {
    redirect("/");
  }

  const role = session.user.role;
  const targetPath = resolveRoleRedirectPath(role);

  // ✅ กันพลาด
  if (!targetPath || targetPath === "/redirect") {
    redirect("/");
  }

  redirect(targetPath);
}
