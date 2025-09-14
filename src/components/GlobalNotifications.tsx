

import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '@store/notificationStore';
import * as Toast from '@radix-ui/react-toast';
import { Box, Text } from '@styles';

import { styled } from '@stitches/react';

const toastStyles: Record<string, React.CSSProperties> = {
    success: {
        backgroundColor: '#22c55e',
        border: '2px solid #1a7f37',
        color: 'white',
    },
    error: {
        backgroundColor: '#ef4444',
        border: '2px solid #b91c1c',
        color: 'white',
    },
    info: {
        backgroundColor: '#3b82f6',
        border: '2px solid #1e40af',
        color: 'white',
    },
    warning: {
        backgroundColor: '#f59e42',
        border: '2px solid #b45309',
        color: 'black',
    },
};

const StyledToastRoot = styled(Toast.Root, {
    display: 'flex',
    padding: '12px 16px',
    marginBottom: '12px',
    borderRadius: '8px',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
});

export function GlobalNotifications(): React.ReactElement | null {
    const { notifications } = useNotificationStore();
    const [openIds, setOpenIds] = useState<string[]>([]);

    useEffect(() => {
        setOpenIds(notifications.map(n => n.id));
    }, [notifications]);

    return (
        <Box>
            {notifications.map((notification) => {
                const type = notification.type || 'info';
                const style = toastStyles[type] || toastStyles.info;
                // Map notification type to Text tone
                let textTone: 'default' | 'subtle' | 'danger' = 'default';
                if (type === 'error') textTone = 'danger';
                else if (type === 'success') textTone = 'default';
                else if (type === 'warning') textTone = 'subtle';
                else if (type === 'info') textTone = 'default';
                return (
                    <Toast.Provider swipeDirection="right" key={notification.id}>
                        <StyledToastRoot
                            open={openIds.includes(notification.id)}
                            onOpenChange={(open) => {
                                if (!open) setOpenIds(ids => ids.filter(id => id !== notification.id));
                            }}
                            duration={notification.duration || 3000}
                            style={style}
                        >
                            <Toast.Description asChild>
                                <Text tone={textTone}>{notification.message}</Text>
                            </Toast.Description>
                            <Toast.Close aria-label="Dismiss notification" asChild>
                                <span aria-hidden>×</span>
                            </Toast.Close>
                        </StyledToastRoot>
                        <Toast.Viewport style={{ position: 'fixed', bottom: 0, right: 0, padding: '16px', zIndex: 9999 }} />
                    </Toast.Provider>
                );
            })}
        </Box>
    );
}

export default GlobalNotifications;
