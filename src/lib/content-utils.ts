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
