# SQL Tuning Note MVP — 공통 컨텍스트

> **For agentic workers:** 이 파일은 모든 Task에서 공유하는 공통 컨텍스트다. 각 Task 파일과 함께 읽어야 한다.

> REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**목표:** MDX 콘텐츠, 난이도 기반 필터링, 키워드 검색, 한/영 이중 언어, 텍스트 기반 실전문제/퀴즈 토글을 갖춘 오픈소스 SQL 튜닝 교육 웹서비스를 구축한다.

**아키텍처:** Next.js App Router + SSG 기반. `content/` 디렉토리에 database/locale/difficulty 구조로 MDX 파일을 관리한다. 빌드 타임에 `gray-matter` + `next-mdx-remote/rsc`로 콘텐츠를 로딩하고, Browse 페이지에서 클라이언트 사이드 필터링 및 검색을 수행한다. URL 기반 i18n 라우팅 (`/ko/...`, `/en/...`).

**기술 스택:** Next.js 15 (App Router), TypeScript, Tailwind CSS, MDX, next-mdx-remote, gray-matter, rehype-pretty-code, shiki, Vitest

---

## 파일 구조

```
sql-tuning-note/
├── content/
│   └── mysql/
│       ├── ko/
│       │   └── beginner/
│       │       ├── index-basics.mdx
│       │       └── explain-intro.mdx
│       └── en/
│           └── beginner/
│               ├── index-basics.mdx
│               └── explain-intro.mdx
├── src/
│   ├── app/
│   │   ├── layout.tsx                          # 루트 레이아웃 (html, body, 폰트, Tailwind)
│   │   ├── page.tsx                            # 루트 리다이렉트 → /ko
│   │   └── [locale]/
│   │       ├── layout.tsx                      # 로케일 레이아웃 (Header 포함)
│   │       ├── page.tsx                        # 랜딩 페이지
│   │       └── notes/
│   │           └── [database]/
│   │               ├── layout.tsx              # Notes 레이아웃 (Sidebar 포함)
│   │               ├── page.tsx                # 콘텐츠 목록 페이지 (필터 + 검색)
│   │               └── [slug]/
│   │                   └── page.tsx            # 콘텐츠 상세 페이지
│   ├── components/
│   │   ├── Header.tsx                          # 사이트 헤더 (네비게이션 + 언어 전환)
│   │   ├── LanguageSwitcher.tsx                # 한/영 전환 토글 (클라이언트 컴포넌트)
│   │   ├── Sidebar.tsx                         # 난이도별 그룹핑 토픽 네비게이션
│   │   ├── ContentCard.tsx                     # 콘텐츠 목록용 토픽 카드
│   │   ├── ContentList.tsx                     # 클라이언트 컴포넌트: 필터 + 검색 + 카드 목록
│   │   ├── DifficultyFilter.tsx                # 난이도 필터 버튼 (클라이언트 컴포넌트)
│   │   ├── SearchBar.tsx                       # 키워드 검색 입력창 (클라이언트 컴포넌트)
│   │   ├── Practice.tsx                        # 실전문제 토글: 문제 → 힌트 → 정답
│   │   ├── Quiz.tsx                            # 퀴즈 토글: 질문 → 선택지 → 정답
│   │   ├── MDXComponents.tsx                   # 커스텀 MDX 컴포넌트 매핑
│   │   └── DictionaryProvider.tsx              # 사전 컨텍스트 (클라이언트 컴포넌트에 사전 전달)
│   ├── lib/
│   │   ├── content.ts                          # MDX 로딩 (서버 전용, fs 사용)
│   │   ├── content-utils.ts                    # 필터링, 검색 (순수 함수, 클라이언트 안전)
│   │   └── types.ts                            # TypeScript 타입 정의
│   └── dictionaries/
│       ├── ko.json                             # 한국어 UI 문자열
│       └── en.json                             # 영어 UI 문자열
├── src/__tests__/
│   └── lib/
│       └── content.test.ts                     # 콘텐츠 유틸리티 테스트
├── vitest.config.ts
├── next.config.ts
├── tailwind.config.ts                          # (Tailwind v3인 경우; v4는 CSS 기반 설정)
├── tsconfig.json
└── package.json
```

---

## Task 목록 및 의존성

| Task | 파일 | 의존성 |
|------|------|--------|
| [01-project-setup.md](01-project-setup.md) | 프로젝트 초기 설정 | 없음 |
| [02-content-types.md](02-content-types.md) | 콘텐츠 타입 정의 및 샘플 MDX | 없음 |
| [03-content-utils.md](03-content-utils.md) | 콘텐츠 로딩 유틸리티 (TDD) | Task 1, 2 |
| [04-i18n.md](04-i18n.md) | i18n 설정 | Task 2 (types.ts) |
| [05-layout-header.md](05-layout-header.md) | 핵심 레이아웃 및 헤더 | Task 4 |
| [06-landing.md](06-landing.md) | 랜딩 페이지 | Task 3, 5 |
| [07-browse.md](07-browse.md) | 콘텐츠 목록 페이지 | Task 3, 5 |
| [08-detail.md](08-detail.md) | 콘텐츠 상세 페이지 (MDX, 실전문제, 퀴즈) | Task 3, 4, 7 |
| [09-seo-deploy.md](09-seo-deploy.md) | SEO 및 배포 | Task 5~8 전체 |
| [10-seo-description.md](10-seo-description.md) | 콘텐츠 상세 페이지 SEO description 개선 | Task 9 |

---

## MVP 완료 체크리스트

모든 Task 완료 후 PRD 기준에 대해 검증한다:

- [ ] 랜딩 페이지 동작
- [ ] 초급 콘텐츠 2개가 한/영으로 표시
- [ ] 난이도 필터링 동작
- [ ] 키워드 검색 동작
- [ ] 문제 → 힌트 → 정답 토글 동작
- [ ] 한/영 언어 전환 동작
- [ ] SEO 메타태그 적용
- [ ] Vercel 배포 완료
