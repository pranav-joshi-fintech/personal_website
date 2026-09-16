import Image from "next/image";
import Link from "next/link";
import site from "@/data/site.json";

export default function MobileAbout() {
    return (
        <aside className="md:hidden flex items-center gap-4 mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border border-border">
                <Image
                    src={site.headshot}
                    alt={site.name}
                    width={144}
                    height={144}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="flex flex-col gap-2">
                <div>
                    <h1
                        className="text-xl font-semibold leading-tight"
                        style={{ fontFamily: "var(--font-lora), serif" }}
                    >
                        {site.name}
                    </h1>
                    <p className="text-sm text-text-muted mt-0.5">{site.role}</p>
                </div>

                <div className="flex gap-3">
                    {site.navigation.filter(({ label }) => label === "My Posts").map(({ label, href, external }) => (
                        <Link
                            key={href}
                            href={href}
                            className="text-sm text-text-muted hover:text-text no-underline hover:no-underline"
                            target={external ? "_blank" : undefined}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}
