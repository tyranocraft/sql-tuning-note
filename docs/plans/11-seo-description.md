# Task 11: 콘텐츠 상세 페이지 SEO description 개선

> **공통 컨텍스트:** [00-overview.md](00-overview.md)를 먼저 읽을 것.
> **의존성:**
> - Task 9 ([09-seo-deploy.md](09-seo-deploy.md)): 상세 페이지 generateMetadata 구현 완료

**배경:**

현재 콘텐츠 상세 페이지의 `generateMetadata`에서 description이 `"${content.title} (${dictionary.filter[content.difficulty]})"` 형태로 생성된다. 예를 들어 "인덱스 동작원리 (초급)"처럼 제목과 난이도만 반복하는 수준이라, 검색엔진 결과 페이지(SERP)에서 유의미한 스니펫을 제공하지 못한다.

MDX frontmatter에 `description` 필드를 추가하여, 작성자가 콘텐츠별 요약을 직접 작성할 수 있게 한다. frontmatter description이 없는 경우 기존 방식으로 폴백한다.

**파일:**
- 수정: `src/lib/types.ts` (ContentMeta에 description 필드 추가)
- 수정: `src/app/[locale]/notes/[database]/[slug]/page.tsx` (generateMetadata에서 description 활용)
- 수정: `content/mysql/ko/beginner/index-basics.mdx` (description 추가)
- 수정: `content/mysql/ko/beginner/explain-intro.mdx` (description 추가)
- 수정: `content/mysql/en/beginner/index-basics.mdx` (description 추가)
- 수정: `content/mysql/en/beginner/explain-intro.mdx` (description 추가)

- [ ] **Step 1: ContentMeta 타입에 description 필드 추가**

`src/lib/types.ts`의 `ContentMeta` 인터페이스에 선택적 필드를 추가한다:

```ts
export interface ContentMeta {
  title: string;
  slug: string;
  database: Database;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  prerequisites: string[];
  nextSteps: string[];
  part?: number;
  totalParts?: number;
  author: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}
```

- [ ] **Step 2: generateMetadata에서 description 활용**

`src/app/[locale]/notes/[database]/[slug]/page.tsx`의 `generateMetadata`에서 frontmatter description을 우선 사용하고, 없으면 기존 방식으로 폴백한다:

```tsx
const description =
  content.description ??
  `${content.title} (${dictionary.filter[content.difficulty]})`;
```

- [ ] **Step 3: 기존 MDX 콘텐츠에 description 추가**

모든 기존 MDX 파일의 frontmatter에 `description` 필드를 추가한다. 각 콘텐츠의 핵심 내용을 1~2문장으로 요약한다.

`content/mysql/ko/beginner/index-basics.mdx`:
```yaml
description: "B-Tree 인덱스의 내부 구조와 동작 원리를 이해하고, 인덱스가 쿼리 성능을 어떻게 개선하는지 학습합니다."
```

`content/mysql/ko/beginner/explain-intro.mdx`:
```yaml
description: "MySQL EXPLAIN 명령어로 실행계획을 읽는 방법을 배우고, 쿼리 최적화의 첫 단계를 시작합니다."
```

`content/mysql/en/beginner/index-basics.mdx`:
```yaml
description: "Understand the internal structure and behavior of B-Tree indexes, and learn how indexes improve query performance."
```

`content/mysql/en/beginner/explain-intro.mdx`:
```yaml
description: "Learn how to read execution plans using MySQL EXPLAIN and take the first step toward query optimization."
```

- [ ] **Step 4: 빌드 성공 확인**

```bash
npm run build
```

기대 결과: 빌드가 에러 없이 완료됨.

- [ ] **Step 5: 브라우저에서 description 확인**

```bash
npm run dev
```

확인 사항:
- /ko/notes/mysql/index-basics 페이지 소스에서 `<meta name="description">` 값이 frontmatter의 description인지 확인
- /ko/notes/mysql/explain-intro 페이지 소스에서 동일하게 확인
- OG description도 동일한 값이 적용되는지 확인

개발 서버를 중지한다.
