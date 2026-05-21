# Task 5: 핵심 레이아웃 및 헤더

> **공통 컨텍스트:** [00-overview.md](00-overview.md)를 먼저 읽을 것.
> **의존성:**
> - Task 4 ([04-i18n.md](04-i18n.md)): `src/lib/i18n.ts` (`getDictionary`, `isValidLocale`), `src/middleware.ts`, `src/dictionaries/{ko,en}.json`

**파일:**
- 수정: `src/app/layout.tsx`
- 생성: `src/app/[locale]/layout.tsx`
- 수정: `src/app/page.tsx`
- 생성: `src/components/Header.tsx`
- 생성: `src/components/LanguageSwitcher.tsx`

- [x] **Step 1: 루트 레이아웃 수정**

`src/app/layout.tsx` 교체:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SQL Tuning Note",
  description: "SQL query performance optimization guide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [x] **Step 2: 루트 페이지 리다이렉트 설정**

`src/app/page.tsx` 교체:

```tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/ko");
}
```

- [x] **Step 3: LanguageSwitcher 컴포넌트 생성**

`src/components/LanguageSwitcher.tsx` 생성:

```tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";

const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "EN",
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
```

- [x] **Step 4: Header 컴포넌트 생성**

`src/components/Header.tsx` 생성:

```tsx
import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/types";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary;
}

export default function Header({ locale, dictionary }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href={`/${locale}`}
            className="text-lg font-semibold text-gray-900"
          >
            SQL Tuning Note
          </Link>
          <nav className="flex gap-6">
            <Link
              href={`/${locale}/notes/mysql`}
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              {dictionary.nav.notes}
            </Link>
          </nav>
        </div>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
```

- [x] **Step 5: 로케일 레이아웃 생성**

`src/app/[locale]/layout.tsx` 생성:

```tsx
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
```

- [x] **Step 6: 로케일 페이지 플레이스홀더 생성**

`src/app/[locale]/page.tsx` 생성:

```tsx
export default function LocalePage() {
  return <div className="p-8">Landing page (coming next)</div>;
}
```

- [x] **Step 7: 브라우저에서 확인**

```bash
npm run dev
```

확인 사항:
- http://localhost:3000 접속 시 /ko로 리다이렉트
- 헤더에 "SQL Tuning Note" 로고, "학습하기" 네비게이션 링크, "EN" 언어 전환 버튼이 표시됨
- "EN" 클릭 시 URL이 /en으로 전환되며 "Learn" 네비게이션 링크와 "한국어" 버튼이 표시됨
- "한국어" 클릭 시 다시 /ko로 전환됨

개발 서버를 중지한다.

