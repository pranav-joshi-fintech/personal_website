import React from "react";
import site from "@/data/site.json";

type SiteExtras = typeof site & {
    ultraFooter?: { visible: boolean; text: string };
};

function parseText(text: string): React.ReactNode[] {
    const PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;
    let match: RegExpExecArray | null;

    while ((match = PATTERN.exec(text)) !== null) {
        if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
        nodes.push(
            <a
                key={key++}
                href={match[2]}
                target={match[2].startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="ultra-footer-link"
            >
                {match[1]}
            </a>
        );
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
}

export default function UltraFooter() {
    const s = site as SiteExtras;
    if (!s.ultraFooter?.visible || !s.ultraFooter.text) return null;

    return (
        <div
            className="ultra-footer text-xs leading-none text-text-muted opacity-70 hover:opacity-100 transition-opacity select-none p-4"
            aria-hidden="false"
        >
            {parseText(s.ultraFooter.text)}
        </div>
    );
}
