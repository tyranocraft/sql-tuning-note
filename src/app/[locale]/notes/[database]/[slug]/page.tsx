import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { isValidLocale, getDictionary, locales, databases } from "@/lib/i18n";
import { getContentBySlug, getAllContent } from "@/lib/content";
import { mdxComponents } from "@/components/MDXComponents";
import { DictionaryProvider } from "@/components/DictionaryProvider";
import DifficultyBadge from "@/components/DifficultyBadge";
import type { ContentMeta, Locale } from "@/lib/types";

export function generateStaticParams() {
    const params: { locale: string; database: string; slug: string }[] = [];

    for (const locale of locales) {
        for (const database of databases) {
            const contents = getAllContent(database, locale);
            for (const content of contents) {
                params.push({
                    locale,
                    database: content.database,
                    slug: content.slug,
                });
            }
        }
    }

    return params;
}

export default async function ContentDetailPage({
                                                    params,
                                                }: {
    params: Promise<{ locale: string; database: string; slug: string }>;
}) {
    const { locale, database, slug } = await params;
    if (!isValidLocale(locale)) notFound();

    const content = getContentBySlug(database, locale, slug);
    if (!content) notFound();

    const dictionary = await getDictionary(locale as Locale);
    const allContent = getAllContent(database, locale);

    const prerequisites = content.prerequisites
    .map((preSlug) => allContent.find((c) => c.slug === preSlug))
    .filter((c): c is ContentMeta => c !== undefined);

    const nextSteps = content.nextSteps
    .map((nextSlug) => allContent.find((c) => c.slug === nextSlug))
    .filter((c): c is ContentMeta => c !== undefined);

    return (
        <article className="mx-auto max-w-3xl">
            {/* 콘텐츠 헤더 */}
            <div className="mb-8">
                <div className="mb-3 flex items-center gap-2">
                    <DifficultyBadge
                        difficulty={content.difficulty}
                        dictionary={dictionary}
                        colored
                    />
                    <span className="text-xs text-gray-400">{content.category}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
            </div>

            {/* 선수 지식 */}
            {prerequisites.length > 0 && (
                <div className="mb-8 rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <p className="mb-2 text-sm font-medium text-blue-800">
                        {dictionary.content.prerequisites}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {prerequisites.map((pre) => (
                            <Link
                                key={pre.slug}
                                href={`/${locale}/notes/${database}/${pre.slug}`}
                                className="text-sm text-blue-600 underline hover:text-blue-800"
                            >
                                {pre.title}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* MDX 본문 */}
            <DictionaryProvider dictionary={dictionary}>
                <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-code:text-gray-800">
                    <MDXRemote
                        source={content.content}
                        components={mdxComponents}
                        options={{
                            mdxOptions: {
                                rehypePlugins: [
                                    [rehypePrettyCode, { theme: "github-light" }],
                                ],
                            },
                        }}
                    />
                </div>
            </DictionaryProvider>

            {/* 다음 단계 */}
            {nextSteps.length > 0 && (
                <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">
                        {dictionary.content.nextSteps}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {nextSteps.map((next) => (
                            <Link
                                key={next.slug}
                                href={`/${locale}/notes/${database}/${next.slug}`}
                                className="text-sm text-gray-600 underline hover:text-gray-900"
                            >
                                {next.title}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
