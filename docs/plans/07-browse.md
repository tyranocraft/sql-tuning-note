# Task 7: 콘텐츠 목록 페이지 (사이드바, 필터, 검색)

> **공통 컨텍스트:** [00-overview.md](00-overview.md)를 먼저 읽을 것.
> **의존성:**
> - Task 3 ([03-content-utils.md](03-content-utils.md)): `src/lib/content.ts` (`getAllContent`), `src/lib/content-utils.ts` (`filterByDifficulty`, `searchContent`)
> - Task 5 ([05-layout-header.md](05-layout-header.md)): `src/app/[locale]/layout.tsx` (로케일 레이아웃, Header)

**파일:**
- 생성: `src/app/[locale]/notes/[database]/layout.tsx`
- 생성: `src/app/[locale]/notes/[database]/page.tsx`
- 생성: `src/components/Sidebar.tsx`
- 생성: `src/components/DifficultyFilter.tsx`
- 생성: `src/components/SearchBar.tsx`
- 생성: `src/components/ContentList.tsx`

- [x] **Step 1: Sidebar 컴포넌트 생성**

`src/components/Sidebar.tsx` 생성:

```tsx
import Link from "next/link";
import type { ContentMeta, Locale, Dictionary, Difficulty } from "@/lib/types";

interface SidebarProps {
  contents: ContentMeta[];
  locale: Locale;
  database: string;
  dictionary: Dictionary;
  currentSlug?: string;
}

const difficultyOrder: Difficulty[] = ["beginner", "intermediate", "advanced"];

export default function Sidebar({
  contents,
  locale,
  database,
  dictionary,
  currentSlug,
}: SidebarProps) {
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

- [x] **Step 2: DifficultyFilter 컴포넌트 생성**

`src/components/DifficultyFilter.tsx` 생성:

```tsx
"use client";

import type { Difficulty, Dictionary } from "@/lib/types";

interface DifficultyFilterProps {
  selected: Difficulty[];
  onChange: (difficulties: Difficulty[]) => void;
  dictionary: Dictionary;
}

const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];

const difficultyToggleColors = {
  beginner: {
    active: "bg-green-100 text-green-800 border-green-300",
    inactive: "border-gray-200 text-gray-500 hover:border-gray-300",
  },
  intermediate: {
    active: "bg-yellow-100 text-yellow-800 border-yellow-300",
    inactive: "border-gray-200 text-gray-500 hover:border-gray-300",
  },
  advanced: {
    active: "bg-red-100 text-red-800 border-red-300",
    inactive: "border-gray-200 text-gray-500 hover:border-gray-300",
  },
};

export default function DifficultyFilter({
  selected,
  onChange,
  dictionary,
}: DifficultyFilterProps) {
  function toggle(difficulty: Difficulty) {
    if (selected.includes(difficulty)) {
      onChange(selected.filter((d) => d !== difficulty));
    } else {
      onChange([...selected, difficulty]);
    }
  }

  return (
    <div className="flex gap-2">
      {difficulties.map((d) => {
        const isActive = selected.includes(d);
        return (
          <button
            key={d}
            onClick={() => toggle(d)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
              isActive
                ? difficultyToggleColors[d].active
                : difficultyToggleColors[d].inactive
            }`}
          >
            {dictionary.filter[d]}
          </button>
        );
      })}
    </div>
  );
}
```

- [x] **Step 3: SearchBar 컴포넌트 생성**

`src/components/SearchBar.tsx` 생성:

```tsx
"use client";

import type { Dictionary } from "@/lib/types";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  dictionary: Dictionary;
}

export default function SearchBar({
  value,
  onChange,
  dictionary,
}: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={dictionary.search.placeholder}
      className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400"
    />
  );
}
```

- [x] **Step 4: ContentList 클라이언트 컴포넌트 생성**

`src/components/ContentList.tsx` 생성:

```tsx
"use client";

import { useState } from "react";
import { filterByDifficulty, searchContent } from "@/lib/content-utils";
import type { ContentMeta, Locale, Dictionary, Difficulty } from "@/lib/types";
import ContentCard from "./ContentCard";
import DifficultyFilter from "./DifficultyFilter";
import SearchBar from "./SearchBar";

interface ContentListProps {
  contents: ContentMeta[];
  locale: Locale;
  dictionary: Dictionary;
}

export default function ContentList({
  contents,
  locale,
  dictionary,
}: ContentListProps) {
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    Difficulty[]
  >([]);
  const [query, setQuery] = useState("");

  const filtered = searchContent(
    filterByDifficulty(contents, selectedDifficulties),
    query
  );

  return (
    <div>
      <div className="mb-6 space-y-4">
        <SearchBar value={query} onChange={setQuery} dictionary={dictionary} />
        <DifficultyFilter
          selected={selectedDifficulties}
          onChange={setSelectedDifficulties}
          dictionary={dictionary}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((content) => (
            <ContentCard
              key={content.slug}
              content={content}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-gray-500">
          {dictionary.search.noResults}
        </p>
      )}
    </div>
  );
}
```

- [x] **Step 5: 사이드바를 포함한 Notes 레이아웃 생성**

`src/app/[locale]/notes/[database]/layout.tsx` 생성:

```tsx
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
```

- [x] **Step 6: 콘텐츠 목록 페이지 생성**

`src/app/[locale]/notes/[database]/page.tsx` 생성:

```tsx
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
```

- [x] **Step 7: 브라우저에서 확인**

```bash
npm run dev
```

확인 사항:
- /ko/notes/mysql 에서 좌측에 난이도별로 그룹핑된 토픽 사이드바가 표시됨
- 우측에 검색창, 난이도 필터 버튼, 콘텐츠 카드가 표시됨
- 난이도 필터 클릭 시 해당 난이도의 콘텐츠만 표시/숨김
- 검색창에 입력 시 제목/태그/카테고리 기반으로 필터링됨
- "초급" 필터 클릭 시 초급 콘텐츠만 표시됨
- "인덱스" 검색 시 index-basics 콘텐츠만 표시됨
- 검색 결과가 없을 때 "검색 결과가 없습니다" 메시지 표시
- /en/notes/mysql 에서 영어 버전이 정상 표시됨

개발 서버를 중지한다.

- [x] **Step 8: ContentList 컴포넌트 테스트 작성**

`src/__tests__/components/ContentList.test.tsx` 생성:

- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` 설치
- ContentList 렌더링/인터랙션 테스트 6건:
  - 모든 콘텐츠 카드를 렌더링한다
  - 검색어 입력 시 일치하는 콘텐츠만 표시한다
  - 난이도 필터 클릭 시 해당 난이도 콘텐츠만 표시한다
  - 검색 결과가 없을 때 안내 메시지를 표시한다
  - 난이도 필터와 검색을 조합하여 필터링한다
  - 난이도 필터를 다시 클릭하면 해제된다

