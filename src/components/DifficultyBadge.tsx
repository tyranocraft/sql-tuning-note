import type { Difficulty, Dictionary } from "@/lib/types";

const coloredStyles: Record<Difficulty, string> = {
  beginner: "bg-green-50 text-green-700 border-green-200",
  intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
  advanced: "bg-red-50 text-red-700 border-red-200",
};

const neutralStyle = "bg-gray-100 text-gray-600 border-gray-100";

export default function DifficultyBadge({
  difficulty,
  dictionary,
  colored = false,
}: {
  difficulty: Difficulty;
  dictionary: Dictionary;
  colored?: boolean;
}) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        colored ? coloredStyles[difficulty] : neutralStyle
      }`}
    >
      {dictionary.filter[difficulty]}
    </span>
  );
}
