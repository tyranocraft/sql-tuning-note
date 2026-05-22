"use client";

import { useState, createContext, useContext } from "react";
import { useDictionary } from "./DictionaryProvider";

interface QuizContextValue {
    selected: number | null;
    setSelected: (index: number) => void;
    revealed: boolean;
}

const QuizContext = createContext<QuizContextValue>({
    selected: null,
    setSelected: () => {},
    revealed: false,
});

export function Quiz({
                         question,
                         children,
                     }: {
    question: string;
    children: React.ReactNode;
}) {
    const [selected, setSelected] = useState<number | null>(null);
    const [revealed, setRevealed] = useState(false);
    const dict = useDictionary();

    return (
            <QuizContext.Provider value={{ selected, setSelected, revealed }}>
                <div className="my-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
                    <p className="mb-4 text-sm text-gray-700">{question}</p>
                    <div className="mb-4 space-y-2">{children}</div>
                    {selected !== null && !revealed && (
                            <button
                                    onClick={() => setRevealed(true)}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                {dict.content.checkAnswer}
                            </button>
                    )}
                </div>
            </QuizContext.Provider>
    );
}

export function Option({
                           children,
                           correct,
                           index,
                       }: {
    children: React.ReactNode;
    correct?: boolean;
    index: number;
}) {
    const { selected, setSelected, revealed } = useContext(QuizContext);
    const isSelected = selected === index;

    let className =
            "flex w-full items-center gap-3 rounded border px-4 py-2.5 text-left text-sm transition-colors ";

    if (revealed && correct) {
        className += "border-green-300 bg-green-50 text-green-800";
    } else if (revealed && isSelected && !correct) {
        className += "border-red-300 bg-red-50 text-red-800";
    } else if (isSelected) {
        className += "border-gray-400 bg-white text-gray-900";
    } else {
        className += "border-gray-200 bg-white text-gray-600 hover:border-gray-300";
    }

    return (
            <button
                    onClick={() => !revealed && setSelected(index)}
                    disabled={revealed}
                    className={className}
            >
      <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                      isSelected
                              ? "border-gray-400 bg-gray-900 text-white"
                              : "border-gray-300"
              }`}
      >
        {isSelected && "●"}
      </span>
                {children}
            </button>
    );
}
