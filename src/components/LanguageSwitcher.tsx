"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";

const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "ENGLISH",
};

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  const otherLocale: Locale = locale === "ko" ? "en" : "ko";

  return (
    <button
      onClick={() => switchLocale(otherLocale)}
      className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:border-gray-500 hover:text-gray-900"
    >
      {localeLabels[otherLocale]}
    </button>
  );
}
