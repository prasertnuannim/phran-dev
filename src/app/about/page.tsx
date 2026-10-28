import { getPublicLanguage, publicMetadata } from "@/lib/publicMetadata";
import About from "@/components/sections/About";
import PublicShell from "@/components/sections/PublicShell";

export default async function AboutPage() {
  const language = await getPublicLanguage();
  return <PublicShell initialLanguage={language} active="about"><About standalone /></PublicShell>;
}

export async function generateMetadata() {
  return publicMetadata("about");
}
