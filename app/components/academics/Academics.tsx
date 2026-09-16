import { SectionHeading } from "@/app/components/SectionHeading";
import academicsData from "@/data/academics.json";

export default function Academics() {
    return (
        <section id="academics">
            <SectionHeading>Academics</SectionHeading>
            <div className="space-y-8">
                {academicsData.map((item, index) => (
                    <div key={index} className="flex gap-4">
                        {/* Icon badge — mirrors the company logo square in Experience */}
                        <div className="shrink-0 w-11 h-11 rounded-lg border border-border bg-tag-bg flex items-center justify-center text-xl mt-0.5">
                            {item.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm leading-snug">{item.category}</div>

                            <div className="mt-0.5 text-sm text-text-muted tabular-nums">
                                {item.date}
                            </div>

                            <p className="text-sm mt-1.5 leading-relaxed text-text-muted">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
