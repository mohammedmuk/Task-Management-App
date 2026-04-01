import { useDispatch, useSelector } from "react-redux";
import {
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    patchTask,
    deleteTask,
    setSelectedTask,
    clearSelectedTask,
    setFilter,
    resetFilters,
    clearTaskMessages,
    optimisticStatusUpdate,
    selectAllTasks,
    selectSelectedTask,
    selectTaskFilters,
    selectTasksLoading,
    selectTasksError,
    selectTasksSuccess,
    selectFilteredTasks,
    selectTaskStats,
    selectTasksByStatus,
} from "@features/tasks/tasksSlice";
import {
    openModal,
    closeModal,
    openDetailPanel,
    closeDetailPanel,
} from "@features/ui/uiSlice";

const useTasks = () => {
    const dispatch = useDispatch();

    const tasks = useSelector(selectAllTasks);
    const filteredTasks = useSelector(selectFilteredTasks);
    const tasksByStatus = useSelector(selectTasksByStatus);
    const selectedTask = useSelector(selectSelectedTask);
    const filters = useSelector(selectTaskFilters);
    const loading = useSelector(selectTasksLoading);
    const error = useSelector(selectTasksError);
    const successMsg = useSelector(selectTasksSuccess);
    const stats = useSelector(selectTaskStats);

    const loadTasks = () => dispatch(fetchTasks());
    const loadTask = (pk) => dispatch(fetchTaskById(pk));

    const addTask = (data) => dispatch(createTask(data));
    const editTask = (pk, data) => dispatch(updateTask({ pk, data }));
    const patchATask = (pk, data) => dispatch(patchTask({ pk, data }));
    const removeTask = (pk) => dispatch(deleteTask(pk));

    const selectTask = (task) => {
        dispatch(setSelectedTask(task));
        dispatch(openDetailPanel());
    };

    const deselectTask = () => {
        dispatch(clearSelectedTask());
        dispatch(closeDetailPanel());
    };

    const openCreateModal = () => dispatch(openModal("create"));
    const openEditModal = () => dispatch(openModal("edit"));
    const closeTaskModal = () => dispatch(closeModal());

    const updateFilter = (key, value) => dispatch(setFilter({ key, value }));
    const clearFilters = () => dispatch(resetFilters());
    const clearMessages = () => dispatch(clearTaskMessages());

    const quickStatusChange = (pk, status) => {
        dispatch(optimisticStatusUpdate({ pk, status }));
        dispatch(patchTask({ pk, data: { status } }));
    };

    return {
        // State
        tasks,
        filteredTasks,
        tasksByStatus,
        selectedTask,
        filters,
        loading,
        error,
        successMsg,
        stats,

        // Actions
        loadTasks,
        loadTask,
        addTask,
        editTask,
        patchATask,
        removeTask,
        selectTask,
        deselectTask,
        openCreateModal,
        openEditModal,
        closeTaskModal,
        updateFilter,
        clearFilters,
        clearMessages,
        quickStatusChange,
    };
};

export default useTasks;