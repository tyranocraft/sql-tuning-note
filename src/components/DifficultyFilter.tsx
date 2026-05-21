"use client";

import type { Difficulty, Dictionary } from "@/lib/types";

interface DifficultyFilterProps {
  selected: Difficulty[];
  onChange: (difficulties: Difficulty[]) => void;
  dictionary: Dictionary;
}

const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];

const difficultyToggleColors = {
  beginner: {
    active: "bg-green-100 text-green-800 border-green-300",
    inactive: "border-gray-200 text-gray-500 hover:border-gray-300",
  },
  intermediate: {
    active: "bg-yellow-100 text-yellow-800 border-yellow-300",
    inactive: "border-gray-200 text-gray-500 hover:border-gray-300",
  },
  advanced: {
    active: "bg-red-100 text-red-800 border-red-300",
    inactive: "border-gray-200 text-gray-500 hover:border-gray-300",
  },
};

export default function DifficultyFilter({
  selected,
  onChange,
  dictionary,
}: DifficultyFilterProps) {
  function toggle(difficulty: Difficulty) {
    if (selected.includes(difficulty)) {
      onChange(selected.filter((d) => d !== difficulty));
    } else {
      onChange([...selected, difficulty]);
    }
  }

  return (
    <div className="flex gap-2">
      {difficulties.map((d) => {
        const isActive = selected.includes(d);
        return (
          <button
            key={d}
            onClick={() => toggle(d)}
            className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
              isActive
                ? difficultyToggleColors[d].active
                : difficultyToggleColors[d].inactive
            }`}
          >
            {dictionary.filter[d]}
          </button>
        );
      })}
    </div>
  );
}
