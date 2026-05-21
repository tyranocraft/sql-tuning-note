"use client";

import type { Dictionary } from "@/lib/types";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  dictionary: Dictionary;
}

export default function SearchBar({
  value,
  onChange,
  dictionary,
}: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={dictionary.search.placeholder}
      className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400"
    />
  );
}
