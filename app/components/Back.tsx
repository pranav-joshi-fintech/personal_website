import Link from "next/link";

export default function Back({ href = "/" }: { href?: string }) {
    return (
        <Link
            href={href}
            className="text-sm text-text-muted hover:text-text no-underline hover:no-underline mb-6 inline-block"
        >
            ← Back
        </Link>
    );
}
