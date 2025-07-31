
import { useEffect } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { toaster } from "./ui";
export interface AppAlertProps {
    /** The severity of the alert. This defines the color and icon. */
    severity: 'error' | 'success' | 'warning' | 'info';
    /** The main content of the alert. */
    children: ReactNode;
    /** An optional title for the alert. */
    title?: string;

}

// AppAlert: Triggers a global notification using the toaster system. Defers notification to a microtask to avoid React flushSync errors.
export function AppAlert({ severity, children, title }: AppAlertProps): ReactElement | null {
    useEffect(() => {
        queueMicrotask(() => {
            Promise.resolve().then(() => {
                toaster.create({
                    description: title ? `${title}: ${children}` : String(children),
                    type: severity,
                    closable: true,
                });
            });
        });
    }, [severity, children, title]);
    return null;
}