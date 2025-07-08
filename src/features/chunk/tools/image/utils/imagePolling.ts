/**
 * Utility function to poll for image availability
 * Attempts to load an image URL until it's available or timeout is reached
 */
export const pollImageAvailability = (
    url: string,
    timeout = 10000,
    interval = 300
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        const check = () => {
            const img = new window.Image();

            img.onload = () => resolve();

            img.onerror = () => {
                if (Date.now() - start >= timeout) {
                    reject(new Error('Image loading timeout'));
                } else {
                    setTimeout(check, interval);
                }
            };

            // Add cache-busting parameter to ensure fresh requests
            img.src = url + '?cacheBust=' + Date.now();
        };

        check();
    });
};
