import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/types";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary;
}

export default function Header({ locale, dictionary }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href={`/${locale}`}
            className="text-lg font-semibold text-gray-900"
          >
            SQL Tuning Note
          </Link>
          <nav className="flex gap-6">
            <Link
              href={`/${locale}/notes/mysql`}
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              {dictionary.nav.notes}
            </Link>
          </nav>
        </div>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
