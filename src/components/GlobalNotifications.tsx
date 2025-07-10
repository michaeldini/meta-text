import React from 'react';
import { Snackbar } from '@mui/material';

import { useNotificationStore } from 'store';
import { NOTIFICATION_CONSTANTS } from 'constants';
import { AppAlert } from 'components';

const GlobalNotifications: React.FC = () => {
    const { notifications, hideNotification } = useNotificationStore();

    return (
        <>
            {notifications.map((notification, index) => (
                <Snackbar
                    key={notification.id}
                    open={true}
                    autoHideDuration={notification.duration}
                    onClose={() => hideNotification(notification.id)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{
                        position: 'fixed',
                        bottom: NOTIFICATION_CONSTANTS.POSITION_BOTTOM + (index * NOTIFICATION_CONSTANTS.STACK_OFFSET),
                        right: NOTIFICATION_CONSTANTS.POSITION_RIGHT,
                        zIndex: NOTIFICATION_CONSTANTS.Z_INDEX
                    }}
                >
                    <AppAlert
                        onClose={() => hideNotification(notification.id)}
                        severity={notification.type}
                    >
                        {notification.message}
                    </AppAlert>
                </Snackbar>
            ))}
        </>
    );
};

export default GlobalNotifications;
