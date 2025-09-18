/**
 * Toaster notifications for global app messages.
 *
 * Features:
 * - Integrates with a global notification store for managing notification state.
 * - Uses Radix UI Toast for accessibility and animations.
 * - Supports different notification types (success, error, info, warning) with distinct styles.
 * - Automatically dismisses notifications after a set duration.
 * - Allows manual dismissal of notifications.
 *
 * Implementation Details:
 * - Uses a combination of context and hooks to manage notification state.
 * - Notifications are rendered using Radix UI Toast components for consistency and accessibility.
 */


import React, { useEffect, useState } from 'react';
import { useNotificationStore } from '@store/notificationStore';
import * as Toast from '@radix-ui/react-toast';
import { HiXCircle } from 'react-icons/hi';
import { styled, Box, IconWrapper } from '@styles';


/**
 *  Style the Toast root component with variants for different notification types.
 * 
 * This allows easy styling based on the notification type (success, error, info, warning).
 */
const StyledToastRoot = styled(Toast.Root, {
    display: 'flex',
    padding: '12px 16px',
    marginBottom: '12px',
    borderRadius: '8px',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',

    variants: {
        type: {
            success: {
                backgroundColor: '$colors$successBg',
                border: '2px solid $colors$successBorder',
                color: 'white',
            },
            error: {
                backgroundColor: '$colors$dangerBg',
                border: '2px solid $colors$dangerBorder',
                color: 'white',
            },
            info: {
                backgroundColor: '$colors$infoBg',
                border: '2px solid $colors$infoBorder',
                color: 'white',
            },
            warning: {
                backgroundColor: '$colors$warningBg',
                border: '2px solid $colors$warningBorder',
                color: 'black',
            },
        },
    },

    defaultVariants: {
        type: 'info',
    },
});

/**
 * GlobalNotifications
 *
 * Renders application-wide toast notifications using the global notification store
 * and Radix UI Toast primitives.
 *
 * The component subscribes to the notification store, maps notifications to
 * accessible toast elements, and manages local open state so notifications
 * are automatically dismissed after their configured duration or can be
 * dismissed manually by the user.
 *
 * @returns {React.ReactElement | null} The rendered toast elements or null when
 * there are no notifications to display.
 */
export function GlobalNotifications(): React.ReactElement | null {

    /**
     * Notifications come from the global notification store.
     * 
     */
    const { notifications } = useNotificationStore();

    /**
     * Local state to track which notifications are currently open.
     * This is needed because Radix Toast manages open state internally.
     * We initialize it to include all current notifications and update it
     * whenever the notifications array changes.
     */
    const [openIds, setOpenIds] = useState<string[]>([]);


    /**
     * Sync openIds with notifications from the store.
     * Whenever notifications change, we reset openIds to include all
     * current notification IDs so they are shown.
     */
    useEffect(() => {
        setOpenIds(notifications.map(n => n.id));
    }, [notifications]);

    return (
        <Box>

            {/* for each notification we render a toast */}
            {notifications.map((notification) => {

                return (
                    <Toast.Provider swipeDirection="right" key={notification.id}>

                        {/* The styled toast takes all the props that the <Toast.Root> component accepts */}
                        <StyledToastRoot
                            type={notification.type || 'info'}
                            open={openIds.includes(notification.id)}
                            onOpenChange={(open) => {
                                if (!open) setOpenIds(ids => ids.filter(id => id !== notification.id));
                            }}
                            duration={notification.duration || 3000}
                        >
                            <Toast.Description>
                                {notification.message}
                            </Toast.Description>

                            <Toast.Close aria-label="Dismiss notification" asChild>
                                <IconWrapper>
                                    <HiXCircle />
                                </IconWrapper>
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
