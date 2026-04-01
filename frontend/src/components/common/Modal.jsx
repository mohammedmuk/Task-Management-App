import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";
import gsap from "gsap";

const Modal = ({
    isOpen,
    onClose,
    title = "",
    children,
    size = "md",
    showClose = true,
    className = "",
}) => {

    const overlayRef = useRef(null);
    const panelRef = useRef(null);

    // ── Sizes ─────────────────────────────────────────
    const sizes = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-full mx-4",
    };

    // ── GSAP open animation ───────────────────────────
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";

            gsap.fromTo(
                overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.25, ease: "power2.out" }
            );
            gsap.fromTo(
                panelRef.current,
                { opacity: 0, scale: 0.92, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.35,
                    ease: "back.out(1.4)",
                }
            );
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // ── GSAP close animation ──────────────────────────
    const handleClose = () => {
        gsap.to(panelRef.current, {
            opacity: 0,
            scale: 0.92,
            y: 20,
            duration: 0.25,
            ease: "power2.in",
        });
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
            onComplete: onClose,
        });
    };

    // ── Keyboard ESC close ────────────────────────────
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape" && isOpen) handleClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={(e) => e.target === overlayRef.current && handleClose()}
        >
            <div
                ref={panelRef}
                className={`
          relative w-full ${sizes[size] || sizes.md}
          card overflow-hidden
          ${className}
        `}
            >
                {/* Header */}
                {(title || showClose) && (
                    <div className="
            flex items-center justify-between
            px-6 py-4 border-b border-white/5
          ">
                        {title && (
                            <h2 className="text-lg font-semibold font-display text-white">
                                {title}
                            </h2>
                        )}
                        {showClose && (
                            <button
                                onClick={handleClose}
                                className="ml-auto p-1.5 rounded-lg text-white/40 hover:text-whi hover:bg-white/10 transition-all duration-200"
                            >
                                <HiX size={18} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="px-6 py-5">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;