import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import gsap from "gsap";
import {
    HiClipboardList,
    HiClock,
    HiRefresh,
    HiCheckCircle,
    HiExclamation,
} from "react-icons/hi";
import { selectTaskStats } from "@features/tasks/tasksSlice";

// ── Single Stat Card ──────────────────────────────────
const StatCard = ({ icon, label, value, color, bg, delay }) => {
    const cardRef = useRef(null);
    const numberRef = useRef(null);

    useEffect(() => {
        // Card entrance
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                delay,
                ease: "back.out(1.4)",
            }
        );

        // Counter animation
        const obj = { val: 0 };
        gsap.to(obj, {
            val: value,
            duration: 1.2,
            delay: delay + 0.2,
            ease: "power2.out",
            onUpdate: () => {
                if (numberRef.current)
                    numberRef.current.textContent = Math.round(obj.val);
            },
        });
    }, [value]);

    return (
        <div
            ref={cardRef}
            className="card-hover p-5 flex items-center gap-4 group"
        >
            {/* Icon */}
            <div className={`
        w-12 h-12 rounded-xl shrink-0
        flex items-center justify-center
        ${bg}
        group-hover:scale-110
        transition-transform duration-300
      `}>
                <span className={`text-xl ${color}`}>{icon}</span>
            </div>

            {/* Content */}
            <div className="min-w-0">
                <p className="text-xs text-white/40 font-medium mb-0.5 truncate">
                    {label}
                </p>
                <p
                    ref={numberRef}
                    className="text-2xl font-display font-bold text-white"
                >
                    0
                </p>
            </div>

            {/* Decorative Glow */}
            <div className={`
        absolute inset-0 rounded-2xl opacity-0
        group-hover:opacity-100
        transition-opacity duration-300
        ${bg} blur-xl -z-10 scale-110
      `} />
        </div>
    );
};

const TaskStats = () => {
    const stats = useSelector(selectTaskStats);

    const CARDS = [
        {
            icon: <HiClipboardList size={22} />,
            label: "Total Tasks",
            value: stats.total,
            color: "text-primary-400",
            bg: "bg-primary-500/15",
        },
        {
            icon: <HiClock size={22} />,
            label: "To Do",
            value: stats.todo,
            color: "text-info",
            bg: "bg-info/15",
        },
        {
            icon: <HiRefresh size={22} />,
            label: "In Progress",
            value: stats.inProgress,
            color: "text-warning",
            bg: "bg-warning/15",
        },
        {
            icon: <HiCheckCircle size={22} />,
            label: "Completed",
            value: stats.done,
            color: "text-success",
            bg: "bg-success/15",
        },
        {
            icon: <HiExclamation size={22} />,
            label: "High Priority",
            value: stats.high,
            color: "text-danger",
            bg: "bg-danger/15",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CARDS.map((card, i) => (
                <StatCard
                    key={i}
                    delay={i * 0.08}
                    {...card}
                />
            ))}
        </div>
    );
};

export default TaskStats;