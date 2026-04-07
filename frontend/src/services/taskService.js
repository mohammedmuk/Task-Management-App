import api from "./api";
import { ENDPOINTS } from "@utils/constants";

// ── Status Mapping (Frontend → API) ─────────────────
const FRONTEND_TO_API_STATUS = {
    todo: "pending",
    in_progress: "in_progress",
    done: "completed",
};

const toApiStatus = (status) => FRONTEND_TO_API_STATUS[status] || status;

const toApiPayload = (data) => {
    if (!data || !data.status) return data;
    return { ...data, status: toApiStatus(data.status) };
};

const taskService = {

    // ── GET /tasks/ ─────────────────────────────────
    getAllTasks: async () => {
        const res = await api.get(ENDPOINTS.TASKS);
        return res.data;
    },

    // ── GET tasks by full URL (pagination) ──────────
    getTasksByUrl: async (url) => {
        const res = await api.get(url);
        return res.data;
    },

    // ── GET /tasks/:pk/ ─────────────────────────────
    getTask: async (pk) => {
        const res = await api.get(ENDPOINTS.TASK(pk));
        return res.data;
    },

    // ── POST /tasks/ ────────────────────────────────
    createTask: async ({ title, description, priority, status, created_at }) => {
        const res = await api.post(ENDPOINTS.TASKS, {
            title,
            description,
            priority,
            status: toApiStatus(status),
            created_at,
        });
        return res.data;
    },

    // ── PUT /tasks/:pk/ ─────────────────────────────
    updateTask: async (pk, data) => {
        const res = await api.put(ENDPOINTS.TASK(pk), toApiPayload(data));
        return res.data;
    },

    // ── PATCH /tasks/:pk/ ───────────────────────────
    patchTask: async (pk, data) => {
        const res = await api.patch(ENDPOINTS.TASK(pk), toApiPayload(data));
        return res.data;
    },

    // ── DELETE /tasks/:pk/ ──────────────────────────
    deleteTask: async (pk) => {
        await api.delete(ENDPOINTS.TASK(pk));
    },
};

export default taskService;