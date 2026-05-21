# Architecture

## 시스템 개요

```mermaid
graph TB
    subgraph Content["콘텐츠 레이어"]
        MDX["MDX 파일<br/>content/{db}/{locale}/{difficulty}/{slug}.mdx"]
        FM["Frontmatter<br/>(gray-matter)"]
        MDXRender["MDX → RSC 렌더링<br/>(next-mdx-remote/rsc)"]
        CodeHL["코드 하이라이팅<br/>(rehype-pretty-code + shiki)"]
    end

    subgraph App["Next.js App Router (SSG)"]
        Root["/ → /ko 리다이렉트"]
        Landing["/{locale}<br/>랜딩 페이지"]
        Browse["/{locale}/notes/{database}<br/>콘텐츠 목록"]
        Detail["/{locale}/notes/{database}/{slug}<br/>콘텐츠 상세"]
    end

    subgraph Lib["서버 유틸리티"]
        ContentTS["content.ts<br/>getAllContent · getContentBySlug<br/>(fs, 서버 전용)"]
        ContentUtils["content-utils.ts<br/>filterByDifficulty · searchContent<br/>(순수 함수, 클라이언트 안전)"]
        Types["types.ts<br/>Locale · Database · Difficulty<br/>ContentMeta · Dictionary"]
    end

    MDX --> FM --> ContentTS
    ContentTS --> MDXRender
    MDXRender --> CodeHL
    CodeHL --> Detail
    ContentTS --> Browse
    ContentUtils --> Browse
    Types --> ContentTS
    Types --> ContentUtils
```

## 라우팅 구조

```mermaid
graph LR
    subgraph Middleware["미들웨어"]
        MW["locale 감지<br/>/ → /ko 리다이렉트"]
    end

    subgraph Routes["라우트"]
        R1["app/layout.tsx<br/>루트 레이아웃"]
        R2["app/[locale]/layout.tsx<br/>Header 포함"]
        R3["app/[locale]/page.tsx<br/>랜딩"]
        R4["app/[locale]/notes/[database]/layout.tsx<br/>Sidebar 포함"]
        R5["app/[locale]/notes/[database]/page.tsx<br/>목록"]
        R6["app/[locale]/notes/[database]/[slug]/page.tsx<br/>상세"]
    end

    MW --> R1 --> R2
    R2 --> R3
    R2 --> R4
    R4 --> R5
    R4 --> R6
```

## 컴포넌트 구조

```mermaid
graph TB
    subgraph Server["서버 컴포넌트"]
        Header["Header"]
        Sidebar["Sidebar"]
        DetailPage["콘텐츠 상세 페이지"]
    end

    subgraph Client["클라이언트 컴포넌트"]
        DictProvider["DictionaryProvider<br/>(i18n Context)"]
        LangSwitch["LanguageSwitcher"]
        ContentList["ContentList"]
        DiffFilter["DifficultyFilter"]
        SearchBar["SearchBar"]
        ContentCard["ContentCard"]
        Practice["Practice · Problem · Hint · Answer"]
        Quiz["Quiz · Option"]
    end

    subgraph MDXMap["MDXComponents.tsx"]
        Mapping["MDX 태그 → React 컴포넌트 매핑"]
    end

    Header --> LangSwitch
    DictProvider --> ContentList
    DictProvider --> Practice
    DictProvider --> Quiz
    ContentList --> DiffFilter
    ContentList --> SearchBar
    ContentList --> ContentCard
    DetailPage --> MDXMap
    MDXMap --> Practice
    MDXMap --> Quiz
```

## 콘텐츠 파이프라인

```mermaid
flowchart LR
    A["MDX 파일 작성"] --> B["빌드 시 gray-matter로<br/>frontmatter 파싱"]
    B --> C["next-mdx-remote/rsc로<br/>RSC 변환"]
    C --> D["rehype-pretty-code로<br/>코드 하이라이팅"]
    D --> E["정적 HTML 생성<br/>(SSG)"]
    E --> F["Vercel 배포"]
```

## i18n 흐름

```mermaid
flowchart LR
    subgraph URL["URL 기반 로케일"]
        KO["/ko/notes/mysql/index-basics"]
        EN["/en/notes/mysql/index-basics"]
    end

    subgraph Dict["사전 파일"]
        KO_JSON["dictionaries/ko.json"]
        EN_JSON["dictionaries/en.json"]
    end

    subgraph Content["콘텐츠 파일"]
        KO_MDX["content/mysql/ko/beginner/index-basics.mdx"]
        EN_MDX["content/mysql/en/beginner/index-basics.mdx"]
    end

    KO --> KO_JSON
    KO --> KO_MDX
    EN --> EN_JSON
    EN --> EN_MDX
```

## 디렉토리 구조

```
sql-tuning-note/
├── content/                        # MDX 콘텐츠
│   └── {database}/{locale}/{difficulty}/{slug}.mdx
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # 루트 레이아웃
│   │   ├── page.tsx                # 루트 리다이렉트
│   │   └── [locale]/               # i18n 동적 세그먼트
│   ├── components/                 # UI 컴포넌트
│   ├── lib/                        # 유틸리티
│   │   ├── content.ts              # 서버 전용 (fs)
│   │   ├── content-utils.ts        # 클라이언트 안전
│   │   └── types.ts                # 타입 정의
│   ├── dictionaries/               # i18n 사전 (ko.json, en.json)
│   └── __tests__/                  # Vitest 테스트
├── docs/                           # 프로젝트 문서
├── vitest.config.ts
├── next.config.ts
└── package.json
```
