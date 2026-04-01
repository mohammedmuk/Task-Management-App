import { useEffect, useRef } from "react";
import { Link }              from "react-router-dom";
import gsap                  from "gsap";
import { ScrollTrigger }     from "gsap/ScrollTrigger";
import Button                from "@components/common/Button";
gsap.registerPlugin(ScrollTrigger);

// ── Feature Card ──────────────────────────────────────
const FeatureCard = ({ icon, title, desc}) => {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      '.feature-card',
      { opacity: 0, y: 40 },
      {
        opacity:    1,
        y:          0,
        duration: .5,
        ease:       "bounce.out",
        stagger : 1,
        scrollTrigger: {
          trigger: ".feature-card",
          start:   "top 60%",
          end : "bottom 60%",
          scrub : .4
        },
      }
    );
  }, []);

  return (
    <div
      ref       = {ref}
      className = "
        card-hover p-6 flex flex-col gap-4
        group cursor-default feature-card
      "
    >
      <div className="
        w-12 h-12 rounded-xl
        bg-gradient-to-br from-primary-600/20 to-violet-600/20
        border border-primary-500/20
        flex items-center justify-center text-2xl
        group-hover:scale-110 duration-300
      ">
        {icon}
      </div>
      <div>
        <h3 className="font-display font-semibold text-white mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────
const StatCard = ({ value, label }) => (
  <div className="text-center">
    <p className="text-3xl font-display font-bold text-gradient mb-1">
      {value}
    </p>
    <p className="text-sm text-white/40">{label}</p>
  </div>
);

const LandingPage = () => {
  const heroRef    = useRef(null);
  const titleRef   = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef     = useRef(null);
  const mockupRef  = useRef(null);
  const navRef     = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Navbar
    tl.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    )
    // Title
    .fromTo(
      titleRef.current,
      { opacity: 0, y: 50, skewY: 3 },
      { opacity: 1, y: 0, skewY: 0, duration: 0.8, ease: "power3.out" },
      "-=0.2"
    )
    // Subtitle
    .fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    )
    // CTA Buttons
    .fromTo(
      ctaRef.current?.children || [],
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.5, stagger: 0.1,
        ease: "back.out(1.4)",
      },
      "-=0.3"
    )
    // Mockup
    .fromTo(
      mockupRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );

    // Floating animation for mockup
    gsap.to(mockupRef.current, {
      y:        -12,
      duration: 3,
      repeat:   -1,
      yoyo:     true,
      ease:     "sine.inOut",
      delay:    1,
    });
  }, []);

  const FEATURES = [
    {
      icon:  "🎯",
      title: "Smart Task Board",
      desc:  "Kanban-style board to organize your tasks by status with drag-and-drop support.",
    },
    {
      icon:  "⚡",
      title: "Priority Management",
      desc:  "Assign High, Medium, or Low priority to ensure you always focus on what matters.",
    },
    {
      icon:  "🔍",
      title: "Powerful Filters",
      desc:  "Filter and search tasks by priority, status, or keywords instantly.",
    },
    {
      icon:  "📊",
      title: "Progress Tracking",
      desc:  "Visual statistics and insights to track your productivity at a glance.",
    },
    {
      icon:  "🔐",
      title: "Secure Auth",
      desc:  "Email verification, JWT authentication, and password recovery built-in.",
    },
    {
      icon:  "🎨",
      title: "Beautiful UI",
      desc:  "Stunning dark-themed interface with smooth GSAP animations throughout.",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-200 overflow-x-hidden">

      {/* ── Navbar ────────────────────────────────── */}
      <nav
        ref       = {navRef}
        className = "
          sticky top-0 z-50
          flex items-center justify-between
          px-6 md:px-12 h-16
          glass-dark border-b border-white/5
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="
            w-8 h-8 rounded-lg
            bg-gradient-to-br from-primary-600 to-violet-600
            flex items-center justify-center
          ">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
              <path
                d="M8 11h10M8 16h14M8 21h8"
                stroke="white" strokeWidth="2.5" strokeLinecap="round"
              />
              <circle cx="24" cy="21" r="4" fill="#22c55e" />
              <path
                d="M22.5 21l1 1 2-2" stroke="white"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-display font-bold text-lg text-gradient">
            TaskFlow
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {["Features", "About"].map((link) => (
            <a
              key       = {link}
              href      = {`#${link.toLowerCase()}`}
              className = "
                text-sm text-white/50
                hover:text-white
                transition-colors duration-200
              "
            >
              {link}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button variant="gradient" size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section
        ref       = {heroRef}
        className = "
          relative min-h-[90vh]
          flex flex-col items-center justify-center
          px-6 md:px-12 py-20
          overflow-hidden
        "
      >
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="
            absolute top-[-15%] right-[-10%]
            w-[600px] h-[600px] rounded-full
            bg-primary-600/8 blur-[120px]
            animate-pulse-slow
          " />
          <div className="
            absolute bottom-[-15%] left-[-10%]
            w-[500px] h-[500px] rounded-full
            bg-violet-600/8 blur-[100px]
            animate-pulse-slow
          " />
          {/* Dot Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(rgba(99,102,241,0.8) 1px, transparent 1px)",
              backgroundSize:  "28px 28px",
            }}
          />
        </div>

        {/* Badge */}
        <div className="
          inline-flex items-center gap-2
          px-4 py-2 rounded-full mb-8
          bg-primary-500/10 border border-primary-500/20
          text-primary-400 text-sm font-medium
        ">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          Manage your tasks like a pro
        </div>

        {/* Title */}
        <h1
          ref       = {titleRef}
          className = "
            text-5xl md:text-7xl font-display font-bold
            text-center leading-tight mb-6
            max-w-4xl
          "
        >
          Your Tasks,{" "}
          <span className="text-primary-500">Organized</span>
          <br />& Under Control
        </h1>

        {/* Subtitle */}
        <p
          ref       = {subtitleRef}
          className = "
            text-lg md:text-xl text-white/50
            text-center max-w-2xl mb-10
            leading-relaxed
          "
        >
          TaskFlow is a powerful, beautiful task manager that helps
          you stay focused, track progress, and get more done — every day.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex items-center gap-4 flex-wrap justify-center">
          <Link to="/register">
            <Button variant="gradient" size="xl">
              🚀 Get Started Free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="xl">
              Sign In
            </Button>
          </Link>
        </div>

        {/* App Mockup */}
        <div
          ref       = {mockupRef}
          className = "
            mt-20 w-full max-w-4xl
            card border border-white/10
            overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]
          "
        >
          {/* Mockup Header */}
          <div className="
            flex items-center gap-2 px-4 py-3
            bg-dark-300 border-b border-white/5
          ">
            <div className="w-3 h-3 rounded-full bg-danger/70" />
            <div className="w-3 h-3 rounded-full bg-warning/70" />
            <div className="w-3 h-3 rounded-full bg-success/70" />
            <div className="
              flex-1 mx-4 h-5 rounded-full
              bg-white/5 border border-white/5
              flex items-center justify-center
            ">
              <span className="text-[10px] text-white/20">
                taskflow.app/dashboard
              </span>
            </div>
          </div>

          {/* Mockup Body */}
          <div className="
            p-6 bg-dark-200
            grid grid-cols-3 gap-4 min-h-[280px]
          ">
            {/* Column 1 */}
            {[
              { status: "To Do",       color: "text-info",    count: 3 },
              { status: "In Progress", color: "text-warning", count: 2 },
              { status: "Done",        color: "text-success", count: 4 },
            ].map(({ status, color, count }) => (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${color}`}>
                    {status}
                  </span>
                  <span className="
                    text-xs bg-white/10
                    px-2 py-0.5 rounded-full text-white/40
                  ">
                    {count}
                  </span>
                </div>
                {Array.from({ length: count > 3 ? 3 : count }).map((_, i) => (
                  <div
                    key       = {i}
                    className = "card p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-2 bg-white/10 rounded w-12" />
                      <div className="h-2 bg-white/5  rounded w-8"  />
                    </div>
                    <div className="h-2 bg-white/10 rounded w-full" />
                    <div className="h-2 bg-white/10 rounded w-2/3"  />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────── */}
      <section className="px-6 md:px-12 py-16 border-y border-white/5">
        <div className="
          max-w-4xl mx-auto
          grid grid-cols-2 md:grid-cols-4 gap-8
        ">
          <StatCard value="10K+"  label="Active Users"    />
          <StatCard value="500K+" label="Tasks Completed" />
          <StatCard value="99.9%" label="Uptime"          />
          <StatCard value="4.9★"  label="User Rating"     />
        </div>
      </section>

      {/* ── Features ──────────────────────────────── */}
      <section
        id        = "features"
        className = "px-6 md:px-12 py-24"
      >
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="
              text-3xl md:text-4xl font-display font-bold
              text-white mb-4
            ">
              Everything you need to{" "}
              <span className="text-gradient">stay productive</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Powerful features designed to help you manage tasks
              efficiently and never miss a deadline.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <FeatureCard
                key   = {i}
                {...f}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────── */}
      <section className="px-6 md:px-12 py-24">
        <div className="
          max-w-4xl mx-auto
          relative card border border-primary-500/20
          bg-gradient-to-br from-primary-900/30 to-violet-900/30
          p-12 text-center overflow-hidden
        ">
          <div className="
            absolute top-[-50%] left-[50%] -translate-x-1/2
            w-[400px] h-[400px] rounded-full
            bg-primary-600/10 blur-[80px]
            pointer-events-none
          " />

          <h2 className="
            text-3xl md:text-4xl font-display font-bold
            text-white mb-4 relative
          ">
            Ready to get{" "}
            <span className="text-gradient">organized?</span>
          </h2>
          <p className="text-white/50 mb-8 relative max-w-lg mx-auto">
            Join thousands of productive people who use TaskFlow
            to manage their work and personal goals.
          </p>

          <Link to="/register" className="relative">
            <Button variant="gradient" size="xl">
              🚀 Start for Free — No Credit Card
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="
        px-6 md:px-12 py-8
        border-t border-white/5
        flex items-center justify-between
        flex-wrap gap-4
      ">
        <div className="flex items-center gap-2">
          <div className="
            w-6 h-6 rounded-md
            bg-gradient-to-br from-primary-600 to-violet-600
            flex items-center justify-center
          ">
            <svg viewBox="0 0 32 32" fill="none" className="w-4 h-4">
              <path
                d="M8 11h10M8 16h14M8 21h8"
                stroke="white" strokeWidth="2.5" strokeLinecap="round"
              />
              <circle cx="24" cy="21" r="4" fill="#22c55e" />
            </svg>
          </div>
          <span className="text-sm font-display font-bold text-white/70">
            TaskFlow
          </span>
        </div>
        <p className="text-xs text-white/25">
          © 2025 TaskFlow. Built with React, Redux & GSAP.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;