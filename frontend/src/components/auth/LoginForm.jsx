import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { HiMail, HiLockClosed } from "react-icons/hi";
import AuthLayout from "./AuthLayout";
import Button from "@components/common/Button";
import Input from "@components/common/Input";
import useAuth from "@hooks/useAuth";

const LoginForm = () => {
  const { login, loading, error, clearMessages } = useAuth();
  const formRef = useRef(null);

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});

  // ── Animate form fields on mount ─────────────────
  useEffect(() => {
    gsap.fromTo(
      formRef.current?.children || [],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" }
    );
    return () => clearMessages();
  }, []);

  // ── Shake animation on error ──────────────────────
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
    if (!form.identifier) e.identifier = "Email or username is required";
    else if (!/\S+@\S+\.\S+/.test(form.identifier))
      e.identifier = "Enter a valid email or username";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await login(form);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-5"
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
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Email */}
        <Input
          label="Email or username"
          name="identifier"
          type="text"
          placeholder="you@example.com or username"
          value={form.identifier}
          onChange={handleChange}
          error={errors.email}
          icon={<HiMail />}
          required
        />

        {/* Password */}
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          icon={<HiLockClosed />}
          required
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end -mt-2">
          <Link
            to="/forgot-password"
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors duration-200"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          fullWidth
          loading={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        {/* Divider */}
        <div className="relative flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/25">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-white/40">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;