# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드를 다룰 때 참고하는 가이드다.

## 작업 규칙

- 사용자와의 대화 및 문서 작성은 한국어를 기본으로 한다
- 구현 계획서는 `docs/plans/`에 Task별로 분할되어 있다 — `00-overview.md`(공통 컨텍스트) + `01`~`09` Task 파일
- 원본 통합 계획서: `docs/superpowers/plans/2026-05-19-sql-tuning-note-mvp.md`

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
