import { forwardRef, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

const Input = forwardRef(({
    label = "",
    name = "",
    type = "text",
    placeholder = "",
    value,
    onChange,
    error = "",
    hint = "",
    icon = null,
    iconRight = null,
    disabled = false,
    required = false,
    className = "",
    inputClass = "",
    ...props
}, ref) => {

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>

            {/* Label */}
            {label && (
                <label
                    htmlFor={name}
                    className="text-sm font-medium text-white/70"
                >
                    {label}
                    {required && (
                        <span className="text-danger ml-1">*</span>
                    )}
                </label>
            )}

            {/* Input Wrapper */}
            <div className="relative">

                {/* Left Icon */}
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-lg pointer-events-none">
                        {icon}
                    </div>
                )}

                {/* Input Field */}
                <input
                    ref={ref}
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`
            input
            ${icon ? "pl-10" : ""}
            ${isPassword || iconRight ? "pr-10" : ""}
            ${error ? "border-danger/50 focus:ring-danger/30" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${inputClass}
          `}
                    {...props}
                />

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors duration-200"
                    >
                        {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                    </button>
                )}

                {/* Right Icon (non-password) */}
                {iconRight && !isPassword && (
                    <div className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-white/30 pointer-events-none
          ">
                        {iconRight}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-xs text-danger flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            )}

            {/* Hint */}
            {hint && !error && (
                <p className="text-xs text-white/30">{hint}</p>
            )}
        </div>
    );
});

Input.displayName = "Input";
export default Input;