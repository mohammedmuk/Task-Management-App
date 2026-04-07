import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import {
    HiDocumentText,
    HiFlag,
    HiClipboard,
    HiCalendar,
} from "react-icons/hi";
import Input from "@components/common/Input";
import Button from "@components/common/Button";
import {
    createTask,
    updateTask,
    selectTasksLoading,
    selectSelectedTask,
} from "@features/tasks/tasksSlice";
import { closeModal } from "@features/ui/uiSlice";
import { showToast } from "@features/ui/uiSlice";

const PRIORITIES = [
    { value: "high", label: "🔴 High", desc: "Urgent & important" },
    { value: "medium", label: "🟡 Medium", desc: "Important, not urgent" },
    { value: "low", label: "🟢 Low", desc: "Nice to have" },
];

const STATUSES = [
    { value: "todo", label: "⏳ To Do" },
    { value: "in_progress", label: "🔄 In Progress" },
    { value: "done", label: "✅ Done" },
];

const TaskForm = ({ mode = "create" }) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectTasksLoading);
    const selectedTask = useSelector(selectSelectedTask);
    const formRef = useRef(null);

    const isEdit = mode === "edit" && selectedTask;

    const [form, setForm] = useState({
        title: isEdit ? selectedTask.title || "" : "",
        description: isEdit ? selectedTask.description || "" : "",
        priority: isEdit ? selectedTask.priority || "medium" : "medium",
        status: isEdit ? selectedTask.status || "todo" : "todo",
        created_at: isEdit ? selectedTask.created_at ||
            new Date().toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
    });

    const [errors, setErrors] = useState({});

    // ── Stagger field animation ───────────────────────
    useEffect(() => {
        gsap.fromTo(
            formRef.current?.children || [],
            { opacity: 0, x: -16 },
            {
                opacity: 1,
                x: 0,
                duration: 0.35,
                stagger: 0.07,
                ease: "power3.out",
            }
        );
    }, []);

    const validate = () => {
        const e = {};
        if (!form.title.trim())
            e.title = "Title is required";
        else if (form.title.length > 120)
            e.title = "Max 120 characters";
        if (form.description.length > 500)
            e.description = "Max 500 characters";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        let result;
        if (isEdit) {
            result = await dispatch(
                updateTask({ pk: selectedTask.id, data: form })
            );
        } else {
            result = await dispatch(createTask(form));
        }

        if (
            (isEdit && updateTask.fulfilled.match(result)) ||
            (!isEdit && createTask.fulfilled.match(result))
        ) {
            dispatch(closeModal());
            dispatch(
                showToast({
                    message: isEdit ? "Task updated!" : "Task created!",
                    type: "success",
                })
            );

            // Success flash animation
            gsap.to(formRef.current, {
                borderColor: "#22c55e",
                duration: 0.3,
                yoyo: true,
                repeat: 1,
            });
        } else {
            // Error shake
            gsap.fromTo(
                formRef.current,
                { x: -8 },
                { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)" }
            );
            dispatch(
                showToast({
                    message: result.payload?.message || "Something went wrong",
                    type: "error",
                })
            );
        }
    };

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
        >
            {/* ── Title ─────────────────────────────────── */}
            <Input
                label="Task title"
                name="title"
                type="text"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={handleChange}
                error={errors.title}
                icon={<HiDocumentText />}
                required
            />

            {/* ── Description ───────────────────────────── */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/70 flex items-center gap-1.5">
                    <HiClipboard className="text-white/30" />
                    Description
                </label>
                <textarea
                    name="description"
                    rows={3}
                    placeholder="Add more details about this task..."
                    value={form.description}
                    onChange={handleChange}
                    className={`
            input resize-none
            ${errors.description ? "border-danger/50" : ""}
          `}
                />
                {/* Character Count */}
                <div className="flex justify-between">
                    {errors.description
                        ? <p className="text-xs text-danger">⚠ {errors.description}</p>
                        : <span />
                    }
                    <p className={`text-xs ml-auto
            ${form.description.length > 450 ? "text-warning" : "text-white/25"}
          `}>
                        {form.description.length}/500
                    </p>
                </div>
            </div>

            {/* ── Priority Selector ─────────────────────── */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/70 flex items-center gap-1.5">
                    <HiFlag className="text-white/30" />
                    Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {PRIORITIES.map((p) => (
                        <button
                            key={p.value}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, priority: p.value }))}
                            className={`
                flex flex-col items-center gap-1
                px-3 py-3 rounded-xl text-center
                border transition-all duration-200
                cursor-pointer
                ${form.priority === p.value
                                    ? p.value === "high" ? "bg-danger/15  border-danger/40  text-danger" :
                                        p.value === "medium" ? "bg-warning/15 border-warning/40 text-warning" :
                                            "bg-success/15 border-success/40 text-success"
                                    : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                                }
              `}
                        >
                            <span className="text-base">{p.label.split(" ")[0]}</span>
                            <span className="text-xs font-medium">
                                {p.label.split(" ")[1]}
                            </span>
                            <span className="text-[10px] text-current/60 opacity-60">
                                {p.desc}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Status ────────────────────────────────── */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white/70">
                    Status
                </label>
                <div className="flex gap-2 flex-wrap">
                    {STATUSES.map((s) => (
                        <button
                            key={s.value}
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, status: s.value }))}
                            className={`
                flex items-center gap-1.5
                px-4 py-2 rounded-xl text-sm
                border transition-all duration-200
                cursor-pointer
                ${form.status === s.value
                                    ? "bg-primary-600/20 border-primary-500/40 text-primary-400"
                                    : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                                }
              `}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Date ──────────────────────────────────── */}
            <Input
                label="Created at"
                name="created_at"
                type="date"
                value={form.created_at}
                onChange={handleChange}
                icon={<HiCalendar />}
            />

            {/* ── Actions ───────────────────────────────── */}
            <div className="flex gap-3 pt-2">
                <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    fullWidth
                    onClick={() => dispatch(closeModal())}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    fullWidth
                    loading={loading}
                >
                    {loading
                        ? isEdit ? "Saving..." : "Creating..."
                        : isEdit ? "Save Changes" : "Create Task"
                    }
                </Button>
            </div>
        </form>
    );
};

export default TaskForm;