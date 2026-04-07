import api from "./api";
import { ENDPOINTS } from "@utils/constants";

const authService = {

    // ── POST /users/ ────────────────────────────────
    register: async ({ username, email, password }) => {
        const res = await api.post(ENDPOINTS.REGISTER, {
            username,
            email,
            password,
        });
        return res.data;
    },

    // ── POST /users/ (login via token endpoint) ─────
    // Adjust this endpoint if you have a dedicated /login/ or /token/ route
    login: async ({ identifier, password }) => {
        const res = await api.post("/token/", { identifier, password });
        return res.data;
        // Expected response: { token: "...", user: { id, username, email } }
    },

    // ── GET /users/:pk/ ─────────────────────────────
    getUser: async (pk) => {
        const res = await api.get(ENDPOINTS.USER(pk));
        return res.data;
    },

    // ── PUT /users/:pk/ ─────────────────────────────
    updateUser: async (pk, data) => {
        const res = await api.put(ENDPOINTS.USER(pk), data);
        return res.data;
    },

    // ── PATCH /users/:pk/ ───────────────────────────
    patchUser: async (pk, data) => {
        const res = await api.patch(ENDPOINTS.USER(pk), data);
        return res.data;
    },

    // ── DELETE /users/:pk/ ──────────────────────────
    deleteUser: async (pk) => {
        await api.delete(ENDPOINTS.USER(pk));
    },

    // ── POST /generate-code/ ────────────────────────
    // endpoint: "forgot-password" | "account-activation"
    generateCode: async ({ email, endpoint }) => {
        const res = await api.post(ENDPOINTS.GENERATE_CODE, {
            email,
            endpoint,
        });
        return res.data;
    },

    // ── POST /verify-email/ ─────────────────────────
    verifyEmail: async ({ email, code }) => {
        const res = await api.post(ENDPOINTS.VERIFY_EMAIL, { email, code });
        return res.data;
    },

    // ── POST /forgot-password/ ──────────────────────
    forgotPassword: async ({ email, code, password }) => {
        const res = await api.patch(ENDPOINTS.FORGOT_PASSWORD, {
            email,
            code,
            password,
        });
        return res.data;
    },
};

export default authService;