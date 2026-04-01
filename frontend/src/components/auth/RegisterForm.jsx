import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
    HiMail,
    HiLockClosed,
    HiUser,
} from "react-icons/hi";
import AuthLayout from "./AuthLayout";
import Button from "@components/common/Button";
import Input from "@components/common/Input";
import useAuth from "@hooks/useAuth";

// ── Password strength checker ─────────────────────────
const getStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length > 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const map = {
        0: { label: "", color: "" },
        1: { label: "Weak", color: "bg-danger" },
        2: { label: "Fair", color: "bg-warning" },
        3: { label: "Good", color: "bg-info" },
        4: { label: "Strong", color: "bg-success" },
    };
    return { score, ...map[score] };
};

const RegisterForm = () => {
    const { register, loading, error, clearMessages } = useAuth();
    const formRef = useRef(null);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [errors, setErrors] = useState({});
    const [strength, setStrength] = useState({ score: 0 });

    useEffect(() => {
        gsap.fromTo(
            formRef.current?.children || [],
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "power3.out" }
        );
        return () => clearMessages();
    }, []);

    useEffect(() => {
        if (error) {
            gsap.fromTo(
                formRef.current,
                { x: -8 },
                { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }
            );
        }
    }, [error]);

    const validate = () => {
        const e = {};
        if (!form.username.trim())
            e.username = "Username is required";
        else if (form.username.length < 3)
            e.username = "At least 3 characters";

        if (!form.email)
            e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email))
            e.email = "Enter a valid email";

        if (!form.password)
            e.password = "Password is required";
        else if (form.password.length < 10)
            e.password = "At least 10 characters";

        if (!form.confirm)
            e.confirm = "Please confirm your password";
        else if (form.confirm !== form.password)
            e.confirm = "Passwords do not match";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (name === "password") setStrength(getStrength(value));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        await register({
            username: form.username,
            email: form.email,
            password: form.password,
        });
    };

    return (
        <AuthLayout
            title="Create account"
            subtitle="Join TaskFlow and start managing your tasks"
            backTo="/login"
            backLabel="Already have an account? Sign in"
        >
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
            >
                {/* Global Error */}
                {error && (
                    <div className="
            flex items-center gap-2
            bg-danger/10 border border-danger/20
            rounded-xl px-4 py-3
            text-danger text-sm
          ">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Username */}
                <Input
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    value={form.username}
                    onChange={handleChange}
                    error={errors.username}
                    icon={<HiUser />}
                    required
                />

                {/* Email */}
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

                {/* Password */}
                <div className="space-y-2">
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Min. 8 characters"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
                        icon={<HiLockClosed />}
                        required
                    />

                    {/* Password Strength Bar */}
                    {form.password && (
                        <div className="space-y-1.5 px-1">
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`
                      flex-1 h-1 rounded-full transition-all duration-300
                      ${i <= strength.score
                                                ? strength.color
                                                : "bg-white/10"
                                            }
                    `}
                                    />
                                ))}
                            </div>
                            {strength.label && (
                                <p className="text-xs text-white/40">
                                    Strength:{" "}
                                    <span className={`font-medium ${strength.score <= 1 ? "text-danger" :
                                        strength.score === 2 ? "text-warning" :
                                            strength.score === 3 ? "text-info" :
                                                "text-success"
                                        }`}>
                                        {strength.label}
                                    </span>
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <Input
                    label="Confirm password"
                    name="confirm"
                    type="password"
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={handleChange}
                    error={errors.confirm}
                    icon={<HiLockClosed />}
                    required
                />

                {/* Terms */}
                <p className="text-xs text-white/30 text-center leading-relaxed">
                    By creating an account you agree to our{" "}
                    <span className="text-primary-400 cursor-pointer hover:underline">
                        Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-primary-400 cursor-pointer hover:underline">
                        Privacy Policy
                    </span>
                </p>

                {/* Submit */}
                <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    fullWidth
                    loading={loading}
                >
                    {loading ? "Creating account..." : "Create Account"}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default RegisterForm;