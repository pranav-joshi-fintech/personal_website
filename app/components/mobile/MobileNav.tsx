import Link from "next/link";
import { FileIcon, GitHubIcon, LinkedInIcon } from "@/app/icons/Icons";
import site from "@/data/site.json";

export default function MobileNav() {
    return (
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-bg border-b border-border px-6 py-3 max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <span
                    className="font-semibold text-xl"
                    style={{ fontFamily: "var(--font-lora), serif" }}
                >
                    {site.name}
                </span>
            </div>

            <div className="flex items-center gap-5">
                <Link href={site.socials.resume} target="_blank" aria-label="Resume">
                    <FileIcon className="w-5 h-5 text-text-muted hover:text-accent transition-colors" />
                </Link>
                <Link
                    href={site.socials.linkedin}
                    target="_blank"
                    aria-label="LinkedIn"
                >
                    <LinkedInIcon className="w-5 h-5 text-text-muted hover:text-accent transition-colors" />
                </Link>
                <Link href={site.socials.github} target="_blank" aria-label="GitHub">
                    <GitHubIcon className="w-5 h-5 text-text-muted hover:text-accent transition-colors" />
                </Link>
            </div>
        </header>
    );
}
