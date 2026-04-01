import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import gsap from "gsap";
import {
    HiDotsVertical,
    HiPencil,
    HiTrash,
    HiClock,
    HiArrowRight,
} from "react-icons/hi";
import { useState } from "react";
import {
    PRIORITY_COLORS,
    PRIORITY_LABELS,
    STATUS_LABELS,
} from "@utils/constants";
import { formatDate } from "@utils/helpers";
import { truncate } from "@utils/helpers";
import {
    setSelectedTask,
    deleteTask,
} from "@features/tasks/tasksSlice";
import {
    openModal,
    openDetailPanel,
    openConfirmDialog,
} from "@features/ui/uiSlice";
import useTasks from "@hooks/useTasks";

const TaskCard = ({ task, index }) => {
    const dispatch = useDispatch();
    const cardRef = useRef(null);
    const menuRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const { quickStatusChange } = useTasks();

    // ── Stagger entrance animation ────────────────────
    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 24, scale: 0.97 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.45,
                delay: index * 0.07,
                ease: "back.out(1.2)",
            }
        );
    }, []);

    // ── Close menu on outside click ───────────────────
    useEffect(() => {
        const handler = (e) => {
            if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Hover animation ───────────────────────────────
    const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
            y: -3,
            scale: 1.01,
            duration: 0.25,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            y: 0,
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
        });
    };

    // ── Delete with exit animation ────────────────────
    const handleDelete = () => {
        dispatch(
            openConfirmDialog({
                title: "Delete Task",
                message: `Are you sure you want to delete "${task.title}"?`,
                onConfirm: () => {
                    gsap.to(cardRef.current, {
                        opacity: 0,
                        x: -30,
                        scale: 0.9,
                        duration: 0.3,
                        ease: "power2.in",
                        onComplete: () => dispatch(deleteTask(task.id)),
                    });
                },
            })
        );
        setMenuOpen(false);
    };

    // ── Open for editing ──────────────────────────────
    const handleEdit = () => {
        dispatch(setSelectedTask(task));
        dispatch(openModal("edit"));
        setMenuOpen(false);
    };

    // ── Open detail panel ─────────────────────────────
    const handleCardClick = (e) => {
        if (menuRef.current?.contains(e.target)) return;
        dispatch(setSelectedTask(task));
        dispatch(openDetailPanel());
    };

    // ── Priority dot color ────────────────────────────
    const priorityDot = {
        high: "bg-danger",
        medium: "bg-warning",
        low: "bg-success",
    };

    // ── Next status (quick toggle) ────────────────────
    const nextStatus = {
        todo: "in_progress",
        in_progress: "done",
        done: "todo",
    };
    const nextStatusLabel = {
        todo: "Start",
        in_progress: "Complete",
        done: "Reopen",
    };

    return (
        <div
            ref={cardRef}
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="card border border-white/5 cursor-pointer group transition-shadow duration-300 hover:shadow-card-hover hover:border-primary-500/20 p-4 space-y-3 relative overflow-hidden"
        >
            {/* Priority Left Border Accent */}
            <div className={`
        absolute left-0 top-0 bottom-0 w-0.5
        ${task.priority === "high" ? "bg-danger" :
                    task.priority === "medium" ? "bg-warning" :
                        "bg-success"
                }
      `} />

            {/* ── Header Row ────────────────────────────── */}
            <div className="flex items-start justify-between gap-2">

                {/* Priority Badge */}
                <div className="flex items-center gap-2">
                    <span className={`
            w-2 h-2 rounded-full shrink-0
            ${priorityDot[task.priority] || "bg-white/20"}
          `} />
                    <span className={`
            text-xs font-medium
            ${PRIORITY_COLORS[task.priority] || "text-white/40"}
          `}>
                        {PRIORITY_LABELS[task.priority] || task.priority}
                    </span>
                </div>

                {/* Menu Button */}
                <div ref={menuRef} className="relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
                        className="p-1 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                        <HiDotsVertical size={14} />
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 top-6 z-30 w-36 card border border-white/10 overflow-hidden shadow-card animate-fade-in">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <HiPencil size={13} /> Edit Task
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-danger hover:bg-danger/10 transition-all"
                            >
                                <HiTrash size={13} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Title ─────────────────────────────────── */}
            <h3 className="
        text-sm font-semibold text-white
        leading-snug
        group-hover:text-primary-300
        transition-colors duration-200
      ">
                {truncate(task.title, 60)}
            </h3>

            {/* ── Description ───────────────────────────── */}
            {task.description && (
                <p className="text-xs text-white/40 leading-relaxed">
                    {truncate(task.description, 90)}
                </p>
            )}

            {/* ── Footer ────────────────────────────────── */}
            <div className="
        flex items-center justify-between
        pt-2 border-t border-white/5
        gap-2
      ">
                {/* Date */}
                <div className="flex items-center gap-1 text-white/25">
                    <HiClock size={11} />
                    <span className="text-[10px]">
                        {formatDate(task.created_at)}
                    </span>
                </div>

                {/* Quick Status Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        quickStatusChange(task.id, nextStatus[task.status]);
                    }}
                    className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg bg-white/5 hover:bg-primary-500/20 text-white/40 hover:text-primary-400 border border-transparent hover:border-primary-500/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                    {nextStatusLabel[task.status]}
                    <HiArrowRight size={10} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;