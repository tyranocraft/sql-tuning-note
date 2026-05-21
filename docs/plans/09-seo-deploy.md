# Task 9: SEO 및 배포

> **공통 컨텍스트:** [00-overview.md](00-overview.md)를 먼저 읽을 것.
> **의존성:**
> - Task 5 ([05-layout-header.md](05-layout-header.md)): `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`
> - Task 6 ([06-landing.md](06-landing.md)): `src/app/[locale]/page.tsx`
> - Task 7 ([07-browse.md](07-browse.md)): `src/app/[locale]/notes/[database]/page.tsx`
> - Task 8 ([08-detail.md](08-detail.md)): `src/app/[locale]/notes/[database]/[slug]/page.tsx`

**파일:**
- 수정: `src/app/layout.tsx` (메타데이터)
- 수정: `src/app/[locale]/page.tsx` (generateMetadata)
- 수정: `src/app/[locale]/notes/[database]/page.tsx` (generateMetadata)
- 수정: `src/app/[locale]/notes/[database]/[slug]/page.tsx` (generateMetadata)
- 생성: `src/app/sitemap.ts`
- 생성: `src/app/robots.ts`

- [ ] **Step 1: 랜딩 페이지에 generateMetadata 추가**

`src/app/[locale]/page.tsx`의 default export 앞에 추가:

```tsx
import type { Metadata } from "next";

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
```

- [ ] **Step 2: 콘텐츠 목록 페이지에 generateMetadata 추가**

`src/app/[locale]/notes/[database]/page.tsx`에 추가:

```tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; database: string }>;
}): Promise<Metadata> {
  const { locale, database } = await params;
  if (!isValidLocale(locale)) return {};

  const dictionary = await getDictionary(locale as Locale);
  const title = `${database.toUpperCase()} — ${dictionary.site.title}`;

  return {
    title,
    description: dictionary.site.description,
    openGraph: { title, description: dictionary.site.description },
    twitter: { card: "summary", title },
  };
}
```

- [ ] **Step 3: 콘텐츠 상세 페이지에 generateMetadata 추가**

`src/app/[locale]/notes/[database]/[slug]/page.tsx`에 추가:

```tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; database: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, database, slug } = await params;
  if (!isValidLocale(locale)) return {};

  const content = getContentBySlug(database, locale, slug);
  if (!content) return {};

  const dictionary = await getDictionary(locale as Locale);
  const title = `${content.title} — ${dictionary.site.title}`;
  const description = `${content.title} (${dictionary.filter[content.difficulty]})`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    keywords: content.tags,
  };
}
```

- [ ] **Step 4: sitemap 생성**

`src/app/sitemap.ts` 생성:

```ts
import { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sql-tuning-note.vercel.app";
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of ["ko", "en"]) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });

    entries.push({
      url: `${baseUrl}/${locale}/notes/mysql`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    const contents = getAllContent("mysql", locale);
    for (const content of contents) {
      entries.push({
        url: `${baseUrl}/${locale}/notes/mysql/${content.slug}`,
        lastModified: new Date(content.updatedAt),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
```

- [ ] **Step 5: robots.txt 생성**

`src/app/robots.ts` 생성:

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sql-tuning-note.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 6: 루트 레이아웃에 lang 속성 설정**

`<html>` 태그에 동적 `lang` 속성이 필요하다. 루트 레이아웃은 `[locale]` 세그먼트 상위에 있어 직접 locale 값에 접근할 수 없다. SEO를 위해 `<html>`과 `<body>` 태그를 로케일 레이아웃으로 이동하는 방식을 사용한다.

`src/app/layout.tsx` 수정:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

`src/app/[locale]/layout.tsx` 수정:

```tsx
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/lib/i18n";
import Header from "@/components/Header";
import type { Locale } from "@/lib/types";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dictionary = await getDictionary(locale as Locale);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="min-h-screen bg-white">
          <Header locale={locale as Locale} dictionary={dictionary} />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 7: 빌드 성공 확인**

```bash
npm run build
```

기대 결과: 빌드가 에러 없이 완료되고, 모든 정적 페이지가 생성됨.

- [ ] **Step 8: 브라우저에서 SEO 확인**

```bash
npm run dev
```

확인 사항:
- /ko 페이지 소스 보기에서 `<html lang="ko">`, `<title>`, OG `<meta>` 태그 확인
- /ko/notes/mysql/index-basics 페이지 소스에서 콘텐츠별 title 및 OG 태그 확인
- /sitemap.xml 접속 시 모든 페이지가 목록에 포함되어 있는지 확인
- /robots.txt 접속 시 내용 확인

개발 서버를 중지한다.

- [ ] **Step 9: 커밋**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/app/layout.tsx src/app/[locale]/layout.tsx src/app/[locale]/page.tsx src/app/[locale]/notes/
git commit -m "feat: add SEO metadata, sitemap, and robots.txt"
```

- [ ] **Step 10: Vercel 배포**

Vercel CLI를 사용하는 경우:

```bash
npx vercel --prod
```

또는 Git 저장소를 Vercel 대시보드에 연결하여 배포한다.

배포된 사이트 확인:
- 랜딩 페이지가 정상 로드됨
- 콘텐츠 페이지에 구문 하이라이팅이 적용되어 렌더링됨
- 언어 전환이 정상 동작함
- 모든 MVP 완료 기준을 충족함

- [ ] **Step 11: 최종 커밋 (배포 설정 변경이 있는 경우)**

```bash
git add .
git commit -m "chore: configure Vercel deployment"
```
