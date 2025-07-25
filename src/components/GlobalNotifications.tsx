// Component for global notifications using Material-UI Snackbar and Alert components
// This component listens to a notification store and displays notifications at the bottom left of the screen
// I tried to implement AppAlert.tsx, but there was a conflict with the Snackbar component transitions

import React from 'react';
import { Snackbar, Alert } from '@mui/material';

import { useNotificationStore } from 'store';
import { NOTIFICATION_CONSTANTS } from 'constants';

export function GlobalNotifications(props: Record<string, unknown>): React.ReactElement {
    const { notifications, hideNotification } = useNotificationStore();

    return (
        <>
            {notifications.map((notification, index) => (
                <Snackbar
                    key={notification.id}
                    open={true}
                    autoHideDuration={notification.duration}
                    onClose={() => hideNotification(notification.id)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    sx={{
                        position: 'fixed',
                        bottom: NOTIFICATION_CONSTANTS.POSITION_BOTTOM + (index * NOTIFICATION_CONSTANTS.STACK_OFFSET),
                        right: NOTIFICATION_CONSTANTS.POSITION_RIGHT,
                        zIndex: NOTIFICATION_CONSTANTS.Z_INDEX
                    }}
                >
                    <Alert
                        onClose={() => hideNotification(notification.id)}
                        severity={notification.type}
                        variant="filled"
                        sx={{ minWidth: NOTIFICATION_CONSTANTS.MIN_WIDTH }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
}

export default GlobalNotifications;
