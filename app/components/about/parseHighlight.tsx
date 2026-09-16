import React from "react";

type HighlightColour = "yellow" | "blue" | "orange" | "green";

const COLOUR_CLASS: Record<HighlightColour, string> = {
    yellow: "wc-yellow",
    blue:   "wc-blue",
    orange: "wc-orange",
    green:  "wc-green",
};

/**
 * Parses a string containing [shown text](colour) tokens and returns an array
 * of React nodes — plain strings for regular text and <span> elements for
 * highlighted words. Pass `animate=true` to add the `.wc-animate` class that
 * triggers the wipe-in animation.
 *
 * Each highlight span receives a `--wc-delay` CSS custom property so multiple
 * highlights on the same paragraph stagger slightly.
 */
export function parseHighlight(
    text: string,
    animate: boolean,
    paragraphIndex: number
): React.ReactNode[] {
    const PATTERN = /\[([^\]]+)\]\((yellow|blue|orange|green)\)/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let highlightCount = 0;
    let match: RegExpExecArray | null;

    while ((match = PATTERN.exec(text)) !== null) {
        // Text before the token
        if (match.index > lastIndex) {
            nodes.push(text.slice(lastIndex, match.index));
        }

        const [, shown, colour] = match as unknown as [string, string, HighlightColour];
        const delay = (paragraphIndex * 0.15 + highlightCount * 0.12).toFixed(2);

        nodes.push(
            <span
                key={`${paragraphIndex}-${highlightCount}`}
                className={[
                    "wc-highlight",
                    COLOUR_CLASS[colour as HighlightColour],
                    animate ? "wc-animate" : "",
                ].join(" ").trim()}
                style={{ "--wc-delay": `${delay}s` } as React.CSSProperties}
            >
                {shown}
            </span>
        );

        lastIndex = match.index + match[0].length;
        highlightCount++;
    }

    // Remaining plain text after last token
    if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
    }

    return nodes.length > 0 ? nodes : [text];
}
