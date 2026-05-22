import Link from "next/link";
import type { ContentMeta, Locale, Dictionary } from "@/lib/types";
import DifficultyBadge from "./DifficultyBadge";

interface ContentCardProps {
  content: ContentMeta;
  locale: Locale;
  dictionary: Dictionary;
}

export default function ContentCard({
  content,
  locale,
  dictionary,
}: ContentCardProps) {
  return (
    <Link
      href={`/${locale}/notes/${content.database}/${content.slug}`}
      className="block rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 hover:bg-gray-50"
    >
      <div className="mb-2 flex items-center gap-2">
        <DifficultyBadge
          difficulty={content.difficulty}
          dictionary={dictionary}
          colored
        />
        <span className="text-xs text-gray-400">{content.category}</span>
      </div>
      <h3 className="mb-1 font-medium text-gray-900">{content.title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {content.tags.map((tag) => (
          <span key={tag} className="text-xs text-gray-400">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
