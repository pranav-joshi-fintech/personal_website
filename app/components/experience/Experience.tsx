import Image from "next/image";
import { ExternalLinkIcon } from "@/app/icons/Icons";
import { SectionHeading } from "@/app/components/SectionHeading";
import Link from "next/link";
import experienceData from "@/data/experience.json";

export default function Experience() {
    const sortedExperienceData = [...experienceData].sort((a, b) => {
        const endDateA = a.endDate ? new Date(a.endDate) : new Date();
        const endDateB = b.endDate ? new Date(b.endDate) : new Date();
        return endDateB.getTime() - endDateA.getTime();
    });
    return (
        <section id="experience">
            <SectionHeading>Experience</SectionHeading>
            <div className="space-y-8">
                {sortedExperienceData.map((exp, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="shrink-0 w-11 h-11 rounded-lg border border-border overflow-hidden bg-white mt-0.5">
                            <Image
                                src={exp.companyLogo}
                                alt={exp.company}
                                width={36}
                                height={36}
                                className="object-cover w-full h-full"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm leading-snug">{exp.title}</div>

                            <div className="flex flex-wrap items-center gap-x-1.5 mt-0.5 text-sm text-text-muted">
                                {exp.companyUrl ? (
                                    <Link
                                        href={exp.companyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-0.5 font-medium text-text no-underline hover:underline"
                                    >
                                        {exp.company}
                                        <ExternalLinkIcon className="w-3 h-3 opacity-60" />
                                    </Link>
                                ) : (
                                    <span className="font-medium text-text">{exp.company}</span>
                                )}
                                <span>·</span>
                                <span>{exp.location.split(",")[0]}</span>
                                <span>·</span>
                                <span className="tabular-nums">
                                    {exp.startDate} - {exp.endDate ? exp.endDate : "Present"}
                                </span>
                            </div>

                            <p className="text-sm mt-1.5 leading-relaxed text-text-muted">
                                {exp.summary}
                            </p>

                            {exp.technologies.length > 0 && (
                                <div className="flex gap-1.5 flex-wrap mt-2">
                                    {exp.technologies.slice(0, 5).map((tech) => (
                                        <span
                                            key={tech}
                                            className="text-xs px-2 py-0.5 rounded-md bg-tag-bg border border-border"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
