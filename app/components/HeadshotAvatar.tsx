"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "motion/react";

const OPEN_MS = 200;
const CLOSE_MS = OPEN_MS * 0.8; // closing is 20% faster
const HOLD_MS = 350;
const MOVE_TOLERANCE_PX = 10;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type Origin = { x: number; y: number; scale: number; diameter: number };

// Tracks pinch-zoom so the avatar can request a sharper image. Ctrl/Cmd-zoom
// changes devicePixelRatio, which the browser already handles via srcset.
function usePinchZoom() {
    const [zoom, setZoom] = useState(1);
    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;
        // Round to half steps and never step down, so we don't re-render on
        // every resize event or swap back to a blurrier image.
        const update = () => setZoom((z) => Math.max(z, Math.ceil(vv.scale * 2) / 2));
        update();
        vv.addEventListener("resize", update);
        return () => vv.removeEventListener("resize", update);
    }, []);
    return zoom;
}

type Props = {
    src: string;
    alt: string;
    /** Rendered size of the avatar in CSS px (largest breakpoint). */
    size: number;
    className?: string;
};

export default function HeadshotAvatar({ src, alt, size, className }: Props) {
    const zoom = usePinchZoom();
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [origin, setOrigin] = useState<Origin>({ x: 0, y: 0, scale: 0, diameter: 0 });

    const avatarRef = useRef<HTMLDivElement>(null);
    const holdTimer = useRef<number | null>(null);
    const pressStart = useRef({ x: 0, y: 0 });
    const downOnBackdrop = useRef(false);

    // Where the overlay circle sits when "closed": exactly on top of the avatar.
    function measureOrigin(
        diameter = Math.min(window.innerWidth, window.innerHeight) * 0.85,
    ): Origin {
        const rect = avatarRef.current!.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - window.innerWidth / 2,
            y: rect.top + rect.height / 2 - window.innerHeight / 2,
            scale: rect.width / diameter,
            diameter,
        };
    }

    function cancelHold() {
        if (holdTimer.current !== null) {
            window.clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
    }

    function openOverlay() {
        holdTimer.current = null;
        setOrigin(measureOrigin());
        setOpen(true);
    }

    function closeOverlay() {
        // Avatar may have moved (header morphs on scroll); keep the open diameter.
        setOrigin(measureOrigin(origin.diameter));
        setOpen(false);
    }

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeOverlay(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    useEffect(() => cancelHold, []);

    const closed = {
        x: origin.x,
        y: origin.y,
        scale: origin.scale,
        transition: { duration: CLOSE_MS / 1000, ease: EASE_OUT },
        transitionEnd: { visibility: "hidden" as const },
    };
    const opened = {
        x: 0,
        y: 0,
        scale: 1,
        visibility: "visible" as const,
        transition: { duration: OPEN_MS / 1000, ease: EASE_OUT },
    };

    return (
        <>
            <div
                ref={avatarRef}
                className={`${className ?? ""} select-none`}
                style={{ WebkitTouchCallout: "none" }}
                onPointerDown={(e) => {
                    if (e.button !== 0) return;
                    pressStart.current = { x: e.clientX, y: e.clientY };
                    if (!mounted) {
                        // Mount the overlay now so the HD image loads during the hold.
                        setOrigin(measureOrigin());
                        setMounted(true);
                    }
                    cancelHold();
                    holdTimer.current = window.setTimeout(openOverlay, HOLD_MS);
                }}
                onPointerMove={(e) => {
                    if (holdTimer.current === null) return;
                    const dx = e.clientX - pressStart.current.x;
                    const dy = e.clientY - pressStart.current.y;
                    if (Math.hypot(dx, dy) > MOVE_TOLERANCE_PX) cancelHold();
                }}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                onPointerCancel={cancelHold}
                onContextMenu={(e) => e.preventDefault()}
            >
                <Image
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    sizes={`${Math.ceil(size * zoom)}px`}
                    draggable={false}
                    className="object-cover w-full h-full"
                />
            </div>

            {mounted && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                    role="dialog"
                    aria-modal={open}
                    aria-hidden={!open}
                    aria-label={alt}
                >
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: "rgba(0,0,0,0.75)",
                            pointerEvents: open ? "auto" : "none",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: open ? 1 : 0,
                            transition: { duration: (open ? OPEN_MS : CLOSE_MS) / 1000, ease: "easeOut" },
                        }}
                        onPointerDown={() => { downOnBackdrop.current = true; }}
                        onClick={() => {
                            // Ignore the release of the press that opened the overlay.
                            if (downOnBackdrop.current) closeOverlay();
                            downOnBackdrop.current = false;
                        }}
                    />
                    <motion.div
                        className="relative rounded-full overflow-hidden select-none"
                        style={{
                            width: origin.diameter,
                            height: origin.diameter,
                            pointerEvents: open ? "auto" : "none",
                            WebkitTouchCallout: "none",
                        }}
                        initial={{ x: origin.x, y: origin.y, scale: origin.scale, visibility: "hidden" }}
                        animate={open ? opened : closed}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            sizes={`${Math.ceil(origin.diameter)}px`}
                            loading="eager"
                            draggable={false}
                            className="object-cover"
                        />
                    </motion.div>
                </div>,
                document.body,
            )}
        </>
    );
}
