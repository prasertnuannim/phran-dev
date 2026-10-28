"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { updateAuthSettings } from "./actions";

export function AuthSettingsForm({ sessionMaxAge }: { sessionMaxAge: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-5">
      <form
        action={(formData) => {
          startTransition(async () => {
            try {
              const minutes = Number(formData.get("sessionMaxAge"));
              formData.set("sessionMaxAge", String(minutes * 60));
              await updateAuthSettings(formData);
              setResult("Saved. Please sign in again.");
              await signOut({ callbackUrl: "/" });
            } catch {
              setResult("Unable to save. Enter a lifetime between 1 and 43200 minutes and try again.");
            }
          });
        }}
        className="space-y-6"
      >
        <div>
          <label htmlFor="sessionMaxAge" className="block text-sm font-medium mb-2">
            Session Max Age (Minute)
          </label>
          <input
            id="sessionMaxAge"
            name="sessionMaxAge"
            defaultValue={Number(sessionMaxAge) / 60} // แปลงจากวินาที → นาที ตอนแสดง
            className="border p-2 rounded w-full"
            type="number"
            min={1}
            max={43200}
            step={1}
            required
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {pending ? "Saving..." : "Save Settings"}
        </button>

        {result && (
          <p role="status" className="text-sm mt-3 transition-opacity">
            {result}
          </p>
        )}
      </form>
    </div>
  );
}
