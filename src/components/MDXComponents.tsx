import React from "react";
import { Practice, Problem, Hint, Answer } from "./Practice";
import { Quiz, Option } from "./Quiz";

function WrappedQuiz({
                         question,
                         children,
                     }: {
    question: string;
    children: React.ReactNode;
}) {
    const indexedChildren = React.Children.map(children, (child, i) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { index: i } as Record<string, unknown>);
        }
        return child;
    });

    return <Quiz question={question}>{indexedChildren}</Quiz>;
}

export const mdxComponents = {
    Practice,
    Problem,
    Hint,
    Answer,
    Quiz: WrappedQuiz,
    Option,
};
