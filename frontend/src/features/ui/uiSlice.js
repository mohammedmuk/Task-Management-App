import { createSlice } from "@reduxjs/toolkit";

// ── Initial State ────────────────────────────────────
const initialState = {
    // Sidebar
    sidebarOpen: true,

    // Modal
    modalOpen: false,
    modalType: null,          // "create" | "edit"

    // Task Detail Side Panel
    detailPanelOpen: false,

    // Toast notification
    toast: {
        visible: false,
        message: "",
        type: "success",       // "success" | "error" | "info" | "warning"
        duration: 3000,
    },

    // Confirm dialog (for delete)
    confirmDialog: {
        open: false,
        title: "",
        message: "",
    },

    // Global page loading (transitions)
    pageLoading: false,

    // Active nav item
    activeNav: "dashboard",

    // Theme (future use)
    theme: "dark",
};

// ═══════════════════════════════════════════════════
//                     SLICE
// ═══════════════════════════════════════════════════
const uiSlice = createSlice({
    name: "ui",
    initialState,

    reducers: {

        // ── Sidebar ──────────────────────────────────
        toggleSidebar(state) {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebarOpen(state, action) {
            state.sidebarOpen = action.payload;
        },

        // ── Modal ─────────────────────────────────────
        openModal(state, action) {
            state.modalOpen = true;
            state.modalType = action.payload || "create";
        },
        closeModal(state) {
            state.modalOpen = false;
            state.modalType = null;
        },

        // ── Detail Panel ──────────────────────────────
        openDetailPanel(state) {
            state.detailPanelOpen = true;
        },
        closeDetailPanel(state) {
            state.detailPanelOpen = false;
        },
        toggleDetailPanel(state) {
            state.detailPanelOpen = !state.detailPanelOpen;
        },

        // ── Toast ─────────────────────────────────────
        showToast(state, action) {
            state.toast = {
                visible: true,
                message: action.payload.message,
                type: action.payload.type || "success",
                duration: action.payload.duration || 3000,
            };
        },
        hideToast(state) {
            state.toast.visible = false;
        },

        // ── Confirm Dialog ────────────────────────────
        openConfirmDialog(state, action) {
            state.confirmDialog = {
                open: true,
                title: action.payload.title || "Are you sure?",
                message: action.payload.message || "",
            };
        },
        closeConfirmDialog(state) {
            state.confirmDialog = {
                open: false,
                title: "",
                message: "",
            };
        },

        // ── Page Loading ──────────────────────────────
        setPageLoading(state, action) {
            state.pageLoading = action.payload;
        },

        // ── Active Nav ────────────────────────────────
        setActiveNav(state, action) {
            state.activeNav = action.payload;
        },

        // ── Theme ─────────────────────────────────────
        toggleTheme(state) {
            state.theme = state.theme === "dark" ? "light" : "dark";
        },
    },
});

export const {
    // Sidebar
    toggleSidebar,
    setSidebarOpen,
    // Modal
    openModal,
    closeModal,
    // Detail Panel
    openDetailPanel,
    closeDetailPanel,
    toggleDetailPanel,
    // Toast
    showToast,
    hideToast,
    // Confirm Dialog
    openConfirmDialog,
    closeConfirmDialog,
    // Page Loading
    setPageLoading,
    // Active Nav
    setActiveNav,
    // Theme
    toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;

// ── Selectors ─────────────────────────────────────────
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectModalOpen = (state) => state.ui.modalOpen;
export const selectModalType = (state) => state.ui.modalType;
export const selectDetailPanel = (state) => state.ui.detailPanelOpen;
export const selectToast = (state) => state.ui.toast;
export const selectConfirmDialog = (state) => state.ui.confirmDialog;
export const selectPageLoading = (state) => state.ui.pageLoading;
export const selectActiveNav = (state) => state.ui.activeNav;
export const selectTheme = (state) => state.ui.theme;