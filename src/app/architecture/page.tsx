import { getPublicLanguage, publicMetadata } from "@/lib/publicMetadata";
import Architecture from "@/components/sections/Architecture";
import PublicShell from "@/components/sections/PublicShell";

export default async function ArchitecturePage() {
  const language = await getPublicLanguage();
  return <PublicShell initialLanguage={language} active="architecture"><Architecture standalone /></PublicShell>;
}

export async function generateMetadata() {
  return publicMetadata("architecture");
}
