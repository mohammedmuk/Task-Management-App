import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { HiMail, HiRefresh } from "react-icons/hi";
import AuthLayout from "./AuthLayout";
import Button from "@components/common/Button";
import useAuth from "@hooks/useAuth";
import { useNavigate } from "react-router-dom";

// ── OTP / 6-digit Code Input ──────────────────────────
const CodeInput = ({ value, onChange }) => {
  const inputs = useRef([]);
  const digits = value.split("");

  const handleKey = (e, idx) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = val;

    // Pad to 6 digits
    const padded = next.join("").padEnd(6, "").slice(0, 6);
    onChange(padded);

    if (val && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          className={`
            w-12 h-14 text-center text-xl font-bold
            rounded-xl border transition-all duration-200
            bg-dark-300 text-white
            focus:outline-none focus:ring-2
            focus:ring-primary-500/50
            focus:border-primary-500/50
            ${digits[i]
              ? "border-primary-500/50 bg-primary-500/10"
              : "border-white/10"
            }
          `}
        />
      ))}
    </div>
  );
};

const VerifyEmailForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const password = location.state?.password;

  const {
    verifyEmail,
    generateCode,
    loading,
    error,
    successMsg,
    clearMessages,
  } = useAuth();

  const formRef = useRef(null);
  const iconRef = useRef(null);

  const [code, setCode] = useState("");
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // ── Mount animations ──────────────────────────────
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
    const tl = gsap.timeline();
    tl.fromTo(
      iconRef.current,
      { scale: 0, rotate: -180 },
      { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)" }
    ).fromTo(
      formRef.current?.children || [],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
      "-=0.3"
    );

    // Pulse mail icon
    gsap.to(iconRef.current, {
      scale: 1.08,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => clearMessages();
  }, []);

  // ── Countdown for resend ───────────────────────────
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.replace(/\s/g, "").length < 6) return;
    await verifyEmail({ email, code, password });
  };

  const handleResend = async () => {
    setResending(true);
    await generateCode({ email, endpoint: "account-activation" });
    setResending(false);
    setCountdown(60);
    setCode("");
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We sent a 6-digit code to ${email || "your email"}`}
      backTo="/register"
      backLabel="Back to register"
    >
      {/* Mail Icon */}
      <div className="flex justify-center mb-8 -mt-2">
        <div
          ref={iconRef}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600/20 to-violet-600/20 border border-primary-500/20 flex items-center justify-center"
        >
          <HiMail size={40} className="text-primary-400" />
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        {/* Error */}
        {error && (
          <div className="
            flex items-center gap-2
            bg-danger/10 border border-danger/20
            rounded-xl px-4 py-3 text-danger text-sm
          ">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Success */}
        {successMsg && (
          <div className="
            flex items-center gap-2
            bg-success/10 border border-success/20
            rounded-xl px-4 py-3 text-success text-sm
          ">
            <span>✅</span> {successMsg}
          </div>
        )}

        {/* Code Input */}
        <CodeInput value={code} onChange={setCode} />

        {/* Submit */}
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          fullWidth
          loading={loading}
          disabled={code.replace(/\s/g, "").length < 6}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </Button>

        {/* Resend */}
        <div className="text-center space-y-1">
          <p className="text-sm text-white/40">Didn&apos;t receive the code?</p>
          {countdown > 0 ? (
            <p className="text-sm text-white/30">
              Resend in{" "}
              <span className="text-primary-400 font-medium">
                {countdown}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 disabled:opacity-50 transition-colors duration-200">
              <HiRefresh
                size={14}
                className={resending ? "animate-spin" : ""}
              />
              {resending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmailForm;