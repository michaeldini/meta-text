

import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '@store/notificationStore';
import * as Toast from '@radix-ui/react-toast';

export function GlobalNotifications(): React.ReactElement | null {
    const { notifications } = useNotificationStore();
    const [openIds, setOpenIds] = useState<string[]>([]);

    useEffect(() => {
        setOpenIds(notifications.map(n => n.id));
    }, [notifications]);

    return (
        <Toast.Provider swipeDirection="right">
            {notifications.map((notification) => (
                <Toast.Root
                    key={notification.id}
                    open={openIds.includes(notification.id)}
                    onOpenChange={(open) => {
                        if (!open) setOpenIds(ids => ids.filter(id => id !== notification.id));
                    }}
                    duration={notification.duration || 4000}
                    type={notification.type === 'error' ? 'foreground' : 'background'}
                >
                    <Toast.Title>{notification.message}</Toast.Title>
                    <Toast.Description>{notification.message}</Toast.Description>
                    <Toast.Close aria-label="Dismiss notification">
                        <span aria-hidden>×</span>
                    </Toast.Close>
                </Toast.Root>
            ))}
            <Toast.Viewport
                style={{
                    position: 'fixed',
                    bottom: 24,
                    left: 24,
                    maxWidth: 360,
                    zIndex: 9999,
                    outline: 'none',
                }}
            />
        </Toast.Provider>
    );
}

export default GlobalNotifications;
