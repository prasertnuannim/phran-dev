export const languages = ["th", "en", "zh"] as const;
export type Language = (typeof languages)[number];
export function isLanguage(value: string | null): value is Language {
  return languages.includes(value as Language);
}
