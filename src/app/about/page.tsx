import { publicMetadata } from "@/lib/publicMetadata";
import About from "@/components/sections/About";
import PublicShell from "@/components/sections/PublicShell";

export default async function AboutPage() {
  return <PublicShell active="about"><About standalone /></PublicShell>;
}

export async function generateMetadata() {
  return publicMetadata("about");
}
