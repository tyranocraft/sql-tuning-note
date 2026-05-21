# Task 3: 콘텐츠 로딩 유틸리티 (TDD)

> **공통 컨텍스트:** [00-overview.md](00-overview.md)를 먼저 읽을 것.
> **의존성:**
> - Task 1 ([01-project-setup.md](01-project-setup.md)): vitest 설정 (`vitest.config.ts`), 디렉토리 구조
> - Task 2 ([02-content-types.md](02-content-types.md)): `src/lib/types.ts` (`ContentMeta`, `ContentItem`, `Difficulty`), `content/mysql/{ko,en}/beginner/*.mdx`

**파일:**
- 생성: `src/lib/content.ts`
- 생성: `src/lib/content-utils.ts`
- 생성: `src/__tests__/lib/content.test.ts`

- [ ] **Step 1: 콘텐츠 로딩 실패 테스트 작성**

`src/__tests__/lib/content.test.ts` 생성:

```ts
import { describe, it, expect } from "vitest";
import { getAllContent, getContentBySlug } from "@/lib/content";
import { filterByDifficulty, searchContent } from "@/lib/content-utils";

describe("getAllContent", () => {
  it("returns all content metadata for mysql/ko", () => {
    const contents = getAllContent("mysql", "ko");
    expect(contents.length).toBe(2);
    expect(contents.map((c) => c.slug).sort()).toEqual([
      "explain-intro",
      "index-basics",
    ]);
  });

  it("returns all content metadata for mysql/en", () => {
    const contents = getAllContent("mysql", "en");
    expect(contents.length).toBe(2);
  });

  it("returns empty array for nonexistent database", () => {
    const contents = getAllContent("postgresql", "ko");
    expect(contents).toEqual([]);
  });

  it("includes correct frontmatter fields", () => {
    const contents = getAllContent("mysql", "ko");
    const indexBasics = contents.find((c) => c.slug === "index-basics");
    expect(indexBasics).toBeDefined();
    expect(indexBasics!.title).toBe("인덱스 동작원리");
    expect(indexBasics!.difficulty).toBe("beginner");
    expect(indexBasics!.database).toBe("mysql");
    expect(indexBasics!.category).toBe("index");
    expect(indexBasics!.tags).toContain("b-tree");
  });
});

describe("getContentBySlug", () => {
  it("returns content with MDX source for a valid slug", () => {
    const content = getContentBySlug("mysql", "ko", "index-basics");
    expect(content).not.toBeNull();
    expect(content!.title).toBe("인덱스 동작원리");
    expect(content!.content).toContain("인덱스란?");
  });

  it("returns null for nonexistent slug", () => {
    const content = getContentBySlug("mysql", "ko", "nonexistent");
    expect(content).toBeNull();
  });
});

describe("filterByDifficulty", () => {
  it("filters content by single difficulty", () => {
    const all = getAllContent("mysql", "ko");
    const beginners = filterByDifficulty(all, ["beginner"]);
    expect(beginners.length).toBe(2);
    beginners.forEach((c) => expect(c.difficulty).toBe("beginner"));
  });

  it("returns empty when filtering by difficulty with no matches", () => {
    const all = getAllContent("mysql", "ko");
    const advanced = filterByDifficulty(all, ["advanced"]);
    expect(advanced).toEqual([]);
  });

  it("returns all when no difficulty filter applied", () => {
    const all = getAllContent("mysql", "ko");
    const unfiltered = filterByDifficulty(all, []);
    expect(unfiltered.length).toBe(all.length);
  });
});

describe("searchContent", () => {
  it("finds content by title keyword", () => {
    const all = getAllContent("mysql", "ko");
    const results = searchContent(all, "인덱스");
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((c) => c.slug === "index-basics")).toBe(true);
  });

  it("finds content by tag", () => {
    const all = getAllContent("mysql", "ko");
    const results = searchContent(all, "explain");
    expect(results.some((c) => c.slug === "explain-intro")).toBe(true);
  });

  it("returns all content for empty query", () => {
    const all = getAllContent("mysql", "ko");
    const results = searchContent(all, "");
    expect(results.length).toBe(all.length);
  });

  it("returns empty for no match", () => {
    const all = getAllContent("mysql", "ko");
    const results = searchContent(all, "xyznonexistent");
    expect(results).toEqual([]);
  });

  it("is case-insensitive", () => {
    const all = getAllContent("mysql", "en");
    const results = searchContent(all, "INDEX");
    expect(results.some((c) => c.slug === "index-basics")).toBe(true);
  });
});
```

- [ ] **Step 2: 테스트 실행하여 실패 확인**

```bash
npm test
```

기대 결과: 모든 테스트 FAIL (함수가 정의되지 않음).

- [ ] **Step 3: 콘텐츠 로딩 유틸리티 구현**

`src/lib/content.ts` 생성 (서버 전용, `fs` 사용):

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ContentMeta, ContentItem, Difficulty } from "./types";

const contentDirectory = path.join(process.cwd(), "content");
const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];

export function getAllContent(
  database: string,
  locale: string
): ContentMeta[] {
  const contents: ContentMeta[] = [];

  for (const difficulty of difficulties) {
    const dirPath = path.join(contentDirectory, database, locale, difficulty);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      contents.push(data as ContentMeta);
    }
  }

  return contents;
}

export function getContentBySlug(
  database: string,
  locale: string,
  slug: string
): ContentItem | null {
  for (const difficulty of difficulties) {
    const dirPath = path.join(contentDirectory, database, locale, difficulty);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      if (data.slug === slug) {
        return { ...(data as ContentMeta), content };
      }
    }
  }

  return null;
}
```

`src/lib/content-utils.ts` 생성 (순수 함수, 클라이언트 컴포넌트에서 안전하게 사용 가능):

```ts
import type { ContentMeta, Difficulty } from "./types";

export function filterByDifficulty(
  contents: ContentMeta[],
  difficulties: Difficulty[]
): ContentMeta[] {
  if (difficulties.length === 0) return contents;
  return contents.filter((c) => difficulties.includes(c.difficulty));
}

export function searchContent(
  contents: ContentMeta[],
  query: string
): ContentMeta[] {
  if (!query.trim()) return contents;
  const q = query.toLowerCase();
  return contents.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}
```

- [ ] **Step 4: 테스트 실행하여 통과 확인**

```bash
npm test
```

기대 결과: 모든 테스트 PASS.

