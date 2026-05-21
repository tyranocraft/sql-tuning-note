"use client";

import { useState } from "react";
import { filterByDifficulty, searchContent } from "@/lib/content-utils";
import type { ContentMeta, Locale, Dictionary, Difficulty } from "@/lib/types";
import ContentCard from "./ContentCard";
import DifficultyFilter from "./DifficultyFilter";
import SearchBar from "./SearchBar";

interface ContentListProps {
  contents: ContentMeta[];
  locale: Locale;
  dictionary: Dictionary;
}

export default function ContentList({
  contents,
  locale,
  dictionary,
}: ContentListProps) {
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    Difficulty[]
  >([]);
  const [query, setQuery] = useState("");

  const filtered = searchContent(
    filterByDifficulty(contents, selectedDifficulties),
    query
  );

  return (
    <div>
      <div className="mb-6 space-y-4">
        <SearchBar value={query} onChange={setQuery} dictionary={dictionary} />
        <DifficultyFilter
          selected={selectedDifficulties}
          onChange={setSelectedDifficulties}
          dictionary={dictionary}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((content) => (
            <ContentCard
              key={content.slug}
              content={content}
              locale={locale}
              dictionary={dictionary}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-gray-500">
          {dictionary.search.noResults}
        </p>
      )}
    </div>
  );
}
