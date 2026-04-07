import { useRef, useEffect } from "react";
import gsap from "gsap";
import { HiPlus } from "react-icons/hi";
import { useDispatch } from "react-redux";
import TaskCard from "./TaskCard";
import { TaskCardSkeleton } from "@components/common/Loader";
import { openModal } from "@features/ui/uiSlice";

const COLUMN_META = {
    todo: {
        label: "To Do",
        color: "text-info",
        border: "border-info/30",
        bg: "bg-info/10",
        dot: "bg-info",
        glow: "shadow-[0_0_20px_rgba(59,130,246,0.08)]",
    },
    in_progress: {
        label: "In Progress",
        color: "text-warning",
        border: "border-warning/30",
        bg: "bg-warning/10",
        dot: "bg-warning",
        glow: "shadow-[0_0_20px_rgba(245,158,11,0.08)]",
    },
    done: {
        label: "Done",
        color: "text-success",
        border: "border-success/30",
        bg: "bg-success/10",
        dot: "bg-success",
        glow: "shadow-[0_0_20px_rgba(34,197,94,0.08)]",
    },
};

const TaskColumn = ({ status, tasks = [], loading = false }) => {
    const dispatch = useDispatch();
    const headerRef = useRef(null);
    const meta = COLUMN_META[status] || COLUMN_META.todo;

    useEffect(() => {
        gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
        );
    }, []);

    return (
        <div className={`flex flex-col gap-3 min-h-[400px] bg-dark-100/50 rounded-2xl border ${meta.border} ${meta.glow} overflow-hidden`}>

            {/* ── Column Header ─────────────────────────── */}
            <div
                ref={headerRef}
                className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5 shrink-0"
            >
                <div className="flex items-center gap-2.5">
                    {/* Status Dot */}
                    <span className={`
            w-2.5 h-2.5 rounded-full
            ${meta.dot}
          `} />

                    {/* Label */}
                    <span className={`
            text-sm font-semibold ${meta.color}
          `}>
                        {meta.label}
                    </span>

                    {/* Count Badge */}
                    <span className={`
            text-xs font-bold px-2 py-0.5
            rounded-full ${meta.bg} ${meta.color}
          `}>
                        {tasks.length}
                    </span>
                </div>

                {/* Add Button (Todo & In Progress columns) */}
                {status !== "done" && (
                    <button
                        onClick={() => dispatch(openModal("create"))}
                        className={`
              p-1.5 rounded-lg text-xs
              ${meta.bg} ${meta.color}
              hover:opacity-80
              transition-opacity duration-200
              border border-white/5
            `}
                    >
                        <HiPlus size={14} />
                    </button>
                )}
            </div>

            {/* ── Task List ─────────────────────────────── */}
            <div className="
        flex-1 px-3 pb-4 space-y-3
        overflow-y-auto no-scrollbar
      ">

                {/* Loading Skeletons */}
                {loading && (
                    <>
                        <TaskCardSkeleton />
                        <TaskCardSkeleton />
                        <TaskCardSkeleton />
                    </>
                )}

                {/* Empty State */}
                {!loading && tasks.length === 0 && (
                    <div className="
            flex flex-col items-center justify-center
            h-48 gap-3 text-center
          ">
                        <div className={`
              w-14 h-14 rounded-2xl
              ${meta.bg} ${meta.border}
              border flex items-center justify-center
              text-2xl
            `}>
                            {status === "todo" ? "📋" :
                                status === "in_progress" ? "⚡" :
                                    "✅"
                            }
                        </div>
                        <div>
                            <p className="text-sm text-white/40 font-medium">
                                No tasks here
                            </p>
                            <p className="text-xs text-white/20 mt-0.5">
                                {status === "done"
                                    ? "Completed tasks will appear here"
                                    : "Add a task to get started"
                                }
                            </p>
                        </div>
                    </div>
                )}

                {/* Task Cards */}
                {!loading && tasks.map((task, i) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        index={i}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskColumn;