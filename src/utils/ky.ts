/**
 * API client for making requests to the backend
 * Use to make requests.
 * Provides fallback token refresh for edge cases.
 * Primary refresh is handled by useAuthRefresh hook.
 */

import ky from 'ky';
import { HTTPError } from 'ky';

type RetryableOptions = RequestInit & { _retried?: boolean };

// Centralized ky instance for all API requests
export const api = ky.create({
    prefixUrl: '/api',
    credentials: 'include', // Include cookies in all requests
    hooks: {
        afterResponse: [
            async (request: Request, options: RetryableOptions, response: Response) => {
                // Fallback refresh mechanism for edge cases (server restarts, network issues, etc.)
                // Primary refresh is handled proactively by useAuthRefresh hook
                if ((response.status === 401 || response.status === 403)) {
                    // Prevent infinite retry loops
                    if (options._retried) {
                        console.warn('[ky] Auth retry failed, redirecting to login');
                        window.location.href = '/login';
                        return;
                    }

                    try {
                        console.info('[ky] Attempting fallback token refresh');
                        const refreshResp = await ky.post('/api/auth/refresh', { credentials: 'include' });

                        if (refreshResp.ok) {
                            console.info('[ky] Fallback refresh successful, retrying original request');
                            // Retry the original request once with cookies
                            const retryOptions = { ...options, _retried: true };
                            return ky(request, retryOptions);
                        } else {
                            console.warn('[ky] Fallback refresh failed - invalid response');
                        }
                    } catch (e) {
                        console.warn('[ky] Fallback refresh failed - network/server error:', e);
                    }

                    // All fallback attempts failed, redirect to login
                    window.location.href = '/login';
                }
                // For other response codes, return the response as-is
            }
        ]
    }
});
