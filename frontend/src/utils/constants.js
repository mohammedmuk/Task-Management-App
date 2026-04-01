export const PRIORITY = {
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
};

export const STATUS = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done",
};

export const PRIORITY_LABELS = {
    high: "High",
    medium: "Medium",
    low: "Low",
};

export const STATUS_LABELS = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
};

export const PRIORITY_COLORS = {
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low",
};

export const STATUS_COLORS = {
    todo: "badge-todo",
    in_progress: "badge-inprogress",
    done: "badge-done",
};

export const ENDPOINTS = {
    REGISTER: "/users/",
    USER: (pk) => `/users/${pk}/`,
    GENERATE_CODE: "/generate-code/",
    VERIFY_EMAIL: "/verify-email/",
    FORGOT_PASSWORD: "/forgot-password/",
    TASKS: "/tasks/",
    TASK: (pk) => `/tasks/${pk}/`,
};