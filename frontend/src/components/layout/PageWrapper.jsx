import { useEffect, useRef } from "react";
import gsap from "gsap";

const PageWrapper = ({ children, className = "" }) => {
    const wrapperRef = useRef(null);

    // ── Page Enter Animation ──────────────────────────
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const tl = gsap.timeline();

        tl.fromTo(
            el,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );

        return () => tl.kill();
    }, []);

    return (
        <div
            ref={wrapperRef}
            className={`min-h-full ${className}`}
        >
            {children}
        </div>
    );
};

export default PageWrapper;