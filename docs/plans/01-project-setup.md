# Task 1: 프로젝트 초기 설정

> **공통 컨텍스트:** [00-overview.md](00-overview.md)를 먼저 읽을 것.
> **의존성:** 없음

**파일:**
- 생성: `create-next-app`을 통한 전체 프로젝트 스캐폴드
- 생성: `vitest.config.ts`
- 수정: `package.json` (테스트 스크립트 추가)

- [ ] **Step 1: Next.js 프로젝트 생성**

프로젝트 디렉토리에서 실행:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

프롬프트 응답:
- Would you like to use Turbopack? → Yes

- [ ] **Step 2: 앱 실행 확인**

```bash
npm run dev
```

http://localhost:3000 을 열어 기본 Next.js 페이지가 로드되는지 확인한다.
개발 서버를 중지한다 (Ctrl+C).

- [ ] **Step 3: 콘텐츠 관련 의존성 설치**

```bash
npm install gray-matter next-mdx-remote rehype-pretty-code shiki
```

- [ ] **Step 4: 테스트 관련 의존성 설치**

```bash
npm install -D vitest @vitejs/plugin-react jsdom
```

- [ ] **Step 5: Vitest 설정 파일 생성**

`vitest.config.ts` 생성:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 6: package.json에 테스트 스크립트 추가**

`package.json`의 `"scripts"` 섹션에 추가:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: 디렉토리 구조 생성**

```bash
mkdir -p content/mysql/ko/beginner
mkdir -p content/mysql/ko/intermediate
mkdir -p content/mysql/ko/advanced
mkdir -p content/mysql/en/beginner
mkdir -p content/mysql/en/intermediate
mkdir -p content/mysql/en/advanced
mkdir -p src/components
mkdir -p src/lib
mkdir -p src/dictionaries
mkdir -p src/__tests__/lib
```

- [ ] **Step 8: 기본 Next.js 파일 정리**

`src/app/page.tsx`를 최소한의 플레이스홀더로 교체:

```tsx
export default function RootPage() {
  return <div>SQL Tuning Note</div>;
}
```

`src/app/globals.css`에서 `create-next-app`이 생성한 Tailwind 디렉티브만 남기고 나머지 기본 스타일을 모두 제거한다.
