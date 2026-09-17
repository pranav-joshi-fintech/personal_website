import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { DM_Sans, Lora } from "next/font/google";
import Banner from "@/app/components/Banner";
import SiteHeader from "@/app/components/SiteHeader";
import Footer from "@/app/components/Footer";
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
                className="min-h-full"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
                <Banner />
                <SiteHeader />
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 md:py-8">
                    {children}
                </div>
                <Footer />
                <Analytics />
            </body>
        </html>
    );
}
