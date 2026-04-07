import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "@services/authService";
import api from "@services/api";
import { ENDPOINTS } from "@utils/constants";

// ── Initial State ────────────────────────────────────
const initialState = {
    user: localStorage.getItem("username") || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    successMsg: null,
    codeRequested: false,
    emailVerified: false,
};

// ═══════════════════════════════════════════════════
//                   ASYNC THUNKS
// ═══════════════════════════════════════════════════

// ── Register ─────────────────────────────────────────
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (payload, thunkAPI) => {
        try {
            const res = await api.post(ENDPOINTS.REGISTER, payload);
            return res.data;

        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Registration failed" }
            );
        }
    }
);

// ── Login ─────────────────────────────────────────────
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ identifier, password }, thunkAPI) => {
        try {
            // 1. Get the token
            const tokenRes = await api.post("/token/", { identifier, password });
            const { access, refresh } = tokenRes.data;

            // 2. Fetch current user profile using the new token
            const userRes = await api.get(ENDPOINTS.USERS_ME, {
                headers: { Authorization: `Bearer ${access}` },
            });
            const username = userRes.data.results?.[0]?.username || null;

            return { access, refresh, username };
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Login failed" }
            );
        }
    }
);

// ── Get Current User ──────────────────────────────────
export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (pk, thunkAPI) => {
        try {
            return await authService.getUser(pk);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Failed to fetch user" }
            );
        }
    }
);

// ── Update User ───────────────────────────────────────
export const updateUser = createAsyncThunk(
    "auth/updateUser",
    async ({ pk, data }, thunkAPI) => {
        try {
            return await authService.updateUser(pk, data);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Update failed" }
            );
        }
    }
);

// ── Delete User ───────────────────────────────────────
export const deleteUser = createAsyncThunk(
    "auth/deleteUser",
    async (pk, thunkAPI) => {
        try {
            await authService.deleteUser(pk);
            return pk;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Delete failed" }
            );
        }
    }
);

// ── Generate Code (forgot-password | account-activation) ──
export const generateCode = createAsyncThunk(
    "auth/generateCode",
    async (payload, thunkAPI) => {
        try {
            return await authService.generateCode(payload);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Failed to generate code" }
            );
        }
    }
);

// ── Verify Email ──────────────────────────────────────
export const verifyEmail = createAsyncThunk(
    "auth/verifyEmail",
    async (payload, thunkAPI) => {
        try {
            return await authService.verifyEmail(payload);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Email verification failed" }
            );
        }
    }
);

// ── Forgot Password ───────────────────────────────────
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (payload, thunkAPI) => {
        try {
            return await authService.forgotPassword(payload);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || { message: "Password reset failed" }
            );
        }
    }
);

// ═══════════════════════════════════════════════════
//                     SLICE
// ═══════════════════════════════════════════════════
const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        // Manual logout
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
            state.successMsg = null;
            state.emailVerified = false;
            state.codeRequested = false;
            localStorage.removeItem("token");
            localStorage.removeItem("username");
        },

        // Clear error / success messages
        clearMessages(state) {
            state.error = null;
            state.successMsg = null;
        },

        // Reset code-requested flag
        resetCodeRequested(state) {
            state.codeRequested = false;
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

        // ── Register ───────────────────────────────────
        builder
            .addCase(registerUser.pending, setLoading)
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.successMsg = "Account created! Please verify your email.";
            })
            .addCase(registerUser.rejected, setError)

            // ── Login ──────────────────────────────────────
            .addCase(loginUser.pending, setLoading)
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.username;
                state.token = action.payload.access;
                localStorage.setItem("token", action.payload.access);
                if (action.payload.username) {
                    localStorage.setItem("username", action.payload.username);
                }
            })
            .addCase(loginUser.rejected, setError)

            // ── Fetch Current User ─────────────────────────
            .addCase(fetchCurrentUser.pending, setLoading)
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(fetchCurrentUser.rejected, setError)

            // ── Update User ────────────────────────────────
            .addCase(updateUser.pending, setLoading)
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.successMsg = "Profile updated successfully!";
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(updateUser.rejected, setError)

            // ── Delete User ────────────────────────────────
            .addCase(deleteUser.pending, setLoading)
            .addCase(deleteUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem("token");
                localStorage.removeItem("username");
            })
            .addCase(deleteUser.rejected, setError)

            // ── Generate Code ──────────────────────────────
            .addCase(generateCode.pending, setLoading)
            .addCase(generateCode.fulfilled, (state, action) => {
                state.loading = false;
                state.codeRequested = true;
                state.successMsg = action.payload?.message || "Code sent to your email!";
            })
            .addCase(generateCode.rejected, setError)

            // ── Verify Email ───────────────────────────────
            .addCase(verifyEmail.pending, setLoading)
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.emailVerified = true;
                state.successMsg = action.payload?.message || "Email verified!";
            })
            .addCase(verifyEmail.rejected, setError)

            // ── Forgot Password ────────────────────────────
            .addCase(forgotPassword.pending, setLoading)
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.successMsg = action.payload?.message || "Password reset successful!";
            })
            .addCase(forgotPassword.rejected, setError);
    },
});

export const { logout, clearMessages, resetCodeRequested } = authSlice.actions;
export default authSlice.reducer;

// ── Selectors ─────────────────────────────────────────
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthSuccess = (state) => state.auth.successMsg;
export const selectCodeRequested = (state) => state.auth.codeRequested;
export const selectEmailVerified = (state) => state.auth.emailVerified;