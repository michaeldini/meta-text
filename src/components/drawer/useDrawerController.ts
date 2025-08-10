// Hook: useDrawerController
// Provides a consistent API to control a drawer (or any modal) with optional payload data.
// Avoids repeating open state + payload logic in individual components.
import React from 'react';

export interface DrawerController<T = undefined> {
    open: boolean;
    payload: T | undefined;
    openWith: (payload?: T) => void;
    close: () => void;
    toggle: (payload?: T) => void;
}

export function useDrawerController<T = undefined>(initialOpen = false): DrawerController<T> {
    const [open, setOpen] = React.useState(initialOpen);
    const [payload, setPayload] = React.useState<T | undefined>(undefined);

    const openWith = React.useCallback((p?: T) => {
        setPayload(p);
        setOpen(true);
    }, []);

    const close = React.useCallback(() => {
        setOpen(false);
        setPayload(undefined);
    }, []);

    const toggle = React.useCallback((p?: T) => {
        setOpen(prev => {
            const next = !prev;
            if (next) setPayload(p); else setPayload(undefined);
            return next;
        });
    }, []);

    return { open, payload, openWith, close, toggle };
}

export default useDrawerController;
