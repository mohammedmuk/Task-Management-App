import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const AuthLayout = ({ children, title, subtitle, backTo, backLabel }) => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate background blobs
    tl.fromTo(
      bgRef.current?.children || [],
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
      }
    )
      // Animate card
      .fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.4)",
        },
        "-=0.8"
      );
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-dark-200 relative overflow-hidden px-4 py-12"
    >
      {/* ── Background Blobs ────────────────────── */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none">
        <div className="
          absolute top-[-20%] left-[-10%]
          w-[500px] h-[500px] rounded-full
          bg-primary-600/10 blur-[120px]
        " />
        <div className="
          absolute bottom-[-20%] right-[-10%]
          w-[600px] h-[600px] rounded-full
          bg-violet-600/10 blur-[120px]
        " />
        <div className="
          absolute top-[40%] left-[50%]
          w-[300px] h-[300px] rounded-full
          bg-primary-800/10 blur-[80px]
        " />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── Card ────────────────────────────────── */}
      <div
        ref={cardRef}
        className="relative w-full max-w-md card border border-white/10 overflow-hidden"
      >
        {/* Top Gradient Bar */}
        <div className="
          h-1 w-full
          bg-gradient-to-r from-primary-600 via-violet-500 to-primary-600
        " />

        <div className="px-8 py-8">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="
              w-10 h-10 rounded-xl
              bg-gradient-to-br from-primary-600 to-violet-600
              flex items-center justify-center
              shadow-glow-sm
            ">
              <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
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
            <span className="
              font-display font-bold text-xl
              text-gradient
            ">
              TaskFlow
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-8">
            <h1 className="
              text-2xl font-display font-bold
              text-white mb-1.5
            ">
              {title}
            </h1>
            <p className="text-sm text-white/40">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          {children}

          {/* Back Link */}
          {backTo && (
            <p className="text-center text-sm text-white/40 mt-6">
              <Link
                to={backTo}
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
              >
                ← {backLabel || "Go back"}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;