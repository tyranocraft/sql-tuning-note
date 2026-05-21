import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isValidLocale } from "@/lib/i18n";
import Header from "@/components/Header";
import type { Locale } from "@/lib/types";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);

  return (
    <div className="min-h-screen bg-white">
      <Header locale={locale as Locale} dictionary={dictionary} />
      <main>{children}</main>
    </div>
  );
}
