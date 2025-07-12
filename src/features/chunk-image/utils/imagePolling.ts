/**
 * Utility function to poll for image availability with cancellation support
 * Attempts to load an image URL until it's available or timeout is reached
 * 
 * @param url - The image URL to check
 * @param timeout - Maximum time to wait in milliseconds (default: 10000)
 * @param interval - Time between checks in milliseconds (default: 300)
 * @returns Promise that resolves when image loads or rejects on timeout/error
 */
export const pollImageAvailability = (
    url: string,
    timeout = 10000,
    interval = 300
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        let timeoutId: number | null = null;
        let isAborted = false;

        const cleanup = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            isAborted = true;
        };

        const check = () => {
            if (isAborted) return;

            const img = new window.Image();

            img.onload = () => {
                cleanup();
                resolve();
            };

            img.onerror = () => {
                if (isAborted) return;

                const elapsed = Date.now() - start;
                if (elapsed >= timeout) {
                    cleanup();
                    reject(new Error(`Image loading timeout after ${timeout}ms`));
                } else {
                    timeoutId = setTimeout(check, interval);
                }
            };

            // Add cache-busting parameter to ensure fresh requests
            const separator = url.includes('?') ? '&' : '?';
            img.src = url + separator + 'cacheBust=' + Date.now();
        };

        check();

        // Return a cleanup function for external cancellation if needed
        return cleanup;
    });
};

/**
 * Creates a cancellable version of pollImageAvailability
 * Returns both the promise and an abort function
 */
export const createCancellableImagePoll = (
    url: string,
    timeout = 10000,
    interval = 300
) => {
    let cleanup: (() => void) | null = null;

    const promise = new Promise<void>((resolve, reject) => {
        const start = Date.now();
        let timeoutId: number | null = null;
        let isAborted = false;

        cleanup = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            isAborted = true;
            reject(new Error('Image polling cancelled'));
        };

        const check = () => {
            if (isAborted) return;

            const img = new window.Image();

            img.onload = () => {
                if (!isAborted) {
                    cleanup = null;
                    resolve();
                }
            };

            img.onerror = () => {
                if (isAborted) return;

                const elapsed = Date.now() - start;
                if (elapsed >= timeout) {
                    cleanup = null;
                    reject(new Error(`Image loading timeout after ${timeout}ms`));
                } else {
                    timeoutId = setTimeout(check, interval);
                }
            };

            const separator = url.includes('?') ? '&' : '?';
            img.src = url + separator + 'cacheBust=' + Date.now();
        };

        check();
    });

    return {
        promise,
        abort: () => cleanup?.()
    };
};
