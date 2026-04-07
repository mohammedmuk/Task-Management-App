// ── Module-level callback store for ConfirmDialog ────
// Redux state cannot hold non-serializable values like functions.
// We keep the onConfirm callback here, outside Redux.

let _pendingConfirmCallback = null;

export const setConfirmCallback = (fn) => {
    _pendingConfirmCallback = fn;
};

export const runConfirmCallback = () => {
    if (typeof _pendingConfirmCallback === "function") {
        _pendingConfirmCallback();
    }
    _pendingConfirmCallback = null;
};

export const clearConfirmCallback = () => {
    _pendingConfirmCallback = null;
};
