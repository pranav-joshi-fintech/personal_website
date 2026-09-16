"use client";

import { useEffect, useRef, useState } from "react";
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
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const resetTimer = () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
            hideTimer.current = setTimeout(() => setVisible(false), 3000);
        };

        const onScroll = () => {
            const y = window.scrollY;
            const goingUp = y < lastScrollY.current;

            if (y < 50 || goingUp) {
                setVisible(true);
                resetTimer();
            } else {
                setVisible(false);
                if (hideTimer.current) clearTimeout(hideTimer.current);
            }
            lastScrollY.current = y;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, []);

    const siteWithExtras = site as typeof site & { contactBar?: string };

    return (
        <header
            className="w-full bg-header-bg text-header-text sticky top-0 z-50 transition-transform duration-300"
            style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
        >
            {/* ── Identity row ─────────────────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 py-4 flex items-center gap-5">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20 shrink-0">
                    <Image
                        src={site.headshot}
                        alt={site.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h1
                        className="text-base font-semibold leading-tight text-header-text"
                        style={{ fontFamily: "var(--font-lora), serif" }}
                    >
                        {site.name}
                    </h1>
                    <p className="text-xs leading-tight" style={{ color: "rgba(245,243,238,0.5)" }}>{site.role}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <Link href={site.socials.resume} target="_blank" aria-label="Resume">
                        <FileIcon className="w-4 h-4 text-white/40 hover:text-white/90 transition-colors" />
                    </Link>
                    <Link href={site.socials.linkedin} target="_blank" aria-label="LinkedIn">
                        <LinkedInIcon className="w-4 h-4 text-white/40 hover:text-white/90 transition-colors" />
                    </Link>
                    <Link href={site.socials.github} target="_blank" aria-label="GitHub">
                        <GitHubIcon className="w-4 h-4 text-white/40 hover:text-white/90 transition-colors" />
                    </Link>
                </div>
            </div>

            {/* ── Nav strip ────────────────────────────────────────────── */}
            <div className="border-t border-white/10">
                <nav className="max-w-5xl mx-auto px-6 md:px-12 flex items-center gap-1 overflow-x-auto">
                    {site.navigation.map(({ label, href, external }) => (
                        <Link
                            key={href}
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            className="nav-link shrink-0 text-sm px-3 py-2.5 no-underline hover:no-underline"
                            style={{ color: "rgba(245,243,238,0.6)" }}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* ── Contact bar (resume-style) ────────────────────────────── */}
            {siteWithExtras.contactBar && (
                <div className="border-t border-white/10">
                    <div className="max-w-5xl mx-auto px-6 md:px-12 py-1.5 flex items-center justify-center">
                        <p className="text-xs text-center contact-bar-content" style={{ color: "rgba(245,243,238,0.45)" }}>
                            {parseContactBar(siteWithExtras.contactBar)}
                        </p>
                    </div>
                </div>
            )}
        </header>
    );
}
