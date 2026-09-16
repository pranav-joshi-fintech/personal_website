export function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <h2
                className="text-2xl font-semibold shrink-0"
                style={{ fontFamily: "var(--font-lora), serif" }}
            >
                {children}
            </h2>
            <div className="h-px flex-1 bg-border" />
        </div>
    );
}
