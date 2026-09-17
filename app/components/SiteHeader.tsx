"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FileIcon, GitHubIcon, LinkedInIcon } from "@/app/icons/Icons";
import site from "@/data/site.json";

const PILL_MAX_W = 700;
const PILL_H     = 44;
const BANNER_CLOSE_MS = 500;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// Only nav items with visible !== false are shown
const NAV_ITEMS = (site.navigation as (typeof site.navigation[number] & { visible?: boolean })[])
    .filter((n) => n.visible !== false);

type BannerData = { visible: boolean; text: string };

function parseInlineMarkdown(text: string): React.ReactNode[] {
    const PATTERN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0, key = 0;
    let match: RegExpExecArray | null;
    while ((match = PATTERN.exec(text)) !== null) {
        if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
        if (match[1])      nodes.push(<strong key={key++}>{match[1]}</strong>);
        else if (match[2]) nodes.push(<a key={key++} href={match[3]} target={match[3].startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{match[2]}</a>);
        else if (match[4]) nodes.push(<code key={key++}>{match[4]}</code>);
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes;
}

export default function SiteHeader() {
    const [progress, setProgress]     = useState(0);
    const [activeHref, setActiveHref] = useState<string>("");
    const [atBottom, setAtBottom]     = useState(false);
    const [expandedHeight, setExpandedHeight] = useState(0);
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [bannerClosing, setBannerClosing] = useState(false);

    const headerRef        = useRef<HTMLElement>(null);
    const expandedContentRef = useRef<HTMLDivElement>(null);
    const expandedTabRefs  = useRef<Map<string, HTMLAnchorElement>>(new Map());
    const collapsedTabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
    const expandedNavRef   = useRef<HTMLElement>(null);
    const collapsedNavRef  = useRef<HTMLElement>(null);

    // ── Measure expanded height ──────────────────────────────────────────────
    useEffect(() => {
        const measure = () => {
            if (expandedContentRef.current) {
                setExpandedHeight(expandedContentRef.current.scrollHeight);
            }
        };
        measure();
        const observer = new ResizeObserver(measure);
        if (expandedContentRef.current) observer.observe(expandedContentRef.current);
        window.addEventListener("resize", measure);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    // ── Scroll progress + bottom detection ──────────────────────────────────
    useEffect(() => {
        if (!expandedHeight) return;
        const onScroll = () => {
            setProgress(Math.min(Math.max(window.scrollY / expandedHeight, 0), 1));
            setAtBottom(
                window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight - 2
            );
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, [expandedHeight]);

    // ── Active section tracking ──────────────────────────────────────────────
    useEffect(() => {
        const anchors = NAV_ITEMS.filter((n) => !n.external && n.href.startsWith("#"));
        if (!anchors.length) return;
        const visible = new Set<string>();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                const href = `#${e.target.id}`;
                if (e.isIntersecting) visible.add(href); else visible.delete(href);
            });
            const next = anchors.find((a) => visible.has(a.href));
            if (next) setActiveHref(next.href);
        }, { threshold: 0.2 });
        anchors.forEach(({ href }) => {
            const el = document.querySelector(href);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    // ── Auto-scroll tab into view ────────────────────────────────────────────
    function scrollTabIntoView(href: string) {
        ([
            [expandedTabRefs.current, expandedNavRef.current],
            [collapsedTabRefs.current, collapsedNavRef.current],
        ] as [Map<string, HTMLAnchorElement>, HTMLElement | null][]).forEach(([tabMap, nav]) => {
            if (!nav) return;
            const tab = tabMap.get(href);
            if (!tab) return;
            const offset =
                tab.getBoundingClientRect().left -
                nav.getBoundingClientRect().left -
                nav.clientWidth / 2 +
                tab.offsetWidth / 2;
            nav.scrollBy({ left: offset, behavior: "smooth" });
        });
    }

    useEffect(() => { if (activeHref) scrollTabIntoView(activeHref); }, [activeHref]);

    useEffect(() => {
        if (atBottom) {
            const firstExternal = NAV_ITEMS.find((n) => n.external);
            if (firstExternal) scrollTabIntoView(firstExternal.href);
        }
    }, [atBottom]);

    const siteWithExtras = site as typeof site & {
        contactBar?: { visible: boolean; text: string };
        banner?: BannerData;
    };
    const contactBarText = siteWithExtras.contactBar?.visible
        ? siteWithExtras.contactBar.text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        : null;
    const banner = siteWithExtras.banner;

    const p = ease(progress);

    // Geometry
    const topGap  = lerp(0, 12, p);
    const radius  = lerp(0, 9999, p);
    const bgAlpha = lerp(1, 0.9, p);
    const blur_v  = lerp(0, 14, p);
    const shadow  = lerp(0, 1, p);
    const padV    = lerp(12, 7, p);
    const padH    = lerp(0, 16, p);
    const height  = expandedHeight ? lerp(expandedHeight, PILL_H, p) : undefined;
    // At p=0: full viewport width. At p=1: PILL_MAX_W px centred.
    const width   = `calc(${lerp(100, 0, p)}vw + ${lerp(0, PILL_MAX_W, p)}px)`;

    const expandedOpacity  = Math.max(0, 1 - p * 2.2);
    const collapsedOpacity = Math.max(0, p * 2.2 - 1.2);

    function tabClass(href: string, external: boolean) {
        let cls = "nav-tab shrink-0";
        if (external) cls += " nav-tab-external";
        if (atBottom && external)        cls += " nav-tab-external-active";
        else if (!atBottom && activeHref === href) cls += " nav-tab-active";
        return cls;
    }

    const ICONS = [
        { href: site.socials.resume,   label: "Resume",   Icon: FileIcon    },
        { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
        { href: site.socials.github,   label: "GitHub",   Icon: GitHubIcon   },
    ] as const;

    return (
        <>
            {/* Sticky placeholder — follows the animated header height in document flow. */}
            <div
                style={{
                    height: expandedHeight || undefined,
                    transition: bannerClosing ? `height ${BANNER_CLOSE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : undefined,
                }}
                className="sticky top-0 z-50 w-full pointer-events-none"
                aria-hidden="true"
            />

            {/* Visual header — fixed, morphs via scroll */}
            <header
                ref={headerRef}
                style={{
                    position: "fixed",
                    top: topGap,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width,
                    maxWidth: `calc(100vw - ${padH * 2}px)`,
                    height,
                    zIndex: 50,
                    borderRadius: radius,
                    background: `rgba(255,255,255,${bgAlpha})`,
                    backdropFilter: blur_v > 0.5 ? `blur(${blur_v}px)` : undefined,
                    WebkitBackdropFilter: blur_v > 0.5 ? `blur(${blur_v}px)` : undefined,
                    borderBottom: p < 0.9 ? `1px solid var(--border)` : undefined,
                    border: p >= 0.9 ? `1px solid var(--border)` : undefined,
                    boxShadow: shadow > 0.05
                        ? `0 4px 24px rgba(0,0,0,${0.10 * shadow}), 0 1px 4px rgba(0,0,0,${0.06 * shadow})`
                        : undefined,
                    overflow: "hidden",
                    transition: bannerClosing
                        ? `height ${BANNER_CLOSE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
                        : undefined,
                }}
            >
                {/* ── EXPANDED content ───────────────────────────────────── */}
                <div
                    ref={expandedContentRef}
                    style={{
                        opacity: expandedOpacity,
                        pointerEvents: p > 0.45 ? "none" : "auto",
                    }}
                    aria-hidden={p > 0.45}
                >
                    {/* Banner — inside expanded, hides as header morphs */}
                    {banner?.visible && !bannerDismissed && (
                        <div
                            className="w-full border-b"
                            style={{
                                background: "var(--banner-bg)",
                                borderColor: "var(--banner-border)",
                                maxHeight: bannerClosing ? 0 : 100,
                                opacity: bannerClosing ? 0 : 1,
                                overflow: "hidden",
                                transform: bannerClosing ? "translateX(-100%)" : "translateX(0)",
                                transition: `max-height ${BANNER_CLOSE_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${BANNER_CLOSE_MS}ms ease-out, transform ${BANNER_CLOSE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                            }}
                        >
                            <div className="max-w-5xl mx-auto px-6 md:px-12 py-2 flex items-center gap-3">
                                <p className="flex-1 text-sm text-center leading-snug banner-content" style={{ color: "var(--banner-text)" }}>
                                    {parseInlineMarkdown(banner.text)}
                                </p>
                                <button
                                    onClick={() => {
                                        if (bannerClosing) return;
                                        setBannerClosing(true);
                                        window.setTimeout(() => {
                                            setBannerDismissed(true);
                                            setBannerClosing(false);
                                        }, BANNER_CLOSE_MS);
                                    }}
                                    aria-label="Dismiss banner"
                                    className="shrink-0 rounded p-0.5 transition-opacity opacity-50 hover:opacity-100"
                                    style={{ color: "var(--banner-text)" }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="max-w-5xl mx-auto px-6 md:px-12 flex items-start gap-5"
                        style={{ paddingTop: padV, paddingBottom: padV }}>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 ring-border shrink-0 mt-0.5">
                            <Image src={site.headshot} alt={site.name} width={80} height={80} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-base font-semibold leading-tight" style={{ fontFamily: "var(--font-lora), serif", color: "var(--header-text)" }}>
                                        {site.name}
                                    </h1>
                                    <p className="text-xs leading-snug mt-0.5" style={{ color: "var(--text-muted)" }}>{site.role}</p>
                                    {contactBarText && (
                                        <p className="hidden xs:block text-xs leading-snug mt-0.5" style={{ color: "var(--text-muted)" }}>{contactBarText}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 shrink-0 pt-0.5">
                                    {ICONS.map(({ href, label, Icon }) => (
                                        <Link key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                                            <Icon className="w-4 h-4 text-gray-700 hover:text-gray-600 transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <nav ref={expandedNavRef} className="mt-2 flex items-center overflow-x-auto no-scrollbar" aria-label="Site navigation">
                                {NAV_ITEMS.map(({ label, href, external }, i) => (
                                    <Link key={href} href={href}
                                        target={external ? "_blank" : undefined}
                                        rel={external ? "noopener noreferrer" : undefined}
                                        ref={(el) => { if (el) expandedTabRefs.current.set(href, el); }}
                                        className={tabClass(href, !!external)}
                                    >{label}</Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* ── COLLAPSED pill content ─────────────────────────────── */}
                <div
                    style={{
                        opacity: collapsedOpacity,
                        pointerEvents: p < 0.55 ? "none" : "auto",
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0 1rem",
                    }}
                    aria-hidden={p < 0.55}
                >
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-border shrink-0">
                            <Image src={site.headshot} alt={site.name} width={28} height={28} className="object-cover w-full h-full" />
                        </div>
                        <span className="text-sm font-semibold hidden sm:block whitespace-nowrap"
                            style={{ fontFamily: "var(--font-lora), serif", color: "var(--header-text)" }}>
                            {site.name.split(" ")[0]}
                        </span>
                    </div>
                    <div className="w-px h-4 shrink-0 mx-0.5" style={{ background: "var(--border)" }} />
                    <nav ref={collapsedNavRef} className="flex items-center overflow-x-auto no-scrollbar min-w-0 flex-1" aria-label="Site navigation">
                        {NAV_ITEMS.map(({ label, href, external }) => (
                            <Link key={href} href={href}
                                target={external ? "_blank" : undefined}
                                rel={external ? "noopener noreferrer" : undefined}
                                ref={(el) => { if (el) collapsedTabRefs.current.set(href, el); }}
                                className={tabClass(href, !!external)}
                            >{label}</Link>
                        ))}
                    </nav>
                    <div className="flex items-center gap-3 shrink-0 ml-auto pl-1">
                        {ICONS.map(({ href, label, Icon }) => (
                            <Link key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                                <Icon className="w-3.5 h-3.5 text-gray-700 hover:text-gray-600 transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            </header>
        </>
    );
}
