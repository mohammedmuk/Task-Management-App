import { useRef } from "react";
import gsap from "gsap";

const Button = ({
    children,
    variant = "primary",
    size = "md",
    type = "button",
    loading = false,
    disabled = false,
    icon = null,
    iconRight = false,
    fullWidth = false,
    onClick,
    className = "",
    ...props
}) => {

    const btnRef = useRef(null);

    // ── Variants ─────────────────────────────────────
    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        danger: "btn-danger",
        ghost: "btn-ghost",
        gradient:
            "btn bg-gradient-to-r from-primary-600 to-violet-600 " +
            "hover:from-primary-500 hover:to-violet-500 text-white shadow-glow-sm hover:shadow-glow",
    };

    // ── Sizes ─────────────────────────────────────────
    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
        xl: "px-8 py-4 text-lg",
    };

    const classes = [
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? "w-full" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            ref={btnRef}
            type={type}
            disabled={disabled || loading}
            className={classes}
            onClick={onClick}
            {...props}
        >
            {/* Loading Spinner */}
            {loading && (
                <svg
                    className="animate-spin h-4 w-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                    />
                </svg>
            )}

            {/* Left Icon */}
            {!loading && icon && !iconRight && (
                <span className="shrink-0">{icon}</span>
            )}

            {/* Label */}
            <span>{children}</span>

            {/* Right Icon */}
            {!loading && icon && iconRight && (
                <span className="shrink-0">{icon}</span>
            )}
        </button>
    );
};

export default Button;