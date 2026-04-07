import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  HiViewGrid,
  HiClipboardList,
  HiCheckCircle,
  HiClock,
  HiExclamation,
  HiLogout,
  HiChevronLeft,
} from "react-icons/hi";
import {
  selectSidebarOpen,
  selectActiveNav,
  setActiveNav,
  setSidebarOpen,
} from "@features/ui/uiSlice";
import { selectTaskStats } from "@features/tasks/tasksSlice";
import { getInitials } from "@utils/helpers";
import { selectUser } from "@features/auth/authSlice";
import useAuth from "@hooks/useAuth";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <HiViewGrid size={20} />,
    path: "/dashboard",
  },
  {
    id: "all",
    label: "All Tasks",
    icon: <HiClipboardList size={20} />,
    path: "/dashboard",
    statKey: "total",
  },
  {
    id: "todo",
    label: "To Do",
    icon: <HiClock size={20} />,
    path: "/dashboard",
    statKey: "todo",
    color: "text-info",
  },
  {
    id: "inprogress",
    label: "In Progress",
    icon: <HiExclamation size={20} />,
    path: "/dashboard",
    statKey: "inProgress",
    color: "text-warning",
  },
  {
    id: "done",
    label: "Completed",
    icon: <HiCheckCircle size={20} />,
    path: "/dashboard",
    statKey: "done",
    color: "text-success",
  },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);

  const isOpen = useSelector(selectSidebarOpen);
  const activeNav = useSelector(selectActiveNav);
  const stats = useSelector(selectTaskStats);
  const user = useSelector(selectUser);
  const { logout } = useAuth();

  // ── Mount animation ───────────────────────────────
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      sidebarRef.current,
      { x: -280, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    )
      .fromTo(
        logoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4 },
        "-=0.2"
      )
      .fromTo(
        navRef.current?.children || [],
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.07 },
        "-=0.2"
      );
  }, []);

  // ── Open / Close animation ────────────────────────
  useEffect(() => {
    if (!sidebarRef.current) return;

    if (isOpen) {
      gsap.to(sidebarRef.current, {
        width: 260,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      });
    } else {
      gsap.to(sidebarRef.current, {
        width: 72,
        duration: 0.35,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  const handleNav = (item) => {
    dispatch(setActiveNav(item.id));
    navigate(item.path);
  };

  return (
    <aside
      ref={sidebarRef}
      className="relative flex flex-col h-screen shrink-0 bg-dark-100 border-r border-white/5 overflow-hidden transition-all duration-300 z-30"
      style={{ width: isOpen ? 260 : 72 }}
    >

      {/* ── Logo ──────────────────────────────────── */}
      <div
        ref={logoRef}
        className="flex items-center gap-3 px-4 h-16 border-b border-white/5 shrink-0"
      >
        {/* Icon */}
        <div className="
          w-9 h-9 rounded-xl shrink-0
          bg-gradient-to-br from-primary-600 to-violet-600
          flex items-center justify-center
          shadow-glow-sm
        ">
          <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
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

        {/* Name */}
        {isOpen && (
          <span className="
            font-display font-bold text-lg
            text-gradient whitespace-nowrap
          ">
            TaskFlow
          </span>
        )}

        {/* Collapse Button */}
        {isOpen && (
          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="ml-auto p-1 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/10 transition-all duration-200"
          >
            <HiChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* ── Navigation ────────────────────────────── */}
      <nav
        ref={navRef}
        className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar"
      >
        {/* Section Label */}
        {isOpen && (
          <p className="
            text-xs font-semibold text-white/25
            uppercase tracking-widest
            px-3 pb-2
          ">
            Menu
          </p>
        )}

        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item)}
              title={!isOpen ? item.label : ""}
              className={`
                w-full flex items-center gap-3
                px-3 py-2.5 rounded-xl
                text-sm font-medium
                transition-all duration-200
                group relative
                ${isActive
                  ? "bg-primary-600/20 text-primary-400 shadow-glow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {/* Active Indicator */}
              {isActive && (
                <span className="
                  absolute left-0 top-1/2 -translate-y-1/2
                  w-0.5 h-6 rounded-r-full
                  bg-primary-500
                " />
              )}

              {/* Icon */}
              <span className={`
                shrink-0
                ${item.color || ""}
                ${isActive ? "text-primary-400" : ""}
              `}>
                {item.icon}
              </span>

              {/* Label + Badge */}
              {isOpen && (
                <>
                  <span className="flex-1 text-left whitespace-nowrap">
                    {item.label}
                  </span>

                  {/* Stat Badge */}
                  {item.statKey && stats[item.statKey] > 0 && (
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full font-semibold
                      ${isActive
                        ? "bg-primary-500/20 text-primary-400"
                        : "bg-white/10 text-white/50"
                      }
                    `}>
                      {stats[item.statKey]}
                    </span>
                  )}
                </>
              )}

              {/* Tooltip (collapsed) */}
              {!isOpen && (
                <span className="
                  absolute left-14 z-50
                  bg-dark-100 border border-white/10
                  text-white text-xs
                  px-2 py-1 rounded-lg
                  whitespace-nowrap
                  opacity-0 group-hover:opacity-100
                  pointer-events-none
                  transition-opacity duration-200
                  shadow-card
                ">
                  {item.label}
                  {item.statKey && stats[item.statKey] > 0 &&
                    ` (${stats[item.statKey]})`
                  }
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── User Profile Footer ───────────────────── */}
      <div className="
        px-3 py-4 border-t border-white/5
        space-y-2 shrink-0
      ">
        {/* User Card */}
        <div className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl
          bg-white/5
          ${isOpen ? "" : "justify-center"}
        `}>
          {/* Avatar */}
          <div className="
            w-8 h-8 rounded-xl shrink-0
            bg-gradient-to-br from-primary-500 to-violet-500
            flex items-center justify-center
            text-xs font-bold text-white
          ">
            {getInitials(user || "U")}
          </div>

          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user || "User"}
              </p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title={!isOpen ? "Sign out" : ""}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-danger hover:bg-danger/10 transition-all duration-200 group"
        >
          <HiLogout size={18} className="shrink-0" />
          {isOpen && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;