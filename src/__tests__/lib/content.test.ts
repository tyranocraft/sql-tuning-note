import { describe, it, expect } from "vitest";
import { getAllContent, getContentBySlug } from "@/lib/content";
import { filterByDifficulty, searchContent } from "@/lib/content-utils";

describe("getAllContent", () => {
    it("mysql/ko의 모든 콘텐츠 메타데이터를 반환한다", () => {
        // given
        const database = "mysql";
        const locale = "ko";

        // when
        const contents = getAllContent(database, locale);

        // then
        expect(contents.length).toBe(2);
        expect(contents.map((c) => c.slug).sort()).toEqual([
            "explain-intro",
            "index-basics",
        ]);
    });

    it("mysql/en의 모든 콘텐츠 메타데이터를 반환한다", () => {
        // given
        const database = "mysql";
        const locale = "en";

        // when
        const contents = getAllContent(database, locale);

        // then
        expect(contents.length).toBe(2);
    });

    it("존재하지 않는 데이터베이스는 빈 배열을 반환한다", () => {
        // given
        const database = "postgresql";
        const locale = "ko";

        // when
        const contents = getAllContent(database, locale);

        // then
        expect(contents).toEqual([]);
    });

    it("frontmatter 필드가 올바르게 포함된다", () => {
        // given
        const database = "mysql";
        const locale = "ko";

        // when
        const contents = getAllContent(database, locale);
        const indexBasics = contents.find((c) => c.slug === "index-basics");

        // then
        expect(indexBasics).toBeDefined();
        expect(indexBasics!.title).toBe("인덱스 동작원리");
        expect(indexBasics!.difficulty).toBe("beginner");
        expect(indexBasics!.database).toBe("mysql");
        expect(indexBasics!.category).toBe("index");
        expect(indexBasics!.tags).toContain("b-tree");
    });
});

describe("getContentBySlug", () => {
    it("유효한 slug로 MDX 소스를 포함한 콘텐츠를 반환한다", () => {
        // given
        const database = "mysql";
        const locale = "ko";
        const slug = "index-basics";

        // when
        const content = getContentBySlug(database, locale, slug);

        // then
        expect(content).not.toBeNull();
        expect(content!.title).toBe("인덱스 동작원리");
        expect(content!.content).toContain("인덱스란?");
    });

    it("존재하지 않는 slug는 null을 반환한다", () => {
        // given
        const database = "mysql";
        const locale = "ko";
        const slug = "nonexistent";

        // when
        const content = getContentBySlug(database, locale, slug);

        // then
        expect(content).toBeNull();
    });
});

describe("filterByDifficulty", () => {
    it("단일 난이도로 콘텐츠를 필터링한다", () => {
        // given
        const all = getAllContent("mysql", "ko");

        // when
        const beginners = filterByDifficulty(all, ["beginner"]);

        // then
        expect(beginners.length).toBe(2);
        beginners.forEach((c) => expect(c.difficulty).toBe("beginner"));
    });

    it("일치하는 난이도가 없으면 빈 배열을 반환한다", () => {
        // given
        const all = getAllContent("mysql", "ko");

        // when
        const advanced = filterByDifficulty(all, ["advanced"]);

        // then
        expect(advanced).toEqual([]);
    });

    it("난이도 필터가 비어있으면 전체를 반환한다", () => {
        // given
        const all = getAllContent("mysql", "ko");

        // when
        const unfiltered = filterByDifficulty(all, []);

        // then
        expect(unfiltered.length).toBe(all.length);
    });
});

describe("searchContent", () => {
    it("제목 키워드로 콘텐츠를 검색한다", () => {
        // given
        const all = getAllContent("mysql", "ko");

        // when
        const results = searchContent(all, "인덱스");

        // then
        expect(results.length).toBeGreaterThanOrEqual(1);
        expect(results.some((c) => c.slug === "index-basics")).toBe(true);
    });

    it("태그로 콘텐츠를 검색한다", () => {
        // given
        const all = getAllContent("mysql", "ko");

        // when
        const results = searchContent(all, "explain");

        // then
        expect(results.some((c) => c.slug === "explain-intro")).toBe(true);
    });

    it("빈 검색어는 전체 콘텐츠를 반환한다", () => {
        // given
        const all = getAllContent("mysql", "ko");

        // when
        const results = searchContent(all, "");

        // then
        expect(results.length).toBe(all.length);
    });

    it("일치하는 결과가 없으면 빈 배열을 반환한다", () => {
        // given
        const all = getAllContent("mysql", "ko");

        // when
        const results = searchContent(all, "xyznonexistent");

        // then
        expect(results).toEqual([]);
    });

    it("대소문자를 구분하지 않고 검색한다", () => {
        // given
        const all = getAllContent("mysql", "en");

        // when
        const results = searchContent(all, "INDEX");

        // then
        expect(results.some((c) => c.slug === "index-basics")).toBe(true);
    });
});
