import Link from "next/link";
import type { ContentMeta, Locale, Dictionary, Difficulty } from "@/lib/types";

interface SidebarProps {
  contents: ContentMeta[];
  locale: Locale;
  database: string;
  dictionary: Dictionary;
  currentSlug?: string;
}

const difficultyOrder: Difficulty[] = ["beginner", "intermediate", "advanced"];

export default function Sidebar({
  contents,
  locale,
  database,
  dictionary,
  currentSlug,
}: SidebarProps) {
  const grouped = difficultyOrder
    .map((difficulty) => ({
      difficulty,
      label: dictionary.filter[difficulty],
      items: contents.filter((c) => c.difficulty === difficulty),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
      <nav className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
        {grouped.map((group) => (
          <div key={group.difficulty} className="mb-6">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {group.label}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${locale}/notes/${database}/${item.slug}`}
                    className={`block rounded px-3 py-1.5 text-sm transition-colors ${
                      currentSlug === item.slug
                        ? "bg-gray-100 font-medium text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
