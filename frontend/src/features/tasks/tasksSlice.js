import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "@services/taskService";

// ── Status Normalization (API → Frontend) ────────────
const API_TO_FRONTEND_STATUS = {
    pending: "todo",
    in_progress: "in_progress",
    completed: "done",
};

const normalizeTask = (task) => ({
    ...task,
    status: API_TO_FRONTEND_STATUS[task.status] || task.status,
});

// ── Initial State ────────────────────────────────────
const initialState = {
    items: [],
    allItems: [],   // all tasks across all pages (for stats)
    selectedTask: null,
    pagination: {
        count: 0,
        next: null,
        previous: null,
        currentPage: 1,
    },
    filters: {
        priority: "all",
        status: "all",
        search: "",
        sortBy: "created_at",
        order: "desc",
    },
    loading: false,
    statsLoading: false,
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

// ── Fetch Tasks by Page URL (pagination) ──────────────
export const fetchTasksPage = createAsyncThunk(
    "tasks/fetchTasksPage",
    async (url, thunkAPI) => {
        try {
            return await taskService.getTasksByUrl(url);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Failed to fetch tasks" }
            );
        }
    }
);

// ── Fetch ALL Tasks (all pages, for stats) ────────────
export const fetchAllTasksForStats = createAsyncThunk(
    "tasks/fetchAllTasksForStats",
    async (_, thunkAPI) => {
        try {
            let allResults = [];
            let data = await taskService.getAllTasks();
            const results = Array.isArray(data) ? data : data.results ?? [];
            allResults = [...results];

            while (data.next) {
                data = await taskService.getTasksByUrl(data.next);
                const pageResults = Array.isArray(data) ? data : data.results ?? [];
                allResults = [...allResults, ...pageResults];
            }

            return allResults;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Failed to fetch all tasks" }
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
                const raw = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.results ?? [];
                state.items = raw.map(normalizeTask);
                // Store pagination metadata
                if (!Array.isArray(action.payload)) {
                    state.pagination.count = action.payload.count ?? 0;
                    state.pagination.next = action.payload.next ?? null;
                    state.pagination.previous = action.payload.previous ?? null;
                    state.pagination.currentPage = 1;
                }
            })
            .addCase(fetchTasks.rejected, setError)

            // ── Fetch Page (pagination) ─────────────────────
            .addCase(fetchTasksPage.pending, setLoading)
            .addCase(fetchTasksPage.fulfilled, (state, action) => {
                state.loading = false;
                const raw = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.results ?? [];
                state.items = raw.map(normalizeTask);
                if (!Array.isArray(action.payload)) {
                    const prevPage = state.pagination.currentPage;
                    state.pagination.count = action.payload.count ?? 0;
                    state.pagination.next = action.payload.next ?? null;
                    state.pagination.previous = action.payload.previous ?? null;
                    // Determine direction from the URL to compute page number
                    const url = action.meta.arg;
                    const match = url?.match?.(/[?&]page=(\d+)/);
                    state.pagination.currentPage = match ? parseInt(match[1], 10) : prevPage;
                }
            })
            .addCase(fetchTasksPage.rejected, setError)

            // ── Fetch All for Stats ────────────────────────
            .addCase(fetchAllTasksForStats.pending, (state) => {
                state.statsLoading = true;
            })
            .addCase(fetchAllTasksForStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.allItems = action.payload.map(normalizeTask);
            })
            .addCase(fetchAllTasksForStats.rejected, (state) => {
                state.statsLoading = false;
            })

            // ── Fetch One ──────────────────────────────────
            .addCase(fetchTaskById.pending, setLoading)
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTask = normalizeTask(action.payload);
            })
            .addCase(fetchTaskById.rejected, setError)

            // ── Create ─────────────────────────────────────
            .addCase(createTask.pending, setLoading)
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                const normalized = normalizeTask(action.payload);
                state.items.unshift(normalized);
                state.allItems.unshift(normalized);
                state.successMsg = "Task created successfully!";
            })
            .addCase(createTask.rejected, setError)

            // ── Update ─────────────────────────────────────
            .addCase(updateTask.pending, setLoading)
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const task = normalizeTask(action.payload);
                const index = state.items.findIndex(
                    (t) => t.id === task.id
                );
                if (index !== -1) state.items[index] = task;
                const allIdx = state.allItems.findIndex((t) => t.id === task.id);
                if (allIdx !== -1) state.allItems[allIdx] = task;
                if (state.selectedTask?.id === task.id) {
                    state.selectedTask = task;
                }
                state.successMsg = "Task updated successfully!";
            })
            .addCase(updateTask.rejected, setError)

            // ── Patch ──────────────────────────────────────
            .addCase(patchTask.pending, setLoading)
            .addCase(patchTask.fulfilled, (state, action) => {
                state.loading = false;
                const task = normalizeTask(action.payload);
                const index = state.items.findIndex(
                    (t) => t.id === task.id
                );
                if (index !== -1) state.items[index] = task;
                const allIdx = state.allItems.findIndex((t) => t.id === task.id);
                if (allIdx !== -1) state.allItems[allIdx] = task;
                if (state.selectedTask?.id === task.id) {
                    state.selectedTask = task;
                }
                state.successMsg = "Task updated!";
            })
            .addCase(patchTask.rejected, setError)

            // ── Delete ─────────────────────────────────────
            .addCase(deleteTask.pending, setLoading)
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((t) => t.id !== action.payload);
                state.allItems = state.allItems.filter((t) => t.id !== action.payload);
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
export const selectTasksPagination = (state) => state.tasks.pagination;

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

// ── Stats Selector (uses allItems for global counts) ───
export const selectTaskStats = (state) => {
    const items = state.tasks.allItems;
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