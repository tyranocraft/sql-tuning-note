import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { getAllContent } from "@/lib/content";
import ContentList from "@/components/ContentList";
import type { Locale } from "@/lib/types";

export function generateStaticParams() {
  return [
    { locale: "ko", database: "mysql" },
    { locale: "en", database: "mysql" },
    { locale: "ko", database: "postgresql" },
    { locale: "en", database: "postgresql" },
  ];
}

export default async function BrowsePage({
  params,
}: {
  params: Promise<{ locale: string; database: string }>;
}) {
  const { locale, database } = await params;
  if (!isValidLocale(locale)) notFound();

  const dictionary = await getDictionary(locale as Locale);
  const contents = getAllContent(database, locale);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {database.toUpperCase()}
      </h1>
      <ContentList
        contents={contents}
        locale={locale as Locale}
        dictionary={dictionary}
      />
    </div>
  );
}
