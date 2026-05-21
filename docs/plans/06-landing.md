# Task 6: 랜딩 페이지

> **공통 컨텍스트:** [00-overview.md](00-overview.md)를 먼저 읽을 것.
> **의존성:**
> - Task 3 ([03-content-utils.md](03-content-utils.md)): `src/lib/content.ts` (`getAllContent`)
> - Task 5 ([05-layout-header.md](05-layout-header.md)): `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/components/Header.tsx`

**파일:**
- 수정: `src/app/[locale]/page.tsx`
- 생성: `src/components/ContentCard.tsx`

- [x] **Step 1: ContentCard 컴포넌트 생성**

`src/components/ContentCard.tsx` 생성:

```tsx
import Link from "next/link";
import type { ContentMeta, Locale, Dictionary } from "@/lib/types";

interface ContentCardProps {
  content: ContentMeta;
  locale: Locale;
  dictionary: Dictionary;
}

const difficultyColors = {
  beginner: "bg-green-50 text-green-700 border-green-200",
  intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
  advanced: "bg-red-50 text-red-700 border-red-200",
};

export default function ContentCard({
  content,
  locale,
  dictionary,
}: ContentCardProps) {
  return (
    <Link
      href={`/${locale}/notes/${content.database}/${content.slug}`}
      className="block rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyColors[content.difficulty]}`}
        >
          {dictionary.filter[content.difficulty]}
        </span>
        <span className="text-xs text-gray-400">{content.category}</span>
      </div>
      <h3 className="mb-1 font-medium text-gray-900">{content.title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {content.tags.map((tag) => (
          <span key={tag} className="text-xs text-gray-400">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
```

- [x] **Step 2: 랜딩 페이지 구현**

`src/app/[locale]/page.tsx` 교체:

```tsx
import Link from "next/link";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import { getAllContent } from "@/lib/content";
import ContentCard from "@/components/ContentCard";
import type { Locale } from "@/lib/types";
import { notFound } from "next/navigation";

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
```

- [x] **Step 3: 브라우저에서 확인**

```bash
npm run dev
```

확인 사항:
- /ko 에서 한국어 히어로 텍스트, CTA 버튼, 콘텐츠 카드 2개가 표시됨
- /en 에서 영어 히어로 텍스트와 영어 콘텐츠 카드가 표시됨
- CTA 클릭 시 /ko/notes/mysql (또는 /en/notes/mysql)로 이동
- 콘텐츠 카드에 난이도 뱃지, 카테고리, 제목, 태그가 표시됨

개발 서버를 중지한다.

