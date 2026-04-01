import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import gsap from "gsap";
import {
    HiCheckCircle,
    HiXCircle,
    HiInformationCircle,
    HiExclamation,
    HiX,
} from "react-icons/hi";
import { hideToast } from "@features/ui/uiSlice";
import { selectToast } from "@features/ui/uiSlice";
import { useSelector } from "react-redux";

const ICONS = {
    success: <HiCheckCircle size={20} className="text-success" />,
    error: <HiXCircle size={20} className="text-danger" />,
    info: <HiInformationCircle size={20} className="text-info" />,
    warning: <HiExclamation size={20} className="text-warning" />,
};

const BORDERS = {
    success: "border-success/30",
    error: "border-danger/30",
    info: "border-info/30",
    warning: "border-warning/30",
};

const BARS = {
    success: "bg-success",
    error: "bg-danger",
    info: "bg-info",
    warning: "bg-warning",
};

const Toast = () => {
    const dispatch = useDispatch();
    const toast = useSelector(selectToast);
    const toastRef = useRef(null);
    const barRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!toast.visible) return;

        // ── Slide in ──────────────────────────────────
        gsap.fromTo(
            toastRef.current,
            { x: "110%", opacity: 0 },
            { x: "0%", opacity: 1, duration: 0.45, ease: "back.out(1.4)" }
        );

        // ── Progress bar ──────────────────────────────
        gsap.fromTo(
            barRef.current,
            { scaleX: 1 },
            {
                scaleX: 0,
                duration: toast.duration / 1000,
                ease: "none",
                transformOrigin: "left center",
            }
        );

        // ── Auto dismiss ──────────────────────────────
        timerRef.current = setTimeout(() => {
            handleDismiss();
        }, toast.duration);

        return () => clearTimeout(timerRef.current);
    }, [toast.visible, toast.message]);

    const handleDismiss = () => {
        clearTimeout(timerRef.current);
        gsap.to(toastRef.current, {
            x: "110%",
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => dispatch(hideToast()),
        });
    };

    if (!toast.visible) return null;

    return (
        <div
            ref={toastRef}
            className={`
        fixed bottom-6 right-6 z-[200]
        w-80 overflow-hidden
        card border ${BORDERS[toast.type] || BORDERS.info}
      `}
        >
            {/* Content */}
            <div className="flex items-start gap-3 p-4">
                <span className="shrink-0 mt-0.5">
                    {ICONS[toast.type] || ICONS.info}
                </span>

                <p className="text-sm text-white/90 flex-1 leading-relaxed">
                    {toast.message}
                </p>

                <button
                    onClick={handleDismiss}
                    className="shrink-0 p-0.5 rounded text-white/30 hover:text-white/70 transition-colors duration-200"
                >
                    <HiX size={14} />
                </button>
            </div>

            {/* Progress Bar */}
            <div
                ref={barRef}
                className={`h-0.5 w-full ${BARS[toast.type] || BARS.info} origin-left`}
            />
        </div>
    );
};

export default Toast;