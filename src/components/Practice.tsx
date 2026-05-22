"use client";

import { useDictionary } from "./DictionaryProvider";
import ToggleSection from "./ToggleSection";

export function Practice({ children }: { children: React.ReactNode }) {
    return (
        <div className="my-6 rounded-lg border border-gray-200 bg-gray-50">
            {children}
        </div>
    );
}

export function Problem({ children }: { children: React.ReactNode }) {
    return (
        <div className="border-b border-gray-200 p-5">
            <div className="prose prose-sm max-w-none text-gray-700">{children}</div>
        </div>
    );
}

export function Hint({ children }: { children: React.ReactNode }) {
    const dict = useDictionary();

    return (
        <ToggleSection
            showLabel={dict.content.showHint}
            hideLabel={dict.content.hideHint}
            buttonClassName="text-blue-600 hover:text-blue-800"
            className="border-b border-gray-200 px-5 py-3"
        >
            <div className="text-gray-600">{children}</div>
        </ToggleSection>
    );
}

export function Answer({ children }: { children: React.ReactNode }) {
    const dict = useDictionary();

    return (
        <ToggleSection
            showLabel={dict.content.showAnswer}
            hideLabel={dict.content.hideAnswer}
            buttonClassName="text-green-600 hover:text-green-800"
            className="px-5 py-3"
        >
            <div className="text-gray-700">{children}</div>
        </ToggleSection>
    );
}
