"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { GitHubIcon, LinkedInIcon } from "@/app/icons/Icons";
import site from "@/data/site.json";

// Nav items deduplicated: Resume is already in navigation, so icons only show LinkedIn + GitHub
const SOCIAL_ICONS = [
    { href: site.socials.linkedin, label: "LinkedIn",  Icon: LinkedInIcon },
    { href: site.socials.github,   label: "GitHub",    Icon: GitHubIcon   },
];

// Only anchor tabs get active-section tracking; external links never become "active"
const NAV_ITEMS = site.navigation;

export default function SiteHeader() {
    // progress: 0 = fully expanded, 1 = fully collapsed/pill
    const [progress, setProgress] = useState(0);
    const [activeHref, setActiveHref] = useState<string>("");
    const headerRef = useRef<HTMLElement>(null);
    const expandedTabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
    const collapsedTabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
    const expandedNavRef = useRef<HTMLElement>(null);
    const collapsedNavRef = useRef<HTMLElement>(null);

    // ── Scroll-driven transition ─────────────────────────────────────────────
    useEffect(() => {
        const onScroll = () => {
            const headerHeight = headerRef.current?.offsetHeight ?? 120;
            // Transition happens over the first full header height of scroll
            const p = Math.min(Math.max(window.scrollY / headerHeight, 0), 1);
            setProgress(p);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        // Run once on mount in case page loads mid-scroll
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ── Active section tracking via IntersectionObserver ────────────────────
    useEffect(() => {
        const anchors = NAV_ITEMS.filter((n) => !n.external && n.href.startsWith("#"));
        if (anchors.length === 0) return;

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

    // ── Auto-scroll active tab into view within its nav container ───────────
    useEffect(() => {
        if (!activeHref) return;
        const pairs: [Map<string, HTMLAnchorElement>, HTMLElement | null][] = [
            [expandedTabRefs.current, expandedNavRef.current],
            [collapsedTabRefs.current, collapsedNavRef.current],
        ];
        pairs.forEach(([tabMap, nav]) => {
            if (!nav) return;
            const tab = tabMap.get(activeHref);
            if (!tab) return;
            // Scroll the nav container so the tab is centred within it
            const navLeft = nav.getBoundingClientRect().left;
            const tabLeft = tab.getBoundingClientRect().left;
            const offset = tabLeft - navLeft - nav.clientWidth / 2 + tab.offsetWidth / 2;
            nav.scrollBy({ left: offset, behavior: "smooth" });
        });
    }, [activeHref]);

    const siteWithExtras = site as typeof site & {
        contactBar?: { visible: boolean; text: string };
        contactBar2?: { visible: boolean; text: string };
    };
    const contactBarText = siteWithExtras.contactBar?.visible ? siteWithExtras.contactBar.text : null;

    return (
        <>
            {/* ── EXPANDED HEADER ─────────────────────────────────────────── */}
            <header
                ref={headerRef}
                className="w-full bg-header-bg border-b border-border sticky top-0 z-40 will-change-transform"
                style={{
                    transform: `translateY(-${progress * 100}%)`,
                    opacity: 1 - progress * 1.5,   // fades out faster than it slides
                    pointerEvents: progress > 0.8 ? "none" : "auto",
                }}
            >
                <div className="max-w-5xl mx-auto px-6 md:px-12 pt-4 pb-3 flex items-start gap-5">
                    {/* Large avatar */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 ring-border shrink-0 mt-0.5">
                        <Image
                            src={site.headshot}
                            alt={site.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* Identity column */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1
                                    className="text-base font-semibold leading-tight"
                                    style={{ fontFamily: "var(--font-lora), serif", color: "var(--header-text)" }}
                                >
                                    {site.name}
                                </h1>
                                <p className="text-xs leading-snug mt-0.5" style={{ color: "var(--text-muted)" }}>
                                    {site.role}
                                </p>
                                {/* Contact bar — hidden on very small screens */}
                                {contactBarText && (
                                    <p className="hidden xs:block text-xs leading-snug mt-0.5 contact-bar-content" style={{ color: "var(--text-muted)" }}>
                                        {contactBarText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")}
                                    </p>
                                )}
                            </div>

                            {/* Social icons */}
                            <div className="flex items-center gap-3 shrink-0 pt-0.5">
                                {SOCIAL_ICONS.map(({ href, label, Icon }) => (
                                    <Link key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                                        <Icon className="w-4 h-4 transition-colors" style={{ color: "var(--text-muted)" }}
                                            onMouseEnter={(e: React.MouseEvent<SVGSVGElement>) => (e.currentTarget.style.color = "var(--text)")}
                                            onMouseLeave={(e: React.MouseEvent<SVGSVGElement>) => (e.currentTarget.style.color = "var(--text-muted)")}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Nav tabs — full row, swipeable on mobile */}
                        <nav ref={expandedNavRef} className="mt-2 flex items-center gap-x-0.5 overflow-x-auto no-scrollbar" aria-label="Site navigation">
                            {NAV_ITEMS.map(({ label, href, external }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noopener noreferrer" : undefined}
                                    ref={(el) => { if (el) expandedTabRefs.current.set(href, el); }}
                                    className={`nav-tab shrink-0${activeHref === href ? " nav-tab-active" : ""}`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* ── COLLAPSED FLOATING BAR ──────────────────────────────────── */}
            <div
                className="floating-bar"
                role="banner"
                aria-label="Compact navigation"
                style={{
                    opacity: progress,
                    transform: `translateX(-50%) translateY(${(1 - progress) * -16}px)`,
                    pointerEvents: progress < 0.2 ? "none" : "auto",
                }}
            >
                {/* Mini avatar + name */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-7 h-7 rounded-full overflow-hidden ring-1 shrink-0" style={{ ringColor: "var(--border)" }}>
                        <Image
                            src={site.headshot}
                            alt={site.name}
                            width={28}
                            height={28}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <span className="text-sm font-semibold hidden sm:block" style={{ fontFamily: "var(--font-lora), serif", color: "var(--header-text)" }}>
                        {site.name.split(" ")[0]}
                    </span>
                </div>

                {/* Divider */}
                <div className="w-px h-4 shrink-0" style={{ background: "var(--border)" }} />

                {/* Nav tabs — swipeable */}
                <nav ref={collapsedNavRef} className="flex items-center gap-x-0.5 overflow-x-auto no-scrollbar min-w-0" aria-label="Site navigation">
                    {NAV_ITEMS.map(({ label, href, external }) => (
                        <Link
                            key={href}
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            ref={(el) => { if (el) collapsedTabRefs.current.set(href, el); }}
                            className={`nav-tab shrink-0${activeHref === href ? " nav-tab-active" : ""}`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Social icons */}
                <div className="flex items-center gap-3 shrink-0 ml-auto pl-1">
                    {SOCIAL_ICONS.map(({ href, label, Icon }) => (
                        <Link key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                            <Icon className="w-3.5 h-3.5 transition-colors" style={{ color: "var(--text-muted)" }}
                                onMouseEnter={(e: React.MouseEvent<SVGSVGElement>) => (e.currentTarget.style.color = "var(--text)")}
                                onMouseLeave={(e: React.MouseEvent<SVGSVGElement>) => (e.currentTarget.style.color = "var(--text-muted)")}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
