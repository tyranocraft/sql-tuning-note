import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, isValidDatabase } from "@/lib/i18n";
import { getAllContent } from "@/lib/content";
import Sidebar from "@/components/Sidebar";
import type { Locale } from "@/lib/types";

export default async function NotesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; database: string }>;
}) {
  const { locale, database } = await params;

  if (!isValidLocale(locale) || !isValidDatabase(database)) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);
  const contents = getAllContent(database, locale);

  return (
    <div className="flex">
      <Sidebar
        contents={contents}
        locale={locale as Locale}
        database={database}
        dictionary={dictionary}
      />
      <div className="min-w-0 flex-1 p-8">{children}</div>
    </div>
  );
}
