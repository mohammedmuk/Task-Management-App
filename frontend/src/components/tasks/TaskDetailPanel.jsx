import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import {
    HiX,
    HiPencil,
    HiTrash,
    HiClock,
    HiFlag,
    HiClipboardCheck,
    HiDotsHorizontal,
} from "react-icons/hi";
import {
    selectSelectedTask,
    deleteTask,
    patchTask,
} from "@features/tasks/tasksSlice";
import {
    selectDetailPanel,
    closeDetailPanel,
    openModal,
    showToast,
    openConfirmDialog,
} from "@features/ui/uiSlice";
import {
    PRIORITY_LABELS,
    STATUS_LABELS,
} from "@utils/constants";
import { setConfirmCallback } from "@utils/confirmCallback";
import { formatDate, timeAgo } from "@utils/helpers";
import Button from "@components/common/Button";

// ── Info Row ──────────────────────────────────────────
const InfoRow = ({ icon, label, children }) => (
    <div className="flex items-start gap-3 py-3 border-b border-white/5">
        <div className="text-white/30 mt-0.5 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-xs text-white/30 mb-1">{label}</p>
            <div className="text-sm text-white/80">{children}</div>
        </div>
    </div>
);

const TaskDetailPanel = () => {
    const dispatch = useDispatch();
    const panelRef = useRef(null);
    const overlayRef = useRef(null);

    const isOpen = useSelector(selectDetailPanel);
    const task = useSelector(selectSelectedTask);

    // ── Slide in ──────────────────────────────────────
    useEffect(() => {
        if (!panelRef.current) return;

        if (isOpen) {
            gsap.fromTo(
                panelRef.current,
                { x: "100%", opacity: 0 },
                { x: "0%", opacity: 1, duration: 0.4, ease: "power3.out" }
            );
            gsap.fromTo(
                overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
        }
    }, [isOpen]);

    // ── Slide out ─────────────────────────────────────
    const handleClose = () => {
        gsap.to(panelRef.current, {
            x: "100%",
            opacity: 0,
            duration: 0.35,
            ease: "power3.in",
        });
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => dispatch(closeDetailPanel()),
        });
    };

    // ── ESC key ───────────────────────────────────────
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape" && isOpen) handleClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen]);

    const handleDelete = () => {
        setConfirmCallback(() => {
            dispatch(deleteTask(task.id));
            handleClose();
            dispatch(showToast({ message: "Task deleted!", type: "success" }));
        });
        dispatch(
            openConfirmDialog({
                title: "Delete Task",
                message: `Are you sure you want to delete "${task?.title}"?`,
            })
        );
    };

    const handleStatusChange = (status) => {
        dispatch(patchTask({ pk: task.id, data: { status } }));
        dispatch(showToast({ message: "Status updated!", type: "success" }));
    };

    if (!isOpen && !task) return null;

    const priorityColor = {
        high: "text-danger  bg-danger/15  border-danger/25",
        medium: "text-warning bg-warning/15 border-warning/25",
        low: "text-success bg-success/15 border-success/25",
    };

    const statusColor = {
        todo: "text-info    bg-info/15    border-info/25",
        in_progress: "text-warning bg-warning/15 border-warning/25",
        done: "text-success bg-success/15 border-success/25",
    };

    return (
        <>
            {/* ── Overlay ───────────────────────────────── */}
            <div
                ref={overlayRef}
                onClick={handleClose}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
                style={{ display: isOpen ? "block" : "none" }}
            />

            {/* ── Panel ─────────────────────────────────── */}
            <aside
                ref={panelRef}
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-dark-100 border-l border-white/5 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.4)]"
                style={{ transform: "translateX(100%)" }}
            >
                {task && (
                    <>
                        {/* ── Panel Header ──────────────────── */}
                        <div className="
              flex items-center justify-between
              px-5 py-4 border-b border-white/5
              shrink-0
            ">
                            <div className="flex items-center gap-2">
                                <HiClipboardCheck
                                    size={18}
                                    className="text-primary-400"
                                />
                                <h2 className="text-sm font-semibold text-white/80">
                                    Task Details
                                </h2>
                            </div>

                            <div className="flex items-center gap-1.5">
                                {/* Edit Button */}
                                <button
                                    onClick={() => {
                                        dispatch(openModal("edit"));
                                        handleClose();
                                    }}
                                    className="p-2 rounded-lg text-white/40 hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-200"
                                >
                                    <HiPencil size={15} />
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={handleDelete}
                                    className="p-2 rounded-lg text-white/40 hover:text-danger hover:bg-danger/10 transition-all duration-200"
                                >
                                    <HiTrash size={15} />
                                </button>

                                {/* Close Button */}
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
                                >
                                    <HiX size={15} />
                                </button>
                            </div>
                        </div>

                        {/* ── Panel Body ────────────────────── */}
                        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4">

                            {/* Title */}
                            <h1 className="
                text-xl font-display font-bold
                text-white leading-snug mb-2
              ">
                                {task.title}
                            </h1>

                            {/* Badges Row */}
                            <div className="flex items-center gap-2 flex-wrap mb-6">
                                <span className={`
                  badge border
                  ${priorityColor[task.priority] || "text-white/50"}
                `}>
                                    <HiFlag size={10} />
                                    {PRIORITY_LABELS[task.priority] || task.priority}
                                </span>
                                <span className={`
                  badge border
                  ${statusColor[task.status] || "text-white/50"}
                `}>
                                    {STATUS_LABELS[task.status] || task.status}
                                </span>
                            </div>

                            {/* Description */}
                            {task.description && (
                                <div className="
                  bg-dark-300/60 border border-white/5
                  rounded-xl p-4 mb-6
                ">
                                    <p className="text-xs font-semibold text-white/30 mb-2 uppercase tracking-wider">
                                        Description
                                    </p>
                                    <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                                        {task.description}
                                    </p>
                                </div>
                            )}

                            {/* Info Rows */}
                            <div className="space-y-0">
                                <InfoRow
                                    icon={<HiClock size={14} />}
                                    label="Created at"
                                >
                                    <span>
                                        {formatDate(task.created_at)}{" "}
                                        <span className="text-white/30 text-xs">
                                            ({timeAgo(task.created_at)})
                                        </span>
                                    </span>
                                </InfoRow>

                                <InfoRow
                                    icon={<HiFlag size={14} />}
                                    label="Priority"
                                >
                                    <span className={`
                    font-medium
                    ${task.priority === "high" ? "text-danger" :
                                            task.priority === "medium" ? "text-warning" :
                                                "text-success"
                                        }
                  `}>
                                        {PRIORITY_LABELS[task.priority]}
                                    </span>
                                </InfoRow>

                                <InfoRow
                                    icon={<HiDotsHorizontal size={14} />}
                                    label="Status"
                                >
                                    {STATUS_LABELS[task.status]}
                                </InfoRow>
                            </div>

                            {/* ── Quick Status Change ─────────── */}
                            <div className="mt-6">
                                <p className="
                  text-xs font-semibold text-white/30
                  uppercase tracking-wider mb-3
                ">
                                    Change Status
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: "todo", label: "To Do", color: "text-info    border-info/30    bg-info/10" },
                                        { value: "in_progress", label: "In Progress", color: "text-warning border-warning/30 bg-warning/10" },
                                        { value: "done", label: "Done", color: "text-success border-success/30 bg-success/10" },
                                    ].map((s) => (
                                        <button
                                            key={s.value}
                                            onClick={() => handleStatusChange(s.value)}
                                            className={`
                        px-2 py-2.5 rounded-xl text-xs font-medium
                        border transition-all duration-200
                        ${task.status === s.value
                                                    ? s.color
                                                    : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                                                }
                      `}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Panel Footer ──────────────────── */}
                        <div className="
              px-5 py-4
              border-t border-white/5
              flex gap-3 shrink-0
            ">
                            <Button
                                variant="secondary"
                                size="md"
                                fullWidth
                                onClick={handleClose}
                            >
                                Close
                            </Button>
                            <Button
                                variant="gradient"
                                size="md"
                                fullWidth
                                onClick={() => {
                                    dispatch(openModal("edit"));
                                    handleClose();
                                }}
                            >
                                Edit Task
                            </Button>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
};

export default TaskDetailPanel;