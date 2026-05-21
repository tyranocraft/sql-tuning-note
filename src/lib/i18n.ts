import type { Locale, Dictionary } from "./types";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ko: () => import("@/dictionaries/ko.json").then((m) => m.default as Dictionary),
  en: () => import("@/dictionaries/en.json").then((m) => m.default as Dictionary),
};

export const locales: Locale[] = ["ko", "en"];
export const defaultLocale: Locale = "en";

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
