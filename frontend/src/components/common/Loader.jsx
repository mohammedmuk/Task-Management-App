import { useEffect, useRef } from "react";
import gsap from "gsap";

// ── Dot Loader (inline) ───────────────────────────────
export const DotLoader = ({ size = "md", className = "" }) => {
    const sizes = { sm: "w-1.5 h-1.5", md: "w-2 h-2", lg: "w-3 h-3" };
    const dotClass = `${sizes[size]} rounded-full bg-primary-400`;

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className={`${dotClass} animate-bounce`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    );
};

// ── Spinner (inline) ──────────────────────────────────
export const Spinner = ({ size = 20, className = "" }) => (
    <svg
        className={`animate-spin text-primary-400 ${className}`}
        style={{ width: size, height: size }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
        />
    </svg>
);

// ── Skeleton Loader ───────────────────────────────────
export const Skeleton = ({ className = "" }) => (
    <div
        className={`
      bg-white/5 rounded-xl animate-pulse
      ${className}
    `}
    />
);

// ── Task Card Skeleton ────────────────────────────────
export const TaskCardSkeleton = () => (
    <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-6 rounded-full" />
        </div>
    </div>
);

// ── Full Screen Loader ────────────────────────────────
const Loader = ({ message = "Loading..." }) => {
    const containerRef = useRef(null);
    const logoRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(
            containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        )
            .fromTo(
                logoRef.current,
                { scale: 0.5, opacity: 0, rotate: -180 },
                { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: "back.out(1.7)" }
            )
            .fromTo(
                textRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4 },
                "-=0.3"
            );

        // Pulse logo
        gsap.to(logoRef.current, {
            scale: 1.08,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-200"
        >
            {/* Glow Ring */}
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-xl scale-150 animate-pulse-slow" />

                {/* Logo Icon */}
                <div
                    ref={logoRef}
                    className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-glow"
                >
                    <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10">
                        <path
                            d="M8 11h10M8 16h14M8 21h8"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                        <circle cx="24" cy="21" r="4" fill="#22c55e" />
                        <path
                            d="M22.5 21l1 1 2-2"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* Text */}
            <div ref={textRef} className="mt-6 text-center space-y-2">
                <p className="text-white font-display font-semibold text-lg">
                    TaskFlow
                </p>
                <DotLoader className="justify-center" />
                <p className="text-white/40 text-sm">{message}</p>
            </div>
        </div>
    );
};

export default Loader;