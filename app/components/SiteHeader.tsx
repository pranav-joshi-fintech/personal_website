"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FileIcon, GitHubIcon, LinkedInIcon } from "@/app/icons/Icons";
import site from "@/data/site.json";

/* ── Inline markdown for contactBar (links only) ────────────────────────── */
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

export default function SiteHeader() {
    const headerRef = useRef<HTMLElement>(null);
    const siteWithExtras = site as typeof site & { contactBar?: string };

    return (
        <header
            ref={headerRef}
            className="w-full bg-header-bg text-header-text sticky top-0 z-50 border-b border-border"
        >
            {/* ── Identity row ─────────────────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 pt-3 pb-4 sm:pb-1 flex items-center gap-5">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border shrink-0">
                    <Image
                        src={site.headshot}
                        alt={site.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Name / role — contact bar inline on sm+ */}
                <div className="flex-1 min-w-0">
                    <h1
                        className="text-base font-semibold leading-tight text-header-text"
                        style={{ fontFamily: "var(--font-lora), serif" }}
                    >
                        {site.name}
                    </h1>
                    <p className="text-xs leading-snug" style={{ color: "var(--text-muted)" }}>
                        {site.role}
                    </p>
                    {/* Inline contact bar — visible only on sm and above */}
                    {siteWithExtras.contactBar && (
                        <p className="hidden sm:block text-xs leading-snug contact-bar-content mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {parseContactBar(siteWithExtras.contactBar)}
                        </p>
                    )}
                </div>

                {/* Social icons */}
                <div className="flex items-center gap-4 shrink-0">
                    <Link href={site.socials.resume} target="_blank" aria-label="Resume">
                        <FileIcon className="w-4 h-4 text-text-muted hover:text-text transition-colors" />
                    </Link>
                    <Link href={site.socials.linkedin} target="_blank" aria-label="LinkedIn">
                        <LinkedInIcon className="w-4 h-4 text-text-muted hover:text-text transition-colors" />
                    </Link>
                    <Link href={site.socials.github} target="_blank" aria-label="GitHub">
                        <GitHubIcon className="w-4 h-4 text-text-muted hover:text-text transition-colors" />
                    </Link>
                </div>
            </div>

            {/* Contact bar row — only on screens between xs and sm (below 640px but above ~400px) */}
            {siteWithExtras.contactBar && (
                <div className="hidden xs:block sm:hidden max-w-5xl mx-auto px-6 pb-1">
                    <p className="text-xs leading-snug contact-bar-content" style={{ color: "var(--text-muted)" }}>
                        {parseContactBar(siteWithExtras.contactBar)}
                    </p>
                </div>
            )}

            {/* ── Nav strip — hidden on small screens ──────────────────── */}
            <div className="hidden sm:block max-w-5xl mx-auto px-6 md:px-12 pb-2">
                <nav className="flex flex-wrap items-center gap-x-1">
                    {site.navigation.map(({ label, href, external }) => (
                        <Link
                            key={href}
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            className="nav-link text-sm px-3 py-1.5 no-underline hover:no-underline"
                            style={{ color: "#3670ae" }}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
