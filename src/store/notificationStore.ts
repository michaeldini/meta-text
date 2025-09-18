/**
 * Zustand store for managing global notifications.
 * 
 * - Supports different notification types (success, error, warning, info).
 * - Notifications can auto-hide after a duration or be manually dismissed.
 * - Provides convenience hooks for showing common notification types.
 * 
 * Usage:
 * const { notifications, showNotification, hideNotification, clearAllNotifications } = useNotificationStore();
 * 
 * or using the convenience wrapper:
 * 
 * const { showSuccess, showError, showWarning, showInfo, hideNotification, clearAllNotifications } = useNotifications();   
 * showSuccess("Operation completed successfully", 5000);
 * showError("An error occurred", 0); // 0 duration means it won't auto-hide
 * 
 * - Notifications are objects with id, message, type, and optional duration.
 * 
 * Notes:
 *  Display of notifications is handled by the GlobalNotifications component.
 *  Generation of notifications is done via the store methods in whatever component needs to show them.
 * 
 */

import { create } from 'zustand';

/**
 * Union of allowed notification types.
 *
 * - 'success': Indicates a successful operation.
 * - 'error': Indicates an error or failure.
 * - 'warning': Indicates a potential issue or caution.
 * - 'info': Informational message.
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Represents a single notification shown to the user.
 *
 * Properties:
 * - id: Unique identifier for the notification.
 * - message: The text to display.
 * - type: The notification category (severity).
 * - duration: Optional duration in milliseconds before auto-hide. If omitted, then defaults to 3000ms. If set to 0, the notification will not auto-hide.
 */
interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
}

/**
 * Shape of the notification store maintained by zustand.
 *
 * Methods:
 * - notifications: Current array of notifications.
 * - showNotification: Adds a new notification and optionally auto-hides it after the given duration.
 * - hideNotification: Removes a notification by id.
 * - clearAllNotifications: Removes all notifications.
 */
interface NotificationState {

    /**
     * notifications: Current array of notifications.
     */
    notifications: Notification[];

    /**
     * showNotification: Adds a new notification.
     * @param message The message text to display.
     * @param type The notification type (severity).
     * @param duration Optional duration in milliseconds before auto-hide. Defaults to 3000ms. If set to 0, the notification will not auto-hide.
     */
    showNotification: (message: string, type: NotificationType, duration?: number) => void;

    /**
     * hideNotification: Removes a notification by id.
     * @param id The id of the notification to remove.
     */
    hideNotification: (id: string) => void;

    /**
     * clearAllNotifications: Removes all notifications.
     */
    clearAllNotifications: () => void;
}

/**
 * Zustand hook that provides the notification store.
 *
 * Usage:
 * const { notifications, showNotification, hideNotification, clearAllNotifications } = useNotificationStore();
 *
 * Notes:
 * - showNotification will auto-hide notifications after `duration` milliseconds when duration > 0.
 * - Notifications are appended to the existing list.
 */
export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],

    showNotification: (message: string, type: NotificationType, duration = 3000) => {

        // Generate a simple unique id for the notification
        // In a real app, consider using a library like uuid
        const id = `notification-${Date.now()}-${Math.random()}`;

        // Create the notification object
        const notification: Notification = { id, message, type, duration };

        // Add the notification to the store
        // We use functional set to ensure we append to the current state
        // (this avoids issues if multiple notifications are added in quick succession)
        set((state) => ({
            notifications: [...state.notifications, notification]
        }));

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter(n => n.id !== id)
                }));
            }, duration);
        }
    },

    hideNotification: (id: string) => {
        // Remove the notification with the given id
        set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
        }));
    },

    clearAllNotifications: () => {
        set({ notifications: [] });
    },
}));


/**
 * Convenience wrapper around useNotificationStore exposing helpers for common notification types.
 *
 * Returns:
 * - showSuccess(message, duration?) — show a success notification.
 * - showError(message, duration?) — show an error notification.
 * - showWarning(message, duration?) — show a warning notification.
 * - showInfo(message, duration?) — show an informational notification.
 * - hideNotification(id) — remove a notification by id.
 * - clearAllNotifications() — remove all notifications.
 * 
 * Usage:
 * const { showSuccess, showError, showWarning, showInfo, hideNotification, clearAllNotifications } = useNotifications();
 * showSuccess("Operation completed successfully", 5000);
 * showError("An error occurred", 0); // 0 duration means it won't auto-hide
 * 
 * Notes:
 * - This is just a convenience wrapper around useNotificationStore.
 * - Notifications are displayed by the GlobalNotifications component.
 */
export function useNotifications() {
    const { showNotification, hideNotification, clearAllNotifications } = useNotificationStore();

    return {
        showSuccess: (message: string, duration?: number) => showNotification(message, 'success', duration),
        showError: (message: string, duration?: number) => showNotification(message, 'error', duration),
        showWarning: (message: string, duration?: number) => showNotification(message, 'warning', duration),
        showInfo: (message: string, duration?: number) => showNotification(message, 'info', duration),
        hideNotification,
        clearAllNotifications,
    };
};
