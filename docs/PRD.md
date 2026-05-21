# SQL Tuning Note — PRD (Product Requirements Document)

## 1. Overview

SQL Tuning Note는 MySQL/PostgreSQL 쿼리 성능 개선을 위한 이론, 방법, 팁을 정리한 오픈소스 교육 웹서비스다. 초급/중급/고급 난이도별로 구성된 콘텐츠를 통해 개발자가 실무에서 바로 활용할 수 있는 쿼리 튜닝 역량을 기를 수 있도록 한다.

## 2. Target Users

| 구분 | 대상 | 니즈 |
|------|------|------|
| **메인 타겟** | 주니어~시니어 백엔드 개발자 | 실무에서 바로 쓸 수 있는 쿼리 튜닝 지식 |
| **서브 타겟** | CS 학생 ~ 신입 개발자 | DB 기초 이론부터 체계적으로 학습 |

## 3. Tech Stack

| 항목 | 선택 | 근거 |
|------|------|------|
| Framework | Next.js (App Router) | Vercel 최적 통합, SSG 지원, 유연한 i18n 라우팅 |
| Content | MDX | Markdown + JSX, Git 관리, 커뮤니티 기여 용이 |
| Rendering | SSG (Static Site Generation) | SEO 최적화, 빠른 로딩, DB 불필요 |
| Styling | Tailwind CSS | 유틸리티 기반, 빠른 프로토타이핑, Next.js 공식 지원 |
| Deploy | Vercel | Next.js 네이티브 지원, 무료 티어 |
| Database | 없음 | 모든 콘텐츠는 MDX 파일로 관리 |

## 4. Content Structure

### 4.1 난이도 체계

| 난이도 | 대상 | 콘텐츠 성격 |
|--------|------|-------------|
| **Beginner (초급)** | 학생~신입 | 이론 중심. 기초 개념 설명 |
| **Intermediate (중급)** | 주니어~미드 | 이론 + 실무. 실행계획 읽기, 인덱스 전략 등 |
| **Advanced (고급)** | 미드~시니어 | 실무 중심. 대규모 테이블 전략, 고급 튜닝 사례 |

### 4.2 콘텐츠 구성 요소

각 주제(토픽)는 아래 요소들로 구성된다:

1. **이론 (Theory)** — 핵심 개념 설명
2. **예시 (Examples)** — 이론을 코드로 보여주는 예제
3. **실전문제 & 풀이 (Practice)** — 문제 → 힌트 → 정답 토글 (텍스트 기반)
4. **퀴즈 (Quiz)** — 이해도 확인용 객관식/단답형 (텍스트 기반 토글)

### 4.3 주요 이론 (반드시 포함)

아래 주제들은 쿼리 성능 개선의 필수 이론으로, 콘텐츠에 반드시 포함한다. 내용이 길면 파트를 분할하여 제공한다 (예: `index-basics-1`, `index-basics-2`).

- DB Index 동작원리 (B-Tree, Hash 등)
- EXPLAIN / 실행계획 읽는 법
- 기타 핵심 이론 (구현 단계에서 상세 기획)

### 4.4 레벨 간 연결

각 콘텐츠는 명확히 하나의 레벨에 속하되, 레벨 간 연결 링크를 제공한다:

- 상단: 선수 지식 링크 (예: "선수 지식: [인덱스 동작원리 (초급)](/beginner/index-basics)")
- 하단: 다음 단계 링크 (예: "다음 단계: [커버링 인덱스 (중급)](/intermediate/covering-index)")

### 4.5 MDX Frontmatter Schema

```yaml
---
title: "인덱스 동작원리"
slug: "index-basics"
database: "mysql"           # mysql | postgresql
difficulty: "beginner"      # beginner | intermediate | advanced
category: "index"           # 주제 카테고리
tags: ["b-tree", "index", "performance"]
prerequisites: []           # 선수 지식 slug 목록
nextSteps: []               # 다음 단계 slug 목록
part: 1                     # 분할 시 파트 번호 (optional)
totalParts: 1               # 분할 시 전체 파트 수 (optional)
author: ""
createdAt: "2026-05-19"
updatedAt: "2026-05-19"
---
```

### 4.6 Content Directory Structure

```
content/
├── mysql/
│   ├── ko/
│   │   ├── beginner/
│   │   │   ├── index-basics.mdx
│   │   │   └── explain-intro.mdx
│   │   ├── intermediate/
│   │   └── advanced/
│   └── en/
│       ├── beginner/
│       │   ├── index-basics.mdx
│       │   └── explain-intro.mdx
│       ├── intermediate/
│       └── advanced/
└── postgresql/          # 추후 확장
    ├── ko/
    └── en/
```

## 5. Features (MVP)

### 5.1 Landing Page

- 서비스 소개 및 가치 제안
- 난이도별 콘텐츠 카드 미리보기
- 빠른 시작 가이드 또는 CTA

### 5.2 Content Browsing

- 좌측 사이드바: 난이도별 그룹핑된 토픽 네비게이션
- 우측 본문: MDX 렌더링 (코드 하이라이팅, 테이블 등)
- 레이아웃 참고: LeetCode Explore (https://leetcode.com/explore/)

### 5.3 Search & Filter

- **난이도 필터:** 초급/중급/고급 필터 버튼 (다중 선택 가능)
- **키워드 검색:** 주제명, 태그 기반 텍스트 검색

### 5.4 Practice & Quiz (Text-based Toggle)

- **실전문제:** 문제 표시 → "힌트 보기" 토글 → "정답 보기" 토글
- **퀴즈:** 문제 표시 → 선택지/입력 → "정답 확인" 토글
- 인터랙티브 SQL 실행 환경 없음 (텍스트 기반만)

### 5.5 Internationalization (i18n)

- 지원 언어: 한국어 (ko), English (en)
- URL 기반 라우팅: `/ko/...`, `/en/...`
- 언어 전환 UI (헤더 또는 적절한 위치)

### 5.6 SEO

- 정적 생성 (SSG)으로 모든 페이지 사전 렌더링
- Open Graph, Twitter Card 메타태그
- 시맨틱 HTML, 구조화된 heading
- sitemap.xml, robots.txt 자동 생성

## 6. Design Principles

- **Clean & Professional:** AI Slop 디자인 절대 금지 (다크 테마, 보라색 그라데이션, 과도한 이모지 사용 금지)
- **Light Theme:** 밝고 깔끔한 기본 테마
- **Typography First:** 가독성 높은 폰트, 충분한 여백
- **Minimal UI:** 필요한 요소만 배치, 과도한 장식 없음
- **Reference:** LeetCode Explore (https://leetcode.com/explore/)

## 7. MVP Scope

### 7.1 포함 (In Scope)

- MySQL 콘텐츠만 (초급 임시 콘텐츠 2개)
- 한국어/영어 2개 언어
- 랜딩페이지
- 사이드바 네비게이션 + 본문 레이아웃
- 난이도 필터링 + 키워드 검색
- 텍스트 기반 문제/퀴즈 토글
- 언어 전환
- SEO 메타태그
- Vercel 배포

### 7.2 제외 (Out of Scope)

- PostgreSQL 콘텐츠 (구조만 확장 가능하게)
- SQL 실행 환경 (sandbox)
- 회원가입 / 로그인 / 인증
- CMS 연동
- 댓글, 좋아요 등 소셜 기능
- 다크 모드

### 7.3 MVP Completion Criteria

- [ ] 랜딩페이지 동작
- [ ] 초급 콘텐츠 2개가 한/영으로 표시
- [ ] 난이도 필터링 동작
- [ ] 키워드 검색 동작
- [ ] 문제 → 힌트 → 정답 토글 동작
- [ ] 한/영 언어 전환 동작
- [ ] SEO 메타태그 적용
- [ ] Vercel 배포 완료

## 8. Future Considerations

아래 항목들은 MVP 이후 고려할 사항이다:

- PostgreSQL 콘텐츠 추가
- 난이도별 주제 목록 본격 기획
- 커뮤니티 기여 가이드 (PR 기반 콘텐츠 기여)
- 학습 경로 (Learning Path) 기능
- 콘텐츠 목차 (Table of Contents) 자동 생성
- 모바일 반응형 최적화

## 9. Open Questions

- 오픈소스 라이선스 선택 (MIT, Apache 2.0 등)
- 랜딩페이지 세부 구성 요소
- 난이도별 상세 주제 목록 (기능 완성 후 기획)
