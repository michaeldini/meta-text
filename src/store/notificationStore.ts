import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
}

interface NotificationState {
    notifications: Notification[];
    showNotification: (message: string, type: NotificationType, duration?: number) => void;
    hideNotification: (id: string) => void;
    clearAllNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],

    showNotification: (message: string, type: NotificationType, duration = 6000) => {
        const id = `notification-${Date.now()}-${Math.random()}`;
        const notification: Notification = { id, message, type, duration };

        set((state) => ({
            notifications: [...state.notifications, notification]
        }));
        console.info(`Notifications: ${notification.id} - ${notification.message} (${notification.type})`);
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
        set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
        }));
    },

    clearAllNotifications: () => {
        set({ notifications: [] });
    },
}));

// Convenience hooks for common notification types
export const useNotifications = () => {
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
