import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import gsap from "gsap";
import Navbar from "@components/layout/Navbar";
import Sidebar from "@components/layout/Sidebar";
import PageWrapper from "@components/layout/PageWrapper";
import TaskStats from "@components/tasks/TaskStats";
import TaskFilters from "@components/tasks/TaskFilters";
import TaskBoard from "@components/tasks/TaskBoard";
import TaskDetailPanel from "@components/tasks/TaskDetailPanel";
import TaskForm from "@components/tasks/TaskForm";
import Modal from "@components/common/Modal";
import ConfirmDialog from "@components/common/ConfirmDialog";
import Toast from "@components/common/Toast";
import { Spinner } from "@components/common/Loader";
import {
    selectModalOpen,
    selectModalType,
    closeModal,
} from "@features/ui/uiSlice";
import {
    fetchTasks,
    selectTasksLoading,
    selectTasksError,
    selectAllTasks,
} from "@features/tasks/tasksSlice";
import { selectUser } from "@features/auth/authSlice";

// ══════════════════════════════════════════════════════
//  Greeting helper
// ══════════════════════════════════════════════════════
const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
};

// ══════════════════════════════════════════════════════
//  Live Clock
// ══════════════════════════════════════════════════════
const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    const clockRef = useRef(null);
    const dotRef = useRef(null);

    useEffect(() => {
        // Tick every second
        const interval = setInterval(() => setTime(new Date()), 1000);

        // Entrance animation
        gsap.fromTo(
            clockRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }
        );

        // Pulsing dot
        gsap.to(dotRef.current, {
            opacity: 0.2,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        return () => clearInterval(interval);
    }, []);

    const day = time.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

    const clock = time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <div
            ref={clockRef}
            className="card px-4 py-3 flex items-center gap-3 border border-white/5 shrink-0">
            {/* Live dot */}
            <span
                ref={dotRef}
                className="w-2 h-2 rounded-full bg-success shrink-0"
            />

            <div className="text-right">
                <p className="text-xs text-white/30 font-medium">{day}</p>
                <p className="text-sm font-display font-bold text-white/90 tabular-nums">
                    {clock}
                </p>
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════
//  Progress Bar (overall completion)
// ══════════════════════════════════════════════════════
const ProgressBar = ({ done, total }) => {
    const barRef = useRef(null);
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    useEffect(() => {
        gsap.fromTo(
            barRef.current,
            { scaleX: 0 },
            {
                scaleX: pct / 100,
                duration: 1,
                ease: "power3.out",
                transformOrigin: "left center",
                delay: 0.4,
            }
        );
    }, [pct]);

    if (total === 0) return null;

    return (
        <div className="card px-5 py-4 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/70">
                        Overall Progress
                    </span>
                    {pct === 100 && (
                        <span className="
              badge bg-success/15 text-success
              border border-success/25 text-xs
            ">
                            🎉 All done!
                        </span>
                    )}
                </div>
                <span className="text-sm font-display font-bold text-gradient">
                    {pct}%
                </span>
            </div>

            {/* Track */}
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    ref={barRef}
                    className={`
            h-full rounded-full
            bg-gradient-to-r from-primary-600 to-violet-500
            origin-left
          `}
                    style={{ transform: "scaleX(0)" }}
                />
            </div>

            <p className="text-xs text-white/30">
                {done} of {total} task{total !== 1 ? "s" : ""} completed
            </p>
        </div>
    );
};

// ══════════════════════════════════════════════════════
//  Quick Actions Strip
// ══════════════════════════════════════════════════════
const QuickActions = ({ onNewTask }) => {
    const ref = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            ref.current?.children || [],
            { opacity: 0, y: 12 },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.06,
                ease: "power3.out",
                delay: 0.3,
            }
        );
    }, []);

    const actions = [
        {
            icon: "➕",
            label: "New Task",
            color: "from-primary-600 to-violet-600",
            onClick: onNewTask,
        },
        {
            icon: "🔴",
            label: "High Priority",
            color: "from-red-700/50 to-red-600/50",
            onClick: () => { },
        },
        {
            icon: "🔄",
            label: "In Progress",
            color: "from-amber-700/50 to-amber-600/50",
            onClick: () => { },
        },
        {
            icon: "✅",
            label: "Completed",
            color: "from-green-700/50 to-green-600/50",
            onClick: () => { },
        },
    ];

    return (
        <div ref={ref} className="flex flex-wrap gap-3">
            {actions.map((a, i) => (
                <button
                    key={i}
                    onClick={a.onClick}
                    className={`
            flex items-center gap-2
            px-4 py-2.5 rounded-xl
            bg-gradient-to-r ${a.color}
            text-white text-sm font-medium
            border border-white/10
            hover:opacity-90 hover:scale-[1.02]
            active:scale-[0.98]
            transition-all duration-200
            shadow-card
          `}
                >
                    <span>{a.icon}</span>
                    <span>{a.label}</span>
                </button>
            ))}
        </div>
    );
};

// ══════════════════════════════════════════════════════
//  Empty State
// ══════════════════════════════════════════════════════
const EmptyDashboard = ({ onNewTask }) => {
    const ref = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(
            ref.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );

        gsap.to(ref.current?.querySelector(".float-icon"), {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    }, []);

    return (
        <div
            ref={ref}
            className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center card border border-white/5 px-8 py-16"
        >
            {/* Floating Illustration */}
            <div className="relative">
                <div className="
          absolute inset-0 rounded-full
          bg-primary-500/10 blur-2xl scale-150
          animate-pulse-slow
        " />
                <div className="
          float-icon relative
          w-24 h-24 rounded-3xl
          bg-gradient-to-br from-primary-600/20 to-violet-600/20
          border border-primary-500/20
          flex items-center justify-center text-5xl
        ">
                    📋
                </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-white">
                    No tasks yet
                </h2>
                <p className="text-white/40 max-w-sm leading-relaxed">
                    Create your first task and start organizing your work.
                    You&apos;re just one click away from being productive!
                </p>
            </div>

            {/* CTA */}
            <button
                onClick={onNewTask}
                className="btn-primary text-base px-8 py-3 shadow-glow"
            >
                ✨ Create First Task
            </button>
        </div>
    );
};

// ══════════════════════════════════════════════════════
//  DASHBOARD PAGE
// ══════════════════════════════════════════════════════
const DashboardPage = () => {
    const dispatch = useDispatch();
    const headerRef = useRef(null);

    const user = useSelector(selectUser);
    const loading = useSelector(selectTasksLoading);
    const error = useSelector(selectTasksError);
    const tasks = useSelector(selectAllTasks);
    const modalOpen = useSelector(selectModalOpen);
    const modalType = useSelector(selectModalType);

    const doneTasks = tasks.filter((t) => t.status === "done").length;

    // ── Fetch tasks on mount ────────────────────────────
    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    // ── Page header entrance animation ─────────────────
    useEffect(() => {
        if (!headerRef.current) return;
        gsap.fromTo(
            headerRef.current.children,
            { opacity: 0, y: -16 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power3.out",
            }
        );
    }, []);

    const handleOpenCreate = () => dispatch({ type: "ui/openModal", payload: "create" });

    return (
        <div className="flex h-screen overflow-hidden bg-dark-200">

            {/* ── Sidebar ─────────────────────────────────── */}
            <Sidebar />

            {/* ── Main ────────────────────────────────────── */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

                {/* Top Nav */}
                <Navbar />

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto no-scrollbar">
                    <PageWrapper className="px-5 md:px-7 py-6 space-y-6">

                        {/* ── Page Header ───────────────────────── */}
                        <div
                            ref={headerRef}
                            className="flex items-start justify-between flex-wrap gap-4"
                        >
                            {/* Greeting */}
                            <div>
                                <h1 className="
                  text-2xl md:text-3xl
                  font-display font-bold text-white
                  leading-tight
                ">
                                    {getGreeting()},{" "}
                                    <span className="text-gradient">
                                        {user?.username || "there"} 👋
                                    </span>
                                </h1>
                                <p className="text-sm text-white/40 mt-1">
                                    {tasks.length === 0
                                        ? "No tasks yet — let's get started!"
                                        : `You have ${tasks.length} task${tasks.length !== 1 ? "s" : ""} · ${doneTasks} completed`
                                    }
                                </p>
                            </div>

                            {/* Live Clock */}
                            <LiveClock />
                        </div>

                        {/* ── Error Banner ──────────────────────── */}
                        {error && (
                            <div className="
                flex items-center gap-3
                bg-danger/10 border border-danger/20
                rounded-2xl px-5 py-4
                text-danger text-sm
              ">
                                <span className="text-xl shrink-0">⚠️</span>
                                <div className="flex-1">
                                    <p className="font-semibold">Failed to load tasks</p>
                                    <p className="text-xs text-danger/70 mt-0.5">{error}</p>
                                </div>
                                <button
                                    onClick={() => dispatch(fetchTasks())}
                                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-danger/30 hover:bg-danger/10 transition-colors duration-200"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* ── Quick Actions ─────────────────────── */}
                        <QuickActions onNewTask={handleOpenCreate} />

                        {/* ── Stats Cards ───────────────────────── */}
                        <TaskStats />

                        {/* ── Progress Bar ──────────────────────── */}
                        <ProgressBar done={doneTasks} total={tasks.length} />

                        {/* ── Filters Bar ───────────────────────── */}
                        <TaskFilters />

                        {/* ── Board / Loading / Empty ───────────── */}
                        {loading && tasks.length === 0 ? (
                            /* Full-page loader while initial fetch */
                            <div className="
                flex flex-col items-center
                justify-center gap-4
                min-h-[360px]
                card border border-white/5
              ">
                                <div className="relative">
                                    <div className="
                    absolute inset-0
                    bg-primary-500/10 blur-2xl
                    rounded-full scale-150
                  " />
                                    <Spinner size={40} className="relative" />
                                </div>
                                <p className="text-sm text-white/40">
                                    Loading your tasks...
                                </p>
                            </div>
                        ) : tasks.length === 0 && !error ? (
                            /* Empty state */
                            <EmptyDashboard onNewTask={handleOpenCreate} />
                        ) : (
                            /* Kanban Board */
                            <TaskBoard />
                        )}

                        {/* Bottom spacer */}
                        <div className="h-8" />

                    </PageWrapper>
                </main>
            </div>

            {/* ── Task Detail Side Panel ─────────────────── */}
            <TaskDetailPanel />

            {/* ── Create / Edit Task Modal ───────────────── */}
            <Modal
                isOpen={modalOpen}
                onClose={() => dispatch(closeModal())}
                title={modalType === "edit" ? "✏️ Edit Task" : "✨ New Task"}
                size="md"
            >
                <TaskForm mode={modalType || "create"} />
            </Modal>

            {/* ── Confirm Delete Dialog ──────────────────── */}
            <ConfirmDialog />

            {/* ── Toast Notifications ────────────────────── */}
            <Toast />
        </div>
    );
};

export default DashboardPage;