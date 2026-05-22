# Task 8: 콘텐츠 상세 페이지 (MDX 렌더링, 실전문제, 퀴즈)

> **공통 컨텍스트:** [00-overview.md](00-overview.md)를 먼저 읽을 것.
> **의존성:**
> - Task 3 ([03-content-utils.md](03-content-utils.md)): `src/lib/content.ts` (`getContentBySlug`, `getAllContent`)
> - Task 4 ([04-i18n.md](04-i18n.md)): `src/lib/i18n.ts` (`getDictionary`, `isValidLocale`), `src/lib/types.ts` (`Dictionary`)
> - Task 7 ([07-browse.md](07-browse.md)): `src/app/[locale]/notes/[database]/layout.tsx` (Notes 레이아웃), `src/components/Sidebar.tsx`

**파일:**
- 생성: `src/components/DictionaryProvider.tsx`
- 생성: `src/components/ToggleSection.tsx` (Hint/Answer 공통 토글 컴포넌트)
- 생성: `src/components/DifficultyBadge.tsx` (난이도 배지 공통 컴포넌트)
- 생성: `src/components/Practice.tsx`
- 생성: `src/components/Quiz.tsx`
- 생성: `src/components/MDXComponents.tsx`
- 생성: `src/app/[locale]/notes/[database]/[slug]/page.tsx`
- 수정: `src/components/Sidebar.tsx` (클라이언트 컴포넌트로 변경)
- 수정: `src/components/ContentCard.tsx` (`DifficultyBadge` 공통 컴포넌트 적용)

- [x] **Step 1: DictionaryProvider 컨텍스트 생성**

MDX 내부의 클라이언트 컴포넌트(Practice, Quiz)에서 사전 문자열에 접근할 수 있도록 React Context를 생성한다.

`src/components/DictionaryProvider.tsx` 생성:

```tsx
"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "@/lib/types";

const DictionaryContext = createContext<Dictionary | null>(null);

export function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary(): Dictionary {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
}
```

- [x] **Step 2: ToggleSection 공통 컴포넌트 및 Practice 토글 컴포넌트 생성**

`Hint`와 `Answer`는 동일한 토글 패턴(useState + 버튼 + children 표시)을 공유하므로 `ToggleSection` 공통 컴포넌트로 분리한다.

`src/components/ToggleSection.tsx` 생성:

```tsx
"use client";

import { useState } from "react";

export default function ToggleSection({
  showLabel,
  hideLabel,
  buttonClassName,
  className,
  children,
}: {
  showLabel: string;
  hideLabel: string;
  buttonClassName: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setOpen(!open)}
        className={`text-sm font-medium ${buttonClassName}`}
      >
        {open ? hideLabel : showLabel}
      </button>
      {open && (
        <div className="mt-3 prose prose-sm max-w-none">{children}</div>
      )}
    </div>
  );
}
```

`src/components/Practice.tsx` 생성:

```tsx
"use client";

import { useDictionary } from "./DictionaryProvider";
import ToggleSection from "./ToggleSection";

export function Practice({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-gray-200 bg-gray-50">
      {children}
    </div>
  );
}

export function Problem({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-200 p-5">
      <div className="prose prose-sm max-w-none text-gray-700">{children}</div>
    </div>
  );
}

export function Hint({ children }: { children: React.ReactNode }) {
  const dict = useDictionary();

  return (
    <ToggleSection
      showLabel={dict.content.showHint}
      hideLabel={dict.content.hideHint}
      buttonClassName="text-blue-600 hover:text-blue-800"
      className="border-b border-gray-200 px-5 py-3"
    >
      <div className="text-gray-600">{children}</div>
    </ToggleSection>
  );
}

export function Answer({ children }: { children: React.ReactNode }) {
  const dict = useDictionary();

  return (
    <ToggleSection
      showLabel={dict.content.showAnswer}
      hideLabel={dict.content.hideAnswer}
      buttonClassName="text-green-600 hover:text-green-800"
      className="px-5 py-3"
    >
      <div className="text-gray-700">{children}</div>
    </ToggleSection>
  );
}
```

- [x] **Step 3: Quiz 컴포넌트 생성**

`src/components/Quiz.tsx` 생성:

주의: `optionIndex`를 모듈 레벨 변수로 사용하면 렌더 간에 값이 유지되는 버그가 발생한다. 대신 `React.Children`을 통해 `index` prop을 주입하는 방식을 사용한다.

```tsx
"use client";

import { useState, createContext, useContext } from "react";
import { useDictionary } from "./DictionaryProvider";

interface QuizContextValue {
  selected: number | null;
  setSelected: (index: number) => void;
  revealed: boolean;
}

const QuizContext = createContext<QuizContextValue>({
  selected: null,
  setSelected: () => {},
  revealed: false,
});

export function Quiz({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const dict = useDictionary();

  return (
    <QuizContext.Provider value={{ selected, setSelected, revealed }}>
      <div className="my-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
        <p className="mb-4 text-sm text-gray-700">{question}</p>
        <div className="mb-4 space-y-2">{children}</div>
        {selected !== null && !revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {dict.content.checkAnswer}
          </button>
        )}
      </div>
    </QuizContext.Provider>
  );
}

export function Option({
  children,
  correct,
  index,
}: {
  children: React.ReactNode;
  correct?: boolean;
  index: number;
}) {
  const { selected, setSelected, revealed } = useContext(QuizContext);
  const isSelected = selected === index;

  let className =
    "flex w-full items-center gap-3 rounded border px-4 py-2.5 text-left text-sm transition-colors ";

  if (revealed && correct) {
    className += "border-green-300 bg-green-50 text-green-800";
  } else if (revealed && isSelected && !correct) {
    className += "border-red-300 bg-red-50 text-red-800";
  } else if (isSelected) {
    className += "border-gray-400 bg-white text-gray-900";
  } else {
    className += "border-gray-200 bg-white text-gray-600 hover:border-gray-300";
  }

  return (
    <button
      onClick={() => !revealed && setSelected(index)}
      disabled={revealed}
      className={className}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
          isSelected
            ? "border-gray-400 bg-gray-900 text-white"
            : "border-gray-300"
        }`}
      >
        {isSelected && "●"}
      </span>
      {children}
    </button>
  );
}
```

`index` prop은 MDXComponents 매핑에서 주입된다 (Step 4 참고).

- [x] **Step 4: MDX 컴포넌트 매핑 생성**

`src/components/MDXComponents.tsx` 생성:

```tsx
import React from "react";
import { Practice, Problem, Hint, Answer } from "./Practice";
import { Quiz, Option } from "./Quiz";

function WrappedQuiz({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  const indexedChildren = React.Children.map(children, (child, i) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { index: i } as Record<string, unknown>);
    }
    return child;
  });

  return <Quiz question={question}>{indexedChildren}</Quiz>;
}

export const mdxComponents = {
  Practice,
  Problem,
  Hint,
  Answer,
  Quiz: WrappedQuiz,
  Option,
};
```

- [x] **Step 5: DifficultyBadge 공통 컴포넌트 및 콘텐츠 상세 페이지 생성**

난이도 배지는 `ContentCard`와 상세 페이지에서 공통으로 사용되므로 `DifficultyBadge` 공통 컴포넌트로 분리한다.

`src/components/DifficultyBadge.tsx` 생성:

```tsx
import type { Difficulty, Dictionary } from "@/lib/types";

const coloredStyles: Record<Difficulty, string> = {
  beginner: "bg-green-50 text-green-700 border-green-200",
  intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
  advanced: "bg-red-50 text-red-700 border-red-200",
};

const neutralStyle = "bg-gray-100 text-gray-600 border-gray-100";

export default function DifficultyBadge({
  difficulty,
  dictionary,
  colored = false,
}: {
  difficulty: Difficulty;
  dictionary: Dictionary;
  colored?: boolean;
}) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        colored ? coloredStyles[difficulty] : neutralStyle
      }`}
    >
      {dictionary.filter[difficulty]}
    </span>
  );
}
```

`src/components/ContentCard.tsx`에서 기존 `difficultyBadgeColors` 상수와 인라인 `<span>`을 `DifficultyBadge` 컴포넌트로 교체한다.

`src/app/[locale]/notes/[database]/[slug]/page.tsx` 생성:

- `generateStaticParams`에서 `locales`, `databases` 상수를 사용하여 mysql과 postgresql 모두 정적 경로를 생성한다.
- `prerequisites`, `nextSteps` 배열에서 `.filter((c): c is ContentMeta => c !== undefined)` 타입 가드를 사용하여 non-null assertion(`!`)을 제거한다.
- 난이도 배지에 `DifficultyBadge` 공통 컴포넌트를 사용한다.

```tsx
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
```

- [x] **Step 6: Sidebar에 현재 슬러그 하이라이트 기능 추가**

Sidebar는 현재 보고 있는 토픽을 하이라이트해야 한다. 레이아웃에서는 slug 파라미터에 접근할 수 없으므로, Sidebar를 클라이언트 컴포넌트로 변경하고 `usePathname()`으로 현재 슬러그를 추출한다.

`src/components/Sidebar.tsx`를 아래 내용으로 교체 — `"use client"` 추가 및 `usePathname` 사용:

목록 페이지(`/ko/notes/mysql`)에서 `pathname.split("/").pop()`이 `"mysql"`을 반환하여 의도치 않은 하이라이트가 발생할 수 있으므로, 세그먼트 수로 상세 페이지 여부를 판별한다.

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ContentMeta, Locale, Dictionary, Difficulty } from "@/lib/types";

interface SidebarProps {
  contents: ContentMeta[];
  locale: Locale;
  database: string;
  dictionary: Dictionary;
}

const difficultyOrder: Difficulty[] = ["beginner", "intermediate", "advanced"];

export default function Sidebar({
  contents,
  locale,
  database,
  dictionary,
}: SidebarProps) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  // /[locale]/notes/[database]/[slug] → 5 segments
  const currentSlug = segments.length >= 5 ? segments[4] : undefined;

  const grouped = difficultyOrder
    .map((difficulty) => ({
      difficulty,
      label: dictionary.filter[difficulty],
      items: contents.filter((c) => c.difficulty === difficulty),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
      <nav className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        {grouped.map((group) => (
          <div key={group.difficulty} className="mb-6">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {group.label}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${locale}/notes/${database}/${item.slug}`}
                    className={`block rounded px-3 py-1.5 text-sm transition-colors ${
                      currentSlug === item.slug
                        ? "bg-gray-100 font-medium text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
```

인터페이스에서 `currentSlug` prop을 제거한다 (이제 pathname에서 자동으로 추출). 레이아웃에서 Sidebar를 사용하는 곳에서도 `currentSlug` prop 전달이 불필요하다.

- [x] **Step 7: 브라우저에서 확인**

```bash
npm run dev
```

확인 사항:
- /ko/notes/mysql/index-basics 에서 구문 하이라이팅이 적용된 MDX 콘텐츠가 표시됨
- 좌측 사이드바에서 "인덱스 동작원리"가 활성 상태로 하이라이트됨
- explain-intro 페이지에 선수 지식 링크(index-basics로 연결)가 표시됨
- index-basics 페이지에 다음 단계 링크(explain-intro로 연결)가 표시됨
- 실전문제 섹션: "힌트 보기" 클릭 시 힌트 텍스트 토글, "정답 보기" 클릭 시 정답 토글 (한국어 페이지)
- 퀴즈 섹션: 선택지 클릭으로 선택, "정답 확인" 클릭 시 정답/오답 표시 (한국어 페이지)
- /en 에서는 "Show Hint", "Show Answer", "Check Answer"로 영어 표시 확인
- /en/notes/mysql/index-basics 에서 영어 버전 정상 표시
- 사이드바를 통한 토픽 간 이동 시 콘텐츠와 활성 하이라이트가 업데이트됨

개발 서버를 중지한다.

