import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import {
    HiMenuAlt2,
    HiBell,
    HiSearch,
    HiX,
} from "react-icons/hi";
import { getInitials } from "@utils/helpers";
import {
    toggleSidebar,
    selectSidebarOpen,
} from "@features/ui/uiSlice";
import { selectUser } from "@features/auth/authSlice";
import useAuth from "@hooks/useAuth";

const Navbar = () => {
    const dispatch = useDispatch();
    const navRef = useRef(null);
    const user = useSelector(selectUser);
    const sidebarOpen = useSelector(selectSidebarOpen);
    const { logout } = useAuth();

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifications] = useState([
        { id: 1, text: "New task assigned to you", time: "2m ago", unread: true },
        { id: 2, text: "Task 'Design UI' completed", time: "1h ago", unread: true },
        { id: 3, text: "Team meeting at 3:00 PM", time: "3h ago", unread: false },
    ]);
    const [notifOpen, setNotifOpen] = useState(false);
    const unreadCount = notifications.filter((n) => n.unread).length;

    // ── Mount animation ───────────────────────────────
    useEffect(() => {
        gsap.fromTo(
            navRef.current,
            { y: -60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
        );
    }, []);

    // ── Close dropdowns on outside click ─────────────
    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest("#profile-menu")) setProfileOpen(false);
            if (!e.target.closest("#notif-menu")) setNotifOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <header
            ref={navRef}
            className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 h-16 glass-dark border-b border-white/5"
        >

            {/* ── Left ──────────────────────────────────── */}
            <div className="flex items-center gap-4">

                {/* Sidebar Toggle */}
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                    {sidebarOpen
                        ? <HiX size={20} />
                        : <HiMenuAlt2 size={20} />
                    }
                </button>

                {/* Logo (mobile only) */}
                <span className="
          md:hidden font-display font-bold
          text-gradient text-lg
        ">
                    TaskFlow
                </span>

                {/* Search Bar (desktop) */}
                <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-64 focus-within:border-primary-500/50 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all duration-200">
                    <HiSearch className="text-white/30 shrink-0" size={16} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none w-full"
                    />
                </div>
            </div>

            {/* ── Right ─────────────────────────────────── */}
            <div className="flex items-center gap-2">

                {/* Mobile Search Toggle */}
                <button
                    onClick={() => setSearchOpen((p) => !p)}
                    className="md:hidden p-2 rounded-xl text-white/60 hover:text-whitehover:bg-white/10 transition-all"
                >
                    <HiSearch size={20} />
                </button>

                {/* Notifications */}
                <div id="notif-menu" className="relative">
                    <button
                        onClick={() => setNotifOpen((p) => !p)}
                        className="relative p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <HiBell size={20} />
                        {unreadCount > 0 && (
                            <span className="
                absolute top-1.5 right-1.5
                w-2 h-2 rounded-full
                bg-primary-500
                ring-2 ring-dark-200
              " />
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {notifOpen && (
                        <div className="
              absolute right-0 top-12 w-80
              card border border-white/10
              overflow-hidden z-50
              animate-fade-in
            ">
                            <div className="
                flex items-center justify-between
                px-4 py-3 border-b border-white/5
              ">
                                <span className="text-sm font-semibold">Notifications</span>
                                <span className="
                  badge bg-primary-500/20
                  text-primary-400 text-xs
                ">
                                    {unreadCount} new
                                </span>
                            </div>

                            <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`
                      px-4 py-3 flex items-start gap-3
                      hover:bg-white/5 transition-colors cursor-pointer
                      ${n.unread ? "bg-primary-500/5" : ""}
                    `}
                                    >
                                        {n.unread && (
                                            <span className="
                        w-2 h-2 rounded-full bg-primary-500
                        shrink-0 mt-1.5
                      " />
                                        )}
                                        <div className={n.unread ? "" : "pl-5"}>
                                            <p className="text-xs text-white/80">{n.text}</p>
                                            <p className="text-xs text-white/30 mt-0.5">{n.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="px-4 py-2 border-t border-white/5">
                                <button className="
                  text-xs text-primary-400
                  hover:text-primary-300 w-full text-center
                ">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div id="profile-menu" className="relative">
                    <button
                        onClick={() => setProfileOpen((p) => !p)}
                        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                        {/* Avatar */}
                        <div className="
              w-8 h-8 rounded-xl
              bg-gradient-to-br from-primary-500 to-violet-500
              flex items-center justify-center
              text-xs font-bold text-white
              shrink-0
            ">
                            {getInitials(user?.username || "User")}
                        </div>

                        {/* Name */}
                        <span className="
              hidden md:block text-sm
              font-medium text-white/80
              max-w-[100px] truncate
            ">
                            {user?.username || "User"}
                        </span>
                    </button>

                    {/* Profile Dropdown */}
                    {profileOpen && (
                        <div className="
              absolute right-0 top-12 w-52
              card border border-white/10
              overflow-hidden z-50
              animate-fade-in
            ">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-white/5">
                                <p className="text-sm font-semibold truncate">
                                    {user?.username}
                                </p>
                                <p className="text-xs text-white/40 truncate">
                                    {user?.email}
                                </p>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                {[
                                    { label: "Profile Settings", icon: "👤" },
                                    { label: "Preferences", icon: "⚙️" },
                                ].map((item) => (
                                    <button
                                        key={item.label}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
                                    >
                                        <span>{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            {/* Logout */}
                            <div className="border-t border-white/5 py-1">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-all duration-200"
                                >
                                    <span>🚪</span> Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Search Bar */}
            {searchOpen && (
                <div className="
          absolute top-16 left-0 right-0
          px-4 py-3
          glass-dark border-b border-white/5
          animate-slide-up md:hidden
        ">
                    <div className="flex items-center gap-2
            bg-white/5 border border-white/10
            rounded-xl px-3 py-2
            focus-within:border-primary-500/50
          ">
                        <HiSearch className="text-white/30" size={16} />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search tasks..."
                            className="bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none flex-1"
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;