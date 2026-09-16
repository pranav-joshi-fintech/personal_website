import Image from "next/image";
import Link from "next/link";
import { ExternalLinkIcon } from "@/app/icons/Icons";
import { SectionHeading } from "@/app/components/SectionHeading";
import academicsData from "@/data/academics.json";

export default function Academics() {
    const sorted = [...academicsData].sort((a, b) => {
        const endA = a.endDate ? new Date(a.endDate) : new Date();
        const endB = b.endDate ? new Date(b.endDate) : new Date();
        return endB.getTime() - endA.getTime();
    });

    return (
        <section id="academics">
            <SectionHeading>Academics</SectionHeading>
            <div className="space-y-8">
                {sorted.map((item, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="shrink-0 w-11 h-11 rounded-lg border border-border overflow-hidden bg-white mt-0.5">
                            <Image
                                src={item.logo}
                                alt={item.institution}
                                width={44}
                                height={44}
                                className="object-contain w-full h-full p-1"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm leading-snug">{item.name}</div>

                            <div className="flex flex-wrap items-center gap-x-1.5 mt-0.5 text-sm text-text-muted">
                                {item.url ? (
                                    <Link
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-0.5 font-medium text-text no-underline hover:underline"
                                    >
                                        {item.institution}
                                        <ExternalLinkIcon className="w-3 h-3 opacity-60" />
                                    </Link>
                                ) : (
                                    <span className="font-medium text-text">{item.institution}</span>
                                )}
                                <span>·</span>
                                <span className="tabular-nums">
                                    {item.startDate} – {item.endDate ?? "Present"}
                                </span>
                            </div>

                            <p className="text-sm mt-1.5 leading-relaxed text-text-muted">
                                {item.description}
                            </p>

                            {item.topics.length > 0 && (
                                <div className="flex gap-1.5 flex-wrap mt-2">
                                    {item.topics.slice(0, 5).map((topic) => (
                                        <span
                                            key={topic}
                                            className="text-xs px-2 py-0.5 rounded-md bg-tag-bg border border-border"
                                        >
                                            {topic}
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
