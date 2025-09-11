/* eslint-disable react-refresh/only-export-components */
"use client"

import * as Toast from '@radix-ui/react-toast';
import { useNotificationStore } from '@store/notificationStore';
import React, { useEffect, useState } from 'react';

// Imperative API for showing toasts
export const toaster = {
  show: (message: string, type: string = 'info', duration: number = 4000) => {
    const event = new CustomEvent('show-notification', {
      detail: { message, type, duration }
    });
    window.dispatchEvent(event);
  }
};

export function Toaster() {
  const { notifications } = useNotificationStore();
  const [openIds, setOpenIds] = useState<string[]>([]);

  useEffect(() => {
    setOpenIds(notifications.map(n => n.id));
  }, [notifications]);

  // Listen for imperative API
  useEffect(() => {
    const handler = (e: CustomEvent<{ message: string; type: string; duration: number }>) => {
      const { message, type, duration } = e.detail;
      useNotificationStore.getState().showNotification(message, type as any, duration);
    };
    window.addEventListener('show-notification', handler as EventListener);
    return () => window.removeEventListener('show-notification', handler as EventListener);
  }, []);

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
