import React from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';
import { useNotificationStore } from '../store/notificationStore';

const GlobalNotifications: React.FC = () => {
    const { notifications, hideNotification } = useNotificationStore();

    return (
        <>
            {notifications.map((notification) => (
                <Snackbar
                    key={notification.id}
                    open={true}
                    autoHideDuration={notification.duration}
                    onClose={() => hideNotification(notification.id)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{
                        position: 'fixed',
                        bottom: 16 + (notifications.indexOf(notification) * 70), // Stack notifications
                        right: 16,
                        zIndex: 1400
                    }}
                >
                    <Alert
                        onClose={() => hideNotification(notification.id)}
                        severity={notification.type}
                        variant="filled"
                        sx={{ minWidth: 300 }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
};

export default GlobalNotifications;
