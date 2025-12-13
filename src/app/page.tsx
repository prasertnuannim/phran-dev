import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import { auth } from "@/server/services/auth/authService";

export default async function Page() {
  const session = await auth();
  console.log("can access to main page >>> ", session);
  return (
    <main className="snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <Hero />
      <About />
      <Contact />
    </main>
  );
}
