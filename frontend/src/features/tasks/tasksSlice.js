import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "@services/taskService";

// ── Initial State ────────────────────────────────────
const initialState = {
    items: [],
    selectedTask: null,
    filters: {
        priority: "all",
        status: "all",
        search: "",
        sortBy: "created_at",
        order: "desc",
    },
    loading: false,
    error: null,
    successMsg: null,
};

// ═══════════════════════════════════════════════════
//                   ASYNC THUNKS
// ═══════════════════════════════════════════════════

// ── Fetch All Tasks ───────────────────────────────────
export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (_, thunkAPI) => {
        try {
            return await taskService.getAllTasks();
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Failed to fetch tasks" }
            );
        }
    }
);

// ── Fetch Single Task ─────────────────────────────────
export const fetchTaskById = createAsyncThunk(
    "tasks/fetchTaskById",
    async (pk, thunkAPI) => {
        try {
            return await taskService.getTask(pk);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Task not found" }
            );
        }
    }
);

// ── Create Task ───────────────────────────────────────
export const createTask = createAsyncThunk(
    "tasks/createTask",
    async (payload, thunkAPI) => {
        try {
            return await taskService.createTask(payload);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Failed to create task" }
            );
        }
    }
);

// ── Update Task (PUT) ─────────────────────────────────
export const updateTask = createAsyncThunk(
    "tasks/updateTask",
    async ({ pk, data }, thunkAPI) => {
        try {
            return await taskService.updateTask(pk, data);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Failed to update task" }
            );
        }
    }
);

// ── Patch Task (PATCH) ────────────────────────────────
export const patchTask = createAsyncThunk(
    "tasks/patchTask",
    async ({ pk, data }, thunkAPI) => {
        try {
            return await taskService.patchTask(pk, data);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Failed to patch task" }
            );
        }
    }
);

// ── Delete Task ───────────────────────────────────────
export const deleteTask = createAsyncThunk(
    "tasks/deleteTask",
    async (pk, thunkAPI) => {
        try {
            await taskService.deleteTask(pk);
            return pk;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Failed to delete task" }
            );
        }
    }
);

// ═══════════════════════════════════════════════════
//                     SLICE
// ═══════════════════════════════════════════════════
const tasksSlice = createSlice({
    name: "tasks",
    initialState,

    reducers: {
        // Set selected task (for detail panel / edit modal)
        setSelectedTask(state, action) {
            state.selectedTask = action.payload;
        },

        // Clear selected task
        clearSelectedTask(state) {
            state.selectedTask = null;
        },

        // Update filters
        setFilter(state, action) {
            const { key, value } = action.payload;
            state.filters[key] = value;
        },

        // Reset all filters
        resetFilters(state) {
            state.filters = {
                priority: "all",
                status: "all",
                search: "",
                sortBy: "created_at",
                order: "desc",
            };
        },

        // Clear messages
        clearTaskMessages(state) {
            state.error = null;
            state.successMsg = null;
        },

        // Optimistic status update (instant UI feedback)
        optimisticStatusUpdate(state, action) {
            const { pk, status } = action.payload;
            const task = state.items.find((t) => t.id === pk);
            if (task) task.status = status;
        },
    },

    extraReducers: (builder) => {

        // ── Helpers ────────────────────────────────────
        const setLoading = (state) => {
            state.loading = true;
            state.error = null;
            state.successMsg = null;
        };
        const setError = (state, action) => {
            state.loading = false;
            state.error =
                action.payload?.message ||
                action.payload?.detail ||
                Object.values(action.payload || {})[0] ||
                "Something went wrong";
        };

        builder

            // ── Fetch All ──────────────────────────────────
            .addCase(fetchTasks.pending, setLoading)
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.results;
            })
            .addCase(fetchTasks.rejected, setError)

            // ── Fetch One ──────────────────────────────────
            .addCase(fetchTaskById.pending, setLoading)
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTask = action.payload;
            })
            .addCase(fetchTaskById.rejected, setError)

            // ── Create ─────────────────────────────────────
            .addCase(createTask.pending, setLoading)
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
                state.successMsg = "Task created successfully!";
            })
            .addCase(createTask.rejected, setError)

            // ── Update ─────────────────────────────────────
            .addCase(updateTask.pending, setLoading)
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(
                    (t) => t.id === action.payload.id
                );
                if (index !== -1) state.items[index] = action.payload;
                if (state.selectedTask?.id === action.payload.id) {
                    state.selectedTask = action.payload;
                }
                state.successMsg = "Task updated successfully!";
            })
            .addCase(updateTask.rejected, setError)

            // ── Patch ──────────────────────────────────────
            .addCase(patchTask.pending, setLoading)
            .addCase(patchTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(
                    (t) => t.id === action.payload.id
                );
                if (index !== -1) state.items[index] = action.payload;
                if (state.selectedTask?.id === action.payload.id) {
                    state.selectedTask = action.payload;
                }
                state.successMsg = "Task updated!";
            })
            .addCase(patchTask.rejected, setError)

            // ── Delete ─────────────────────────────────────
            .addCase(deleteTask.pending, setLoading)
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((t) => t.id !== action.payload);
                if (state.selectedTask?.id === action.payload) {
                    state.selectedTask = null;
                }
                state.successMsg = "Task deleted!";
            })
            .addCase(deleteTask.rejected, setError);
    },
});

export const {
    setSelectedTask,
    clearSelectedTask,
    setFilter,
    resetFilters,
    clearTaskMessages,
    optimisticStatusUpdate,
} = tasksSlice.actions;

export default tasksSlice.reducer;

// ── Selectors ─────────────────────────────────────────
export const selectAllTasks = (state) => state.tasks.items;
export const selectSelectedTask = (state) => state.tasks.selectedTask;
export const selectTaskFilters = (state) => state.tasks.filters;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;
export const selectTasksSuccess = (state) => state.tasks.successMsg;

// ── Derived / Computed Selector (filtered + sorted) ──
export const selectFilteredTasks = (state) => {
    const { items, filters } = state.tasks;
    let result = [...items];

    // Filter by priority
    if (filters.priority !== "all") {
        result = result.filter((t) => t.priority === filters.priority);
    }

    // Filter by status
    if (filters.status !== "all") {
        result = result.filter((t) => t.status === filters.status);
    }

    // Filter by search
    if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        result = result.filter(
            (t) =>
                t.title?.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q)
        );
    }

    // Sort
    result.sort((a, b) => {
        const aVal = a[filters.sortBy] ?? "";
        const bVal = b[filters.sortBy] ?? "";
        if (filters.order === "asc") return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
    });

    return result;
};

// ── Stats Selector ─────────────────────────────────────
export const selectTaskStats = (state) => {
    const items = state.tasks.items;
    return {
        total: items.length,
        todo: items.filter((t) => t.status === "todo").length,
        inProgress: items.filter((t) => t.status === "in_progress").length,
        done: items.filter((t) => t.status === "done").length,
        high: items.filter((t) => t.priority === "high").length,
        medium: items.filter((t) => t.priority === "medium").length,
        low: items.filter((t) => t.priority === "low").length,
    };
};

// ── Tasks grouped by status (for Kanban board) ─────────
export const selectTasksByStatus = (state) => {
    const filtered = selectFilteredTasks(state);
    return {
        todo: filtered.filter((t) => t.status === "todo"),
        in_progress: filtered.filter((t) => t.status === "in_progress"),
        done: filtered.filter((t) => t.status === "done"),
    };
};