# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드를 다룰 때 참고하는 가이드다.

## 작업 규칙

### 언어

- 사용자와의 대화 및 문서 작성은 한국어를 기본으로 한다

### Git / 브랜치

- `git add`, `git commit` 등 커밋 관련 명령은 실행하지 않는다. 커밋은 사용자가 코드 리뷰 후 직접 수행한다.
- Task별 작업은 `master` 브랜치에서 별도 feature 브랜치를 생성한 뒤 진행한다. 브랜치 이름은 `feat/{task-name}` 형식이며, `{task-name}`은 `docs/plans/` 하위 Task 문서 파일명에서 번호 접두사를 제거한 값이다.
  - 예: `docs/plans/09-seo-deploy.md` → `feat/seo-deploy`

### 문서

- 구현 전 반드시 관련 문서를 참고할 것 (아래 "문서 참조" 섹션)
- Task 문서의 각 Step 완료 시, 문서에 명시된 작업내용과 실제 결과물(생성된 파일, 코드 내용 등)을 비교하여 일치하면 해당 Step의 체크박스를 `[x]`로 변경한다.

### 컴포넌트

- 신규 React 컴포넌트 생성 시, 공용 컴포넌트로 추출할 수 있는지 먼저 판단한다. 재사용 가능한 UI 요소는 `src/components/`에 공용 컴포넌트로 분리하여 중복 코드를 방지한다.
- 기존 컴포넌트와 동일하거나 유사한 UI 패턴이 발견되면 공용 컴포넌트로 통합을 제안한다.
- Task 완료 후, 기존 컴포넌트와 신규 컴포넌트를 포함하여 공용 컴포넌트로 분리할 수 있는 중복 패턴이 있는지 점검한다. 분리 대상이 있으면 공용 컴포넌트로 추출하여 적용한다.

### 테스트

- Vitest 테스트 작성 시, `describe`와 `it`의 설명 문자열은 한글로 작성한다. `describe`는 테스트 대상 함수명/모듈명을 그대로 사용하되, `it`의 설명은 `"mysql/ko의 모든 콘텐츠 메타데이터를 반환한다"`처럼 행위를 한글로 서술한다.
- 테스트 코드는 given-when-then 패턴으로 작성한다. 각 영역은 `// given`, `// when`, `// then` 주석으로 구분한다. given에는 테스트 전제 조건(입력값, 사전 상태), when에는 실행할 동작, then에는 기대 결과 검증을 배치한다.

## 문서 참조

- `docs/PRD.md` — 제품 요구사항 정의서
- `docs/plans/` — 구현 계획서 (Task별 분할). `00-overview.md`가 공통 컨텍스트 및 Task 의존성 테이블을 포함한다.
- `docs/architecture.md` — Mermaid 기반 시스템 아키텍처 다이어그램

## 프로젝트 개요

SQL Tuning Note는 SQL 쿼리 성능 최적화(MySQL/PostgreSQL)를 위한 오픈소스 교육 웹서비스다. 콘텐츠는 난이도별(초급/중급/고급)로 구성되며, 한국어와 영어로 제공된다.

## 기술 스택

- **Framework:** Next.js 15 (App Router) + TypeScript
- **콘텐츠:** `gray-matter` + `next-mdx-remote/rsc`로 관리하는 MDX 파일
- **렌더링:** SSG (Static Site Generation) — 데이터베이스 없음
- **스타일링:** Tailwind CSS
- **코드 하이라이팅:** rehype-pretty-code + shiki
- **테스트:** Vitest + jsdom
- **배포:** Vercel

## 주요 명령어

```bash
npm run dev          # 개발 서버 실행 (Turbopack)
npm run build        # 프로덕션 빌드 (SSG)
npm test             # 테스트 1회 실행 (vitest run)
npm run test:watch   # 테스트 watch 모드 실행 (vitest)
```

## 아키텍처

### 콘텐츠 파이프라인

모든 콘텐츠는 `content/` 하위의 MDX 파일로 관리된다. 빌드 시 `gray-matter`가 frontmatter를 파싱하고, `next-mdx-remote/rsc`가 MDX를 React Server Component로 렌더링한다.

```
content/{database}/{locale}/{difficulty}/{slug}.mdx
  예: content/mysql/ko/beginner/index-basics.mdx
```

콘텐츠 유틸리티는 두 모듈로 분리되어 있다:
- `src/lib/content.ts` — 서버 전용 (`fs` 사용): `getAllContent()`, `getContentBySlug()`
- `src/lib/content-utils.ts` — 클라이언트 컴포넌트에서도 안전한 순수 함수: `filterByDifficulty()`, `searchContent()`

### 라우팅 (i18n)

`[locale]` 동적 세그먼트를 활용한 URL 기반 로케일 라우팅. 미들웨어가 로케일 없는 경로를 `/ko/...` (기본 로케일)로 리다이렉트한다.

```
/[locale]                              → 랜딩 페이지
/[locale]/notes/[database]             → 콘텐츠 목록 (필터 + 검색)
/[locale]/notes/[database]/[slug]      → 콘텐츠 상세 (MDX 렌더링)
```

### MDX 커스텀 컴포넌트

MDX 콘텐츠는 `src/components/MDXComponents.tsx`에 매핑된 인터랙티브 컴포넌트를 사용한다:
- `<Practice>`, `<Problem>`, `<Hint>`, `<Answer>` — 토글 기반 실전문제
- `<Quiz>`, `<Option>` — 객관식 퀴즈 (정답 확인 토글)

이 클라이언트 컴포넌트들은 `DictionaryProvider` 컨텍스트를 통해 i18n 문자열에 접근한다.

### MDX Frontmatter 스키마

```yaml
title: string
slug: string
database: "mysql" | "postgresql"
difficulty: "beginner" | "intermediate" | "advanced"
category: string
tags: string[]
prerequisites: string[]   # 선수 지식 콘텐츠의 slug 목록
nextSteps: string[]        # 다음 단계 콘텐츠의 slug 목록
author: string
createdAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
```

## 디자인 원칙

- **Clean & Professional** — 라이트 테마, 가독성 높은 타이포그래피, 최소한의 UI
- **No AI Slop** — 다크 테마, 보라색 그라데이션, 과도한 이모지 사용 금지
- **레퍼런스:** LeetCode Explore 레이아웃 스타일
