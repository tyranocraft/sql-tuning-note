import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContentList from "@/components/ContentList";
import type { ContentMeta, Dictionary } from "@/lib/types";

afterEach(cleanup);

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const dictionary: Dictionary = {
  site: { title: "", description: "" },
  nav: { home: "", notes: "" },
  landing: {
    hero: { title: "", subtitle: "", cta: "" },
    difficulty: { beginner: "초급", intermediate: "중급", advanced: "고급" },
  },
  content: {
    prerequisites: "",
    nextSteps: "",
    showHint: "",
    hideHint: "",
    showAnswer: "",
    hideAnswer: "",
    checkAnswer: "",
    correct: "",
    incorrect: "",
  },
  search: { placeholder: "주제 검색...", noResults: "검색 결과가 없습니다" },
  filter: { all: "전체", beginner: "초급", intermediate: "중급", advanced: "고급" },
};

const contents: ContentMeta[] = [
  {
    title: "인덱스 동작원리",
    slug: "index-basics",
    database: "mysql",
    difficulty: "beginner",
    category: "index",
    tags: ["b-tree", "인덱스"],
    prerequisites: [],
    nextSteps: ["explain-intro"],
    author: "test",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    title: "EXPLAIN 읽는 법",
    slug: "explain-intro",
    database: "mysql",
    difficulty: "beginner",
    category: "explain",
    tags: ["explain", "실행계획"],
    prerequisites: ["index-basics"],
    nextSteps: [],
    author: "test",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
];

describe("ContentList", () => {
  it("모든 콘텐츠 카드를 렌더링한다", () => {
    // given
    // when
    render(
      <ContentList contents={contents} locale="ko" dictionary={dictionary} />
    );

    // then
    expect(screen.getByText("인덱스 동작원리")).toBeDefined();
    expect(screen.getByText("EXPLAIN 읽는 법")).toBeDefined();
  });

  it("검색어 입력 시 일치하는 콘텐츠만 표시한다", async () => {
    // given
    const user = userEvent.setup();
    render(
      <ContentList contents={contents} locale="ko" dictionary={dictionary} />
    );

    // when
    const searchInput = screen.getByPlaceholderText("주제 검색...");
    await user.type(searchInput, "인덱스");

    // then
    expect(screen.getByText("인덱스 동작원리")).toBeDefined();
    expect(screen.queryByText("EXPLAIN 읽는 법")).toBeNull();
  });

  it("난이도 필터 클릭 시 해당 난이도 콘텐츠만 표시한다", async () => {
    // given
    const contentsWithAdvanced: ContentMeta[] = [
      ...contents,
      {
        title: "고급 쿼리 최적화",
        slug: "advanced-query",
        database: "mysql",
        difficulty: "advanced",
        category: "optimization",
        tags: ["쿼리"],
        prerequisites: [],
        nextSteps: [],
        author: "test",
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01",
      },
    ];
    const user = userEvent.setup();
    render(
      <ContentList
        contents={contentsWithAdvanced}
        locale="ko"
        dictionary={dictionary}
      />
    );

    // when
    await user.click(screen.getByRole("button", { name: "고급" }));

    // then
    expect(screen.getByText("고급 쿼리 최적화")).toBeDefined();
    expect(screen.queryByText("인덱스 동작원리")).toBeNull();
    expect(screen.queryByText("EXPLAIN 읽는 법")).toBeNull();
  });

  it("검색 결과가 없을 때 안내 메시지를 표시한다", async () => {
    // given
    const user = userEvent.setup();
    render(
      <ContentList contents={contents} locale="ko" dictionary={dictionary} />
    );

    // when
    const searchInput = screen.getByPlaceholderText("주제 검색...");
    await user.type(searchInput, "존재하지않는검색어");

    // then
    expect(screen.getByText("검색 결과가 없습니다")).toBeDefined();
  });

  it("난이도 필터와 검색을 조합하여 필터링한다", async () => {
    // given
    const user = userEvent.setup();
    render(
      <ContentList contents={contents} locale="ko" dictionary={dictionary} />
    );

    // when
    await user.click(screen.getByRole("button", { name: "초급" }));
    const searchInput = screen.getByPlaceholderText("주제 검색...");
    await user.type(searchInput, "EXPLAIN");

    // then
    expect(screen.getByText("EXPLAIN 읽는 법")).toBeDefined();
    expect(screen.queryByText("인덱스 동작원리")).toBeNull();
  });

  it("난이도 필터를 다시 클릭하면 해제된다", async () => {
    // given
    const contentsWithAdvanced: ContentMeta[] = [
      ...contents,
      {
        title: "고급 쿼리 최적화",
        slug: "advanced-query",
        database: "mysql",
        difficulty: "advanced",
        category: "optimization",
        tags: ["쿼리"],
        prerequisites: [],
        nextSteps: [],
        author: "test",
        createdAt: "2025-01-01",
        updatedAt: "2025-01-01",
      },
    ];
    const user = userEvent.setup();
    render(
      <ContentList
        contents={contentsWithAdvanced}
        locale="ko"
        dictionary={dictionary}
      />
    );

    // when
    await user.click(screen.getByRole("button", { name: "고급" }));
    await user.click(screen.getByRole("button", { name: "고급" }));

    // then
    expect(screen.getByText("인덱스 동작원리")).toBeDefined();
    expect(screen.getByText("EXPLAIN 읽는 법")).toBeDefined();
    expect(screen.getByText("고급 쿼리 최적화")).toBeDefined();
  });
});
