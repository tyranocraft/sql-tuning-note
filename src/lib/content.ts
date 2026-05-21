import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ContentMeta, ContentItem, Difficulty } from "./types";

const contentDirectory = path.join(process.cwd(), "content");
const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];

export function getAllContent(
    database: string,
    locale: string
): ContentMeta[] {
    const contents: ContentMeta[] = [];

    for (const difficulty of difficulties) {
        const dirPath = path.join(contentDirectory, database, locale, difficulty);
        if (!fs.existsSync(dirPath)) continue;

        const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const { data } = matter(fileContent);
            contents.push(data as ContentMeta);
        }
    }

    return contents;
}

export function getContentBySlug(
    database: string,
    locale: string,
    slug: string
): ContentItem | null {
    for (const difficulty of difficulties) {
        const dirPath = path.join(contentDirectory, database, locale, difficulty);
        if (!fs.existsSync(dirPath)) continue;

        const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const { data, content } = matter(fileContent);
            if (data.slug === slug) {
                return { ...(data as ContentMeta), content };
            }
        }
    }

    return null;
}
