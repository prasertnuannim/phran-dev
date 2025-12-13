import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import { redirect } from "next/navigation";
import { auth, resolveRoleRedirectPath } from "@/server/services/auth/authService";

export default async function Page() {
  const session = await auth();
  const role = session?.role ?? session?.user?.role;
  const target = resolveRoleRedirectPath(role);

  if (session?.user && target && target !== "/") {
    return redirect(target);
  }

  return (
    <main className="snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <Hero />
      <About />
      <Contact />
    </main>
  );
}
