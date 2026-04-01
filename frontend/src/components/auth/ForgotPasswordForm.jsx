import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { HiMail } from "react-icons/hi";
import AuthLayout from "./AuthLayout";
import Button from "@components/common/Button";
import Input from "@components/common/Input";
import useAuth from "@hooks/useAuth";

// ── Step Indicator ─────────────────────────────────────
const Steps = ({ current }) => {
    const STEPS = ["Enter Email", "Get Code", "Reset"];

    return (
        <div className="flex items-center gap-2 mb-8">
            {STEPS.map((label, i) => {
                const step = i + 1;
                const active = current === step;
                const done = current > step;

                return (
                    <div key={i} className="flex items-center gap-2 flex-1">
                        <div className="flex flex-col items-center gap-1">
                            <div className={`
                w-7 h-7 rounded-full text-xs font-bold
                flex items-center justify-center
                transition-all duration-300
                ${done ? "bg-success text-white" :
                                    active ? "bg-primary-600 text-white shadow-glow-sm" :
                                        "bg-white/10 text-white/30"
                                }
              `}>
                                {done ? "✓" : step}
                            </div>
                            <span className={`
                text-[10px] whitespace-nowrap font-medium
                ${active ? "text-primary-400" :
                                    done ? "text-success" :
                                        "text-white/25"
                                }
              `}>
                                {label}
                            </span>
                        </div>

                        {/* Connector */}
                        {i < STEPS.length - 1 && (
                            <div className={`
                flex-1 h-px mb-4 transition-all duration-300
                ${done ? "bg-success/50" : "bg-white/10"}
              `} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const ForgotPasswordForm = () => {
    const {
        generateCode,
        forgotPassword,
        loading,
        error,
        successMsg,
        codeRequested,
        clearMessages,
    } = useAuth();

    const formRef = useRef(null);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        email: "",
        code: "",
        newPassword: "",
        confirm: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        gsap.fromTo(
            formRef.current?.children || [],
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" }
        );
        return () => clearMessages();
    }, []);

    // Advance step when code is requested
    useEffect(() => {
        if (codeRequested && step === 1) setStep(2);
    }, [codeRequested]);

    const animateNextStep = () => {
        gsap.fromTo(
            formRef.current,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }
        );
    };

    // ── Step 1: Request Code ──────────────────────────
    const handleRequestCode = async (e) => {
        e.preventDefault();
        if (!form.email) {
            setErrors({ email: "Email is required" });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setErrors({ email: "Enter a valid email" });
            return;
        }
        setErrors({});
        await generateCode({ email: form.email, endpoint: "forgot-password" });
    };

    // ── Step 2: Verify Code ───────────────────────────
    const handleVerifyCode = (e) => {
        e.preventDefault();
        if (!form.code || form.code.length < 6) {
            setErrors({ code: "Enter the 6-digit code" });
            return;
        }
        setErrors({});
        setStep(3);
        animateNextStep();
    };

    // ── Step 3: Reset Password ────────────────────────
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const e2 = {};
        if (!form.newPassword || form.newPassword.length < 8)
            e2.newPassword = "At least 8 characters";
        if (form.newPassword !== form.confirm)
            e2.confirm = "Passwords do not match";
        if (Object.keys(e2).length) { setErrors(e2); return; }
        setErrors({});
        await forgotPassword({
            email: form.email,
            code: form.code,
            new_password: form.newPassword,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    return (
        <AuthLayout
            title="Reset password"
            subtitle="Follow the steps to reset your password"
            backTo="/login"
            backLabel="Back to login"
        >
            {/* Step Indicator */}
            <Steps current={step} />

            <div ref={formRef}>

                {/* Error / Success */}
                {error && (
                    <div className="
            flex items-center gap-2
            bg-danger/10 border border-danger/20
            rounded-xl px-4 py-3 text-danger text-sm mb-5
          ">
                        <span>⚠️</span> {error}
                    </div>
                )}
                {successMsg && step < 3 && (
                    <div className="
            flex items-center gap-2
            bg-success/10 border border-success/20
            rounded-xl px-4 py-3 text-success text-sm mb-5
          ">
                        <span>✅</span> {successMsg}
                    </div>
                )}

                {/* ── Step 1 ──────────────────────────────── */}
                {step === 1 && (
                    <form onSubmit={handleRequestCode} className="space-y-5" noValidate>
                        <Input
                            label="Email address"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                            icon={<HiMail />}
                            required
                        />
                        <Button
                            type="submit"
                            variant="gradient"
                            size="lg"
                            fullWidth
                            loading={loading}
                        >
                            {loading ? "Sending code..." : "Send Reset Code"}
                        </Button>
                    </form>
                )}

                {/* ── Step 2 ──────────────────────────────── */}
                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-5" noValidate>
                        <div className="
              bg-primary-500/10 border border-primary-500/20
              rounded-xl px-4 py-3 text-sm text-primary-300
            ">
                            📧 Code sent to <strong>{form.email}</strong>
                        </div>

                        <Input
                            label="Verification code"
                            name="code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={form.code}
                            onChange={handleChange}
                            error={errors.code}
                            required
                        />

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                onClick={() => { setStep(1); clearMessages(); }}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="gradient"
                                size="lg"
                                fullWidth
                                loading={loading}
                            >
                                Verify Code
                            </Button>
                        </div>
                    </form>
                )}

                {/* ── Step 3 ──────────────────────────────── */}
                {step === 3 && (
                    <form
                        onSubmit={handleResetPassword}
                        className="space-y-5"
                        noValidate
                    >
                        {successMsg && (
                            <div className="
                flex items-center gap-2
                bg-success/10 border border-success/20
                rounded-xl px-4 py-3 text-success text-sm
              ">
                                <span>✅</span> {successMsg}
                            </div>
                        )}

                        <Input
                            label="New password"
                            name="newPassword"
                            type="password"
                            placeholder="Min. 8 characters"
                            value={form.newPassword}
                            onChange={handleChange}
                            error={errors.newPassword}
                            required
                        />
                        <Input
                            label="Confirm new password"
                            name="confirm"
                            type="password"
                            placeholder="Repeat new password"
                            value={form.confirm}
                            onChange={handleChange}
                            error={errors.confirm}
                            required
                        />

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                size="lg"
                                onClick={() => setStep(2)}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="gradient"
                                size="lg"
                                fullWidth
                                loading={loading}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};

export default ForgotPasswordForm;