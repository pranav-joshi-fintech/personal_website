import Link from "next/link";
import { FileIcon, GitHubIcon, LinkedInIcon } from "@/app/icons/Icons";
import Image from "next/image";
import site from "@/data/site.json";

export default function DesktopHeader() {
    return (
        <aside className="hidden md:flex flex-col w-52 shrink-0 sticky top-16 self-start h-[calc(100vh-8rem)] gap-6 mr-2">
            <div className="flex flex-col items-start gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border border-border">
                    <Image
                        src={site.headshot}
                        alt={site.name}
                        width={144}
                        height={144}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div>
                    <h1
                        className="text-xl font-semibold leading-tight"
                        style={{ fontFamily: "var(--font-lora), serif" }}
                    >
                        {site.name}
                    </h1>
                    <p className="text-sm text-text-muted mt-0.5">{site.role}</p>
                </div>
            </div>

            <nav className="flex flex-col gap-1">
                {site.navigation.map(({ label, href, external }) => (
                    <Link
                        key={href}
                        href={href}
                        scroll={true}
                        className="text-sm text-text-muted hover:text-text transition-colors px-0 py-1 no-underline hover:no-underline"
                        prefetch={label === "Blog"}
                        target={external ? "_blank" : undefined}
                    >
                        {label}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-4 mt-auto">
                <Link href={site.socials.resume} target="_blank" aria-label="Resume">
                    <FileIcon className="w-5 h-5 text-gray-700 hover:text-gray-600 transition-colors" />
                </Link>
                <Link
                    href={site.socials.linkedin}
                    target="_blank"
                    aria-label="LinkedIn"
                >
                    <LinkedInIcon className="w-5 h-5 text-gray-700 hover:text-gray-600 transition-colors" />
                </Link>
                <Link href={site.socials.github} target="_blank" aria-label="GitHub">
                    <GitHubIcon className="w-5 h-5 text-gray-700 hover:text-gray-600 transition-colors" />
                </Link>
            </div>
        </aside>
    );
}
