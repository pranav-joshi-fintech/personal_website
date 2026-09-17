import React from "react";
import site from "@/data/site.json";

type SiteExtras = typeof site & {
    footer?: string;
    contactBar2?: { visible: boolean; text: string };
};

function parseContactBar(text: string): React.ReactNode[] {
    const PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;
    let match: RegExpExecArray | null;

    while ((match = PATTERN.exec(text)) !== null) {
        if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
        nodes.push(
            <a key={key++} href={match[2]} target={match[2].startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="contact-bar-content">
                {match[1]}
            </a>
        );
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
}

export default function Footer() {
    const s = site as SiteExtras;
    if (!s.footer) return null;

    const contactBar2 = s.contactBar2?.visible ? s.contactBar2.text : null;

    return (
        <footer className="max-w-5xl mx-auto px-6 md:px-12 pb-10 pt-4">
            <div className="border-t border-border pt-6 text-center space-y-2">
                <p className="text-sm text-text-muted">{s.footer}</p>
                {contactBar2 && (
                    <p className="text-xs contact-bar-content" style={{ color: "var(--text-muted)" }}>
                        {parseContactBar(contactBar2)}
                    </p>
                )}
            </div>
        </footer>
    );
}
