import { redirect } from "next/navigation";
import AccountForm from "./accountForm";
import { SessionService } from "@/server/services/auth/sessionService";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await SessionService.get();
  if (!session?.user) redirect("/");
  if (session.user.role !== "admin") redirect("/");

  return (
    <main className="mx-auto">
      <div className="mb-1">
        <h1 className="text-3xl font-semibold">Account Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage users, roles, and access from a single dashboard. New admin-created accounts sign in with Google or GitHub using their registered email.
        </p>
      </div>
      <AccountForm />
    </main>
  );
}
