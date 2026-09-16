"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SectionHeading } from "../SectionHeading";
import { parseHighlight } from "./parseHighlight";
import site from "@/data/site.json";

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimate(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="about" className="space-y-6" ref={sectionRef}>
            <SectionHeading>About</SectionHeading>
            <div className="space-y-4 text-base leading-relaxed text-text/90">
                {site.intro.map((paragraph, i) => (
                    <p key={i}>
                        {parseHighlight(paragraph, animate, i)}
                    </p>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-lg gap-2 pt-1">
                {site.education.map((edu) => (
                    <div
                        key={edu.school}
                        className="flex items-center gap-3 rounded-lg border border-border bg-tag-bg px-3 py-2"
                    >
                        <div className="relative w-10 h-10 shrink-0">
                            <Image
                                src={edu.logo}
                                alt={edu.school}
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <div className="text-sm font-semibold leading-tight">{edu.degree}</div>
                            <div className="text-xs text-text-muted">{edu.school}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
