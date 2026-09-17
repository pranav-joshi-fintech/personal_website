"use client";

import { useEffect, useRef, useState } from "react";
import { GitHubIcon } from "@/app/icons/Icons";
import { SectionHeading } from "@/app/components/SectionHeading";
import projectsData from "@/data/projects.json";

type Project = {
    title: string;
    description: string;
    url?: string;
    githubUrl?: string | null;
    technologies: string[];
};

const projects = projectsData as Project[];

function ProjectCard({ project }: { project: Project }) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [centred, setCentred] = useState(false);

    // On mobile: detect when the card is centred in the viewport
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setCentred(entry.intersectionRatio > 0.6),
            { threshold: [0, 0.6, 1] }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const href = project.url ?? project.githubUrl ?? "#";

    return (
        <a
            ref={cardRef}
            href={href}
            target={href !== "#" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`project-card${centred ? " project-card-centred" : ""}`}
            aria-label={`Open ${project.title}`}
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm leading-snug text-text">{project.title}</h3>
                {project.githubUrl && (
                    <span
                        onClick={(e) => { e.preventDefault(); window.open(project.githubUrl!, "_blank"); }}
                        className="shrink-0 text-gray-700 hover:text-gray-600 transition-colors cursor-pointer"
                        aria-label="View on GitHub"
                    >
                        <GitHubIcon className="w-4 h-4" />
                    </span>
                )}
            </div>

            <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-3">
                {project.description}
            </p>

            <div className="flex gap-1.5 flex-wrap">
                {project.technologies.map((tech) => (
                    <span
                        key={tech}
                        className="text-xs px-2 py-0.5 rounded-md bg-bg border border-border"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </a>
    );
}

export default function Projects() {
    return (
        <section id="projects">
            <SectionHeading>Projects</SectionHeading>
            {projects.length === 0 ? (
                <p className="text-sm text-text-muted">No projects yet — check back soon.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <ProjectCard key={project.title} project={project} />
                    ))}
                </div>
            )}
        </section>
    );
}
