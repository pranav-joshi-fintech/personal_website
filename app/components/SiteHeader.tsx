"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FileIcon, GitHubIcon, LinkedInIcon } from "@/app/icons/Icons";
import site from "@/data/site.json";

const ICON_COLOR = "#9ca3af"; // soft grey (tailwind gray-400)
const ICON_HOVER = "#374151"; // gray-700

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export default function SiteHeader() {
    const [progress, setProgress] = useState(0);
    const [activeHref, setActiveHref] = useState<string>("");
    const [atBottom, setAtBottom] = useState(false);
    // The sticky placeholder keeps document-flow height; the visual header morphs inside it
    const placeholderRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLElement>(null);
    const expandedTabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
    const collapsedTabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
    const expandedNavRef = useRef<HTMLElement>(null);
    const collapsedNavRef = useRef<HTMLElement>(null);

    // ── Scroll-driven progress + bottom-of-page detection ───────────────────
    useEffect(() => {
        const onScroll = () => {
            const h = placeholderRef.current?.offsetHeight ?? 120;
            setProgress(Math.min(Math.max(window.scrollY / h, 0), 1));

            const atBottom =
                window.scrollY + window.innerHeight >=
                document.documentElement.scrollHeight - 2;
            setAtBottom(atBottom);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ── Active section tracking ──────────────────────────────────────────────
    useEffect(() => {
        const anchors = site.navigation.filter(
            (n) => !n.external && n.href.startsWith("#")
        );
        if (!anchors.length) return;
        const visible = new Set<string>();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    const href = `#${e.target.id}`;
                    if (e.isIntersecting) visible.add(href);
                    else visible.delete(href);
                });
                const next = anchors.find((a) => visible.has(a.href));
                if (next) setActiveHref(next.href);
            },
            { threshold: 0.2 }
        );
        anchors.forEach(({ href }) => {
            const el = document.querySelector(href);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    // ── Auto-scroll active tab within its nav container ──────────────────────
    useEffect(() => {
        if (!activeHref) return;
        (
            [
                [expandedTabRefs.current, expandedNavRef.current],
                [collapsedTabRefs.current, collapsedNavRef.current],
            ] as [Map<string, HTMLAnchorElement>, HTMLElement | null][]
        ).forEach(([tabMap, nav]) => {
            if (!nav) return;
            const tab = tabMap.get(activeHref);
            if (!tab) return;
            const offset =
                tab.getBoundingClientRect().left -
                nav.getBoundingClientRect().left -
                nav.clientWidth / 2 +
                tab.offsetWidth / 2;
            nav.scrollBy({ left: offset, behavior: "smooth" });
        });
    }, [activeHref]);

    const siteWithExtras = site as typeof site & {
        contactBar?: { visible: boolean; text: string };
    };
    const contactBarText = siteWithExtras.contactBar?.visible
        ? siteWithExtras.contactBar.text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        : null;

    const p = ease(progress);

    // Morph values
    // Width: interpolate from 100vw → capped pill width via maxWidth + centering
    const pillMaxW   = 700;                      // px — pill max width
    const topGap     = lerp(0, 12, p);           // lift off top edge
    const radius     = lerp(0, 9999, p);         // square → pill
    const bgAlpha    = lerp(1, 0.9, p);
    const blur       = lerp(0, 14, p);
    const shadow     = lerp(0, 1, p);
    const padV       = lerp(12, 6, p);           // vertical padding compression
    const padH       = lerp(0, 16, p);           // side margin grows as it pills

    // Content cross-fade thresholds
    const expandedOpacity  = Math.max(0, 1 - p * 2.5);
    const collapsedOpacity = Math.max(0, p * 2.5 - 1.5);

    // Active tab: when at bottom, highlight external links instead of last section
    function tabClass(href: string, external: boolean) {
        let cls = "nav-tab shrink-0";
        if (external) cls += " nav-tab-external";
        if (atBottom && external) cls += " nav-tab-external-active";
        else if (!atBottom && activeHref === href) cls += " nav-tab-active";
        return cls;
    }

    return (
        <>
            {/* ── STICKY PLACEHOLDER — holds document-flow height ─────────── */}
            <div ref={placeholderRef} className="sticky top-0 z-50 w-full pointer-events-none" aria-hidden="true" />

            {/* ── VISUAL HEADER — fixed, morphs between full-bar and pill ──── */}
            <header
                ref={visualRef}
                style={{
                    position: "fixed",
                    top: topGap,
                    left: "50%",
                    transform: "translateX(-50%)",
                    // Width shrinks from 100vw → pillMaxW over scroll
                    width: `calc(${lerp(100, 0, p)}vw + ${lerp(0, pillMaxW, p)}px)`,
                    maxWidth: `calc(100vw - ${padH * 2}px)`,
                    zIndex: 50,
                    borderRadius: radius,
                    background: `rgba(255,255,255,${bgAlpha})`,
                    backdropFilter: blur > 0.5 ? `blur(${blur}px)` : undefined,
                    WebkitBackdropFilter: blur > 0.5 ? `blur(${blur}px)` : undefined,
                    borderBottom: p < 0.9 ? `1px solid var(--border)` : undefined,
                    border: p >= 0.9 ? `1px solid var(--border)` : undefined,
                    boxShadow: shadow > 0.05
                        ? `0 4px 24px rgba(0,0,0,${0.10 * shadow}), 0 1px 4px rgba(0,0,0,${0.06 * shadow})`
                        : undefined,
                    overflow: "hidden",
                    paddingTop: padV,
                    paddingBottom: padV,
                }}
            >
                {/* ── EXPANDED CONTENT — fades out first half ───────────────── */}
                <div
                    style={{ opacity: expandedOpacity, pointerEvents: p > 0.4 ? "none" : "auto" }}
                    aria-hidden={p > 0.4}
                >
                    <div className="max-w-5xl mx-auto px-6 md:px-12 flex items-start gap-5">
                        {/* Avatar */}
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 ring-border shrink-0 mt-0.5">
                            <Image src={site.headshot} alt={site.name} width={80} height={80} className="object-cover w-full h-full" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-base font-semibold leading-tight" style={{ fontFamily: "var(--font-lora), serif", color: "var(--header-text)" }}>
                                        {site.name}
                                    </h1>
                                    <p className="text-xs leading-snug mt-0.5" style={{ color: "var(--text-muted)" }}>
                                        {site.role}
                                    </p>
                                    {contactBarText && (
                                        <p className="hidden xs:block text-xs leading-snug mt-0.5" style={{ color: "var(--text-muted)" }}>
                                            {contactBarText}
                                        </p>
                                    )}
                                </div>
                                {/* Icons */}
                                <div className="flex items-center gap-3 shrink-0 pt-0.5">
                                    {[
                                        { href: site.socials.resume,   label: "Resume",   Icon: FileIcon    },
                                        { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
                                        { href: site.socials.github,   label: "GitHub",   Icon: GitHubIcon   },
                                    ].map(({ href, label, Icon }) => (
                                        <Link key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                                            <Icon className="w-4 h-4 transition-colors"
                                                style={{ color: ICON_COLOR }}
                                                onMouseEnter={(e: React.MouseEvent<SVGSVGElement>) => (e.currentTarget.style.color = ICON_HOVER)}
                                                onMouseLeave={(e: React.MouseEvent<SVGSVGElement>) => (e.currentTarget.style.color = ICON_COLOR)}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Nav tabs */}
                            <nav ref={expandedNavRef} className="mt-2 flex items-center overflow-x-auto no-scrollbar" aria-label="Site navigation">
                                {site.navigation.map(({ label, href, external }, i) => {
                                    // Divider before first external item
                                    const prevWasInternal = i > 0 && !site.navigation[i - 1].external;
                                    const showDivider = external && prevWasInternal;
                                    return (
                                        <React.Fragment key={href}>
                                            {showDivider && (
                                                <div className="w-px h-4 shrink-0 mx-1" style={{ background: "var(--border)" }} />
                                            )}
                                            <Link
                                                href={href}
                                                target={external ? "_blank" : undefined}
                                                rel={external ? "noopener noreferrer" : undefined}
                                                ref={(el) => { if (el) expandedTabRefs.current.set(href, el); }}
                                                className={tabClass(href, external)}
                                            >{label}</Link>
                                        </React.Fragment>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* ── COLLAPSED CONTENT — fades in second half ─────────────── */}
                <div
                    style={{
                        opacity: collapsedOpacity,
                        pointerEvents: p < 0.6 ? "none" : "auto",
                        position: "absolute",
                        inset: `0 0 0 0`,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: `${padV}px 1rem`,
                    }}
                    aria-hidden={p < 0.6}
                >
                    {/* Mini avatar + first name */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-border shrink-0">
                            <Image src={site.headshot} alt={site.name} width={28} height={28} className="object-cover w-full h-full" />
                        </div>
                        <span className="text-sm font-semibold hidden sm:block whitespace-nowrap" style={{ fontFamily: "var(--font-lora), serif", color: "var(--header-text)" }}>
                            {site.name.split(" ")[0]}
                        </span>
                    </div>

                    <div className="w-px h-4 shrink-0 mx-0.5" style={{ background: "var(--border)" }} />

                    {/* Nav tabs */}
                    <nav ref={collapsedNavRef} className="flex items-center overflow-x-auto no-scrollbar min-w-0 flex-1" aria-label="Site navigation">
                        {site.navigation.map(({ label, href, external }, i) => {
                            const prevWasInternal = i > 0 && !site.navigation[i - 1].external;
                            const showDivider = external && prevWasInternal;
                            return (
                                <React.Fragment key={href}>
                                    {showDivider && (
                                        <div className="w-px h-4 shrink-0 mx-1" style={{ background: "var(--border)" }} />
                                    )}
                                    <Link
                                        href={href}
                                        target={external ? "_blank" : undefined}
                                        rel={external ? "noopener noreferrer" : undefined}
                                        ref={(el) => { if (el) collapsedTabRefs.current.set(href, el); }}
                                        className={tabClass(href, external)}
                                    >{label}</Link>
                                </React.Fragment>
                            );
                        })}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center gap-3 shrink-0 ml-auto pl-1">
                        {[
                            { href: site.socials.resume,   label: "Resume",   Icon: FileIcon    },
                            { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
                            { href: site.socials.github,   label: "GitHub",   Icon: GitHubIcon   },
                        ].map(({ href, label, Icon }) => (
                            <Link key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                                <Icon className="w-3.5 h-3.5 transition-colors"
                                    style={{ color: ICON_COLOR }}
                                    onMouseEnter={(e: React.MouseEvent<SVGSVGElement>) => (e.currentTarget.style.color = ICON_HOVER)}
                                    onMouseLeave={(e: React.MouseEvent<SVGSVGElement>) => (e.currentTarget.style.color = ICON_COLOR)}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </header>
        </>
    );
}
