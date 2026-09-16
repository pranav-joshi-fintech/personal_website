import React from "react";
import site from "@/data/site.json";

function parseInlineMarkdown(text: string): React.ReactNode[] {
    const PATTERN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;
    let match: RegExpExecArray | null;

    while ((match = PATTERN.exec(text)) !== null) {
        if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

        if (match[1] !== undefined) {
            nodes.push(<strong key={key++}>{match[1]}</strong>);
        } else if (match[2] !== undefined) {
            nodes.push(
                <a key={key++} href={match[3]} target={match[3].startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    {match[2]}
                </a>
            );
        } else if (match[4] !== undefined) {
            nodes.push(<code key={key++}>{match[4]}</code>);
        }
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
}

export default function Banner() {
    const { banner } = site as typeof site & { banner?: { visible: boolean; text: string } };
    if (!banner?.visible) return null;

    return (
        <div className="w-full border-b" style={{ background: "var(--banner-bg)", borderColor: "var(--banner-border)" }}>
            <div className="max-w-5xl mx-auto px-6 md:px-12 py-2 flex items-center justify-center">
                <p className="text-sm text-center leading-snug banner-content" style={{ color: "var(--banner-text)" }}>
                    {parseInlineMarkdown(banner.text)}
                </p>
            </div>
        </div>
    );
}
