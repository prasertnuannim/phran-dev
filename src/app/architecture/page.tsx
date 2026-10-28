import { publicMetadata } from "@/lib/publicMetadata";
import Architecture from "@/components/sections/Architecture";
import PublicShell from "@/components/sections/PublicShell";

export default async function ArchitecturePage() {
  return <PublicShell active="architecture"><Architecture standalone /></PublicShell>;
}

export async function generateMetadata() {
  return publicMetadata("architecture");
}
