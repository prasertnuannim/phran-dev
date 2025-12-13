import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default async function Page() {
  return (
    <main className="snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <Hero />
      <About />
      <Contact />
    </main>
  );
}
