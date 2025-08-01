// Component for global notifications using Chakra UI toast system
// Listens to notification store and displays notifications using Chakra UI

import React, { useEffect } from 'react';
import { useNotificationStore } from '@store/notificationStore';
import { toaster } from './ui';

export function GlobalNotifications(): React.ReactElement | null {
    const { notifications } = useNotificationStore();

    useEffect(() => {
        notifications.forEach((notification) => {
            Promise.resolve().then(() => {
                toaster.create({
                    id: notification.id,
                    title: notification.message || undefined,
                    description: notification.message,
                    type: notification.type,
                    duration: notification.duration,
                    closable: true,
                });
            });
        });
    }, [notifications]);
    return null;
}

export default GlobalNotifications;
