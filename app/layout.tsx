import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { DM_Sans, Lora } from "next/font/google";
import MobileNav from "@/app/components/mobile/MobileNav";
import "./globals.css";
import site from "@/data/site.json";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

const lora = Lora({
    variable: "--font-lora",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: `${site.name} | Portfolio`,
        template: `%s | ${site.name}`,
    },
    description: site.description,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${dmSans.variable} ${lora.variable} h-full antialiased`}>
            <body
                className="min-h-full max-w-5xl mx-auto px-6 md:px-12 gap-16 pt-24 pb-16 md:py-16"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
                <MobileNav />
                {children}
                <Analytics />
            </body>
        </html>
    );
}
