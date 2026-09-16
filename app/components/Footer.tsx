import site from "@/data/site.json";

export default function Footer() {
    const siteWithFooter = site as typeof site & { footer?: string };
    if (!siteWithFooter.footer) return null;

    return (
        <footer className="max-w-5xl mx-auto px-6 md:px-12 pb-10 pt-4">
            <div className="border-t border-border pt-6 text-center">
                <p className="text-sm text-text-muted">{siteWithFooter.footer}</p>
            </div>
        </footer>
    );
}
