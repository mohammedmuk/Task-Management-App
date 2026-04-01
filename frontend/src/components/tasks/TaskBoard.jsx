import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import gsap from "gsap";
import TaskColumn from "./TaskColumn";
import {
    selectTasksByStatus,
    selectTasksLoading,
} from "@features/tasks/tasksSlice";

const TaskBoard = () => {
    const boardRef = useRef(null);
    const tasksByStatus = useSelector(selectTasksByStatus);
    const loading = useSelector(selectTasksLoading);

    useEffect(() => {
        gsap.fromTo(
            boardRef.current?.children || [],
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.12,
                ease: "power3.out",
            }
        );
    }, []);

    return (
        <div
            ref={boardRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start"
        >
            <TaskColumn
                status="todo"
                tasks={tasksByStatus.todo}
                loading={loading}
            />
            <TaskColumn
                status="in_progress"
                tasks={tasksByStatus.in_progress}
                loading={loading}
            />
            <TaskColumn
                status="done"
                tasks={tasksByStatus.done}
                loading={loading}
            />
        </div>
    );
};

export default TaskBoard;