import { format, formatDistanceToNow, parseISO } from "date-fns";

/**
 * Format ISO date string → "Jan 12, 2025"
 */
export const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
        return format(parseISO(dateStr), "MMM dd, yyyy");
    } catch {
        return dateStr;
    }
};

/**
 * Relative time → "2 hours ago"
 */
export const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    try {
        return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
    } catch {
        return dateStr;
    }
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

/**
 * Truncate long text
 */
export const truncate = (str, n = 80) =>
    str?.length > n ? str.slice(0, n) + "..." : str;

/**
 * Get user initials from username
 */
export const getInitials = (name = "") =>
    name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);