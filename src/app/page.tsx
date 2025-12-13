
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import { auth, resolveRoleRedirectPath } from "@/server/services/auth/authService";
import { redirect } from "next/navigation";

export default async function Page() {

  const session = await auth();
  const targetPath = resolveRoleRedirectPath(session?.user?.role ?? undefined);

  if (targetPath !== "/") {
    redirect(targetPath);
  }

  return (
    <main className="snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <Hero />
      <About />
      <Contact />
    </main>
  );
}
