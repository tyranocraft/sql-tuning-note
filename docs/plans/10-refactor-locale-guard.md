# Task 10: locale 검증 중복 제거 리팩터링

> **공통 컨텍스트:** [00-overview.md](00-overview.md)를 먼저 읽을 것.
> **의존성:**
> - Task 9 ([09-seo-deploy.md](09-seo-deploy.md)): 모든 page.tsx 및 generateMetadata가 구현 완료된 상태

**배경:**

`src/app/[locale]/layout.tsx`에서 `isValidLocale(locale)` 검증 + `notFound()` 호출을 이미 수행하고 있다. Next.js App Router는 layout → page 순서로 실행하므로, 하위 page.tsx에서 동일한 locale 검증은 도달 불가능한 중복 코드다. `getDictionary` 호출과 `locale as Locale` 타입 단언도 layout과 각 page에서 반복된다.

이 리팩터링은 layout에서 dictionary를 context로 내려주는 방식으로 전환하여, 하위 page에서 중복 검증과 중복 호출을 제거한다.

**파일:**
- 수정: `src/app/[locale]/layout.tsx`
- 수정: `src/app/[locale]/page.tsx`
- 수정: `src/app/[locale]/notes/[database]/page.tsx`
- 수정: `src/app/[locale]/notes/[database]/[slug]/page.tsx`
- 수정: `src/components/DictionaryProvider.tsx` (범용 context로 확장)

**변경 범위:**
- 각 page.tsx에서 `isValidLocale` + `notFound()` 제거 (layout에서 보장)
- 각 page.tsx에서 `getDictionary` 호출 제거, `DictionaryProvider` context에서 가져오기
- `locale as Locale` 타입 단언 제거 (layout에서 검증 후 typed locale을 context로 전달)

**주의:**
- `src/app/[locale]/notes/[database]/layout.tsx`의 `isValidDatabase(database)` 검증은 locale이 아닌 database 파라미터 검증이므로 유지해야 한다. (`isValidDatabase`는 `src/lib/i18n.ts`에 정의된 타입 가드 함수)
- `generateMetadata` 함수는 layout context에 접근할 수 없으므로 (서버 함수), 각 page의 `generateMetadata` 내 `isValidLocale` + `getDictionary`는 유지한다.
- Task 8에서 생성한 `DictionaryProvider`는 MDX 클라이언트 컴포넌트(Practice, Quiz)용이다. 이를 layout 레벨로 끌어올려 범용화하되, 기존 MDX 컴포넌트 동작이 깨지지 않도록 한다.

---

- [ ] **Step 1: DictionaryProvider를 layout 레벨로 확장**

`src/app/[locale]/layout.tsx`에서 `DictionaryProvider`로 `children`을 감싸고, validated locale도 함께 전달한다.

`src/components/DictionaryProvider.tsx` 수정 — locale도 context에 포함:

```tsx
"use client";

import { createContext, useContext } from "react";
import type { Dictionary, Locale } from "@/lib/types";

interface DictionaryContextValue {
  dictionary: Dictionary;
  locale: Locale;
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export function DictionaryProvider({
  dictionary,
  locale,
  children,
}: {
  dictionary: Dictionary;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={{ dictionary, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary(): Dictionary {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context.dictionary;
}

export function useLocale(): Locale {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useLocale must be used within a DictionaryProvider");
  }
  return context.locale;
}
```

`src/app/[locale]/layout.tsx` 수정 — DictionaryProvider로 children 감싸기:

```tsx
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { isValidLocale } from "@/lib/i18n";
import Header from "@/components/Header";
import { DictionaryProvider } from "@/components/DictionaryProvider";
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
      <main>
        <DictionaryProvider dictionary={dictionary} locale={locale as Locale}>
          {children}
        </DictionaryProvider>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: 각 page.tsx에서 중복 제거**

**`src/app/[locale]/page.tsx`** — Server Component이므로 `useDictionary` hook은 사용 불가. 대신 `getDictionary`를 직접 호출하되 `isValidLocale` 검증만 제거한다:

```tsx
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { getAllContent } from "@/lib/content";
import ContentCard from "@/components/ContentCard";
import type { Locale } from "@/lib/types";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const contents = getAllContent("mysql", locale);

  return (
    // ... 기존 JSX 유지
  );
}
```

**`src/app/[locale]/notes/[database]/page.tsx`** — `isValidLocale` 제거. database 검증은 `layout.tsx`에서 `isValidDatabase(database)`로 이미 처리하므로 page.tsx에서는 별도 검증 불필요:

```tsx
// 변경 전
if (!isValidLocale(locale)) notFound();

// 변경 후: 이 줄 제거. database 검증은 layout.tsx에서 isValidDatabase()로 처리
```

**`src/app/[locale]/notes/[database]/[slug]/page.tsx`** — `isValidLocale` 제거:

```tsx
// 변경 전
if (!isValidLocale(locale)) notFound();

// 변경 후: 이 줄 제거. content 존재 여부 검증(`if (!content) notFound()`)은 유지
```

- [ ] **Step 3: 기존 MDX 클라이언트 컴포넌트 호환성 확인**

Practice, Quiz 등 기존 클라이언트 컴포넌트가 `useDictionary`를 사용 중이므로, DictionaryProvider 시그니처 변경 후에도 정상 동작하는지 확인한다.

```bash
npx tsc --noEmit
npm test
npm run dev
```

확인 사항:
- 기존 MDX 상세 페이지의 Practice, Quiz 토글이 정상 동작
- 각 page에서 한/영 전환 시 dictionary가 올바르게 반영됨
- `generateMetadata`가 여전히 정상 동작 (독립적으로 getDictionary 호출)

개발 서버를 중지한다.
