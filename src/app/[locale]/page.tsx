import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary, isValidLocale, locales } from "@/lib/i18n";
import { getAllContent } from "@/lib/content";
import ContentCard from "@/components/ContentCard";
import type { Locale } from "@/lib/types";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const dictionary = await getDictionary(locale as Locale);

  return {
    title: dictionary.site.title,
    description: dictionary.site.description,
    openGraph: {
      title: dictionary.site.title,
      description: dictionary.site.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.site.title,
      description: dictionary.site.description,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dictionary = await getDictionary(locale as Locale);
  const contents = getAllContent("mysql", locale);

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="border-b border-gray-100 bg-gray-50 px-4 py-20 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 whitespace-pre-line">
          {dictionary.landing.hero.title}
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600">
          {dictionary.landing.hero.subtitle}
        </p>
        <Link
          href={`/${locale}/notes/mysql`}
          className="inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          {dictionary.landing.hero.cta}
        </Link>
      </section>

      {/* 콘텐츠 미리보기 */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-900">
          MySQL
        </h2>
        {contents.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {contents.map((content) => (
              <ContentCard
                key={content.slug}
                content={content}
                locale={locale as Locale}
                dictionary={dictionary}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No content yet.</p>
        )}
      </section>
    </div>
  );
}
