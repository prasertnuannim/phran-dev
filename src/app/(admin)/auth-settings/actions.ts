"use server";

import { SessionService } from "@/server/services/auth/sessionService";

import { saveSessionMaxAgeSeconds } from "@/server/services/auth/sessionSettings";
import { revalidatePath } from "next/cache";


// ✅ บันทึกค่าการตั้งค่า Auth เช่น redirect path และ session timeout
export async function updateAuthSettings(formData: FormData) {
  const session = await SessionService.get();

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const sessionMaxAge = Number(formData.get("sessionMaxAge"));

  await saveSessionMaxAgeSeconds(sessionMaxAge);

  revalidatePath("/auth-settings");
  return { ok: true };
}
