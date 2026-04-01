import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import {
    HiSearch,
    HiFilter,
    HiSortAscending,
    HiX,
    HiPlus,
} from "react-icons/hi";
import {
    selectTaskFilters,
    setFilter,
    resetFilters,
} from "@features/tasks/tasksSlice";
import {
    openModal,
    selectModalOpen,
} from "@features/ui/uiSlice";

const PRIORITIES = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "🔴 High" },
    { value: "medium", label: "🟡 Medium" },
    { value: "low", label: "🟢 Low" },
];

const STATUSES = [
    { value: "all", label: "All Status" },
    { value: "todo", label: "⏳ To Do" },
    { value: "in_progress", label: "🔄 In Progress" },
    { value: "done", label: "✅ Done" },
];

const SORT_OPTIONS = [
    { value: "created_at", label: "Date Created" },
    { value: "title", label: "Title" },
    { value: "priority", label: "Priority" },
    { value: "status", label: "Status" },
];

const TaskFilters = () => {
    const dispatch = useDispatch();
    const filters = useSelector(selectTaskFilters);
    const barRef = useRef(null);

    const isFiltered =
        filters.priority !== "all" ||
        filters.status !== "all" ||
        filters.search !== "";

    useEffect(() => {
        gsap.fromTo(
            barRef.current,
            { opacity: 0, y: -16 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
    }, []);

    const handleFilter = (key, value) =>
        dispatch(setFilter({ key, value }));

    // ── Select base style ─────────────────────────────
    const selectCls = `
    bg-dark-300 border border-white/10
    text-white/80 text-sm
    rounded-xl px-3 py-2
    focus:outline-none focus:border-primary-500/50
    focus:ring-1 focus:ring-primary-500/30
    cursor-pointer transition-all duration-200
    hover:border-white/20
  `;

    return (
        <div
            ref={barRef}
            className="flex flex-wrap items-center gap-3 p-4 card border border-white/5"
        >
            {/* ── Search ────────────────────────────────── */}
            <div className="flex items-center gap-2 bg-dark-300 border border-white/10 rounded-xl px-3 py-2 focus-within:border-primary-500/50 focus-within:ring-1 focus-within:ring-primary-500/30 transition-all duration-200 flex-1 min-w-[180px]">
                <HiSearch className="text-white/30 shrink-0" size={16} />
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => handleFilter("search", e.target.value)}
                    className="bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none w-full"
                />
                {filters.search && (
                    <button
                        onClick={() => handleFilter("search", "")}
                        className="text-white/30 hover:text-white/70"
                    >
                        <HiX size={14} />
                    </button>
                )}
            </div>

            {/* ── Priority Filter ───────────────────────── */}
            <div className="flex items-center gap-2">
                <HiFilter size={14} className="text-white/30 shrink-0" />
                <select
                    value={filters.priority}
                    onChange={(e) => handleFilter("priority", e.target.value)}
                    className={selectCls}
                >
                    {PRIORITIES.map((p) => (
                        <option key={p.value} value={p.value}
                            className="bg-dark-300">
                            {p.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* ── Status Filter ─────────────────────────── */}
            <select
                value={filters.status}
                onChange={(e) => handleFilter("status", e.target.value)}
                className={selectCls}
            >
                {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}
                        className="bg-dark-300">
                        {s.label}
                    </option>
                ))}
            </select>

            {/* ── Sort ─────────────────────────────────── */}
            <div className="flex items-center gap-2">
                <HiSortAscending size={14} className="text-white/30 shrink-0" />
                <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilter("sortBy", e.target.value)}
                    className={selectCls}
                >
                    {SORT_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}
                            className="bg-dark-300">
                            {s.label}
                        </option>
                    ))}
                </select>

                {/* Order Toggle */}
                <button
                    onClick={() =>
                        handleFilter("order", filters.order === "asc" ? "desc" : "asc")
                    }
                    title={filters.order === "asc" ? "Ascending" : "Descending"}
                    className="p-2 rounded-xl bg-dark-300 border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all duration-200"
                >
                    {filters.order === "asc" ? "↑" : "↓"}
                </button>
            </div>

            {/* ── Spacer ───────────────────────────────── */}
            <div className="flex-1" />

            {/* ── Clear Filters ────────────────────────── */}
            {isFiltered && (
                <button
                    onClick={() => dispatch(resetFilters())}
                    className="flex items-center gap-1.5 text-xs text-white/40 hover:text-danger transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-danger/10 border border-transparent hover:border-danger/20"
                >
                    <HiX size={12} />
                    Clear filters
                </button>
            )}

            {/* ── Add Task Button ───────────────────────── */}
            <button
                onClick={() => dispatch(openModal("create"))}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
                <HiPlus size={16} />
                <span>New Task</span>
            </button>
        </div>
    );
};

export default TaskFilters;