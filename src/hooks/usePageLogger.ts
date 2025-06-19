import React from 'react';
import log from '../utils/logger';

/**
 * Generalized page lifecycle and event logger for main pages.
 * Logs mount/unmount and optionally custom events or data changes.
 *
 * @param pageName - Name of the page/component for log context
 * @param options - Optional object:
 *   - watched: array of [label, value] pairs to log on change
 *   - events: array of { label, value } to log on mount
 */
export function usePageLogger(
    pageName: string,
    options?: {
        watched?: Array<[string, unknown]>;
        events?: Array<{ label: string; value: unknown }>;
    }
) {
    React.useEffect(() => {
        log.info(`[${pageName}] mounted`);
        if (options?.events) {
            options.events.forEach(({ label, value }) => {
                log.info(`[${pageName}] ${label}:`, value);
            });
        }
        return () => log.info(`[${pageName}] unmounted`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (options?.watched) {
            options.watched.forEach(([label, value]) => {
                log.info(`[${pageName}] ${label} changed:`, value);
            });
        }
        // Only run when watched values change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, options?.watched?.map(([, value]) => value) ?? []);
}
