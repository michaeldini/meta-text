/**
 * API client for making requests to the backend
 * Use to make requests.
 * Attaches authentication headers to requests.
 */

import ky from 'ky';
import { HTTPError } from 'ky';

type RetryableOptions = RequestInit & { _retried?: boolean };

// Centralized ky instance for all API requests
export const api = ky.create({
    prefixUrl: '/api',
    hooks: {
        beforeRequest: [
            request => {
                // Add JWT token if available
                const token = localStorage.getItem('access_token');
                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`);
                }
            }
        ],
        afterResponse: [
            async (request: Request, options: RetryableOptions, response: Response) => {
                const token = localStorage.getItem('access_token');
                // Only attempt refresh if user was previously authenticated
                if ((response.status === 401 || response.status === 403) && token) {
                    // Prevent infinite retry loops
                    if (options._retried) {
                        localStorage.removeItem('access_token');
                        window.location.href = '/login';
                        return;
                    }
                    try {
                        const refreshResp = await ky.post('/api/auth/refresh', { credentials: 'include' });
                        if (refreshResp.ok) {
                            const { access_token } = await refreshResp.json<{ access_token: string }>();
                            localStorage.setItem('access_token', access_token);
                            // Retry the original request with the new token, mark as retried
                            const retryOptions = { ...options, _retried: true };
                            retryOptions.headers = new Headers(request.headers);
                            retryOptions.headers.set('Authorization', `Bearer ${access_token}`);
                            // Use ky directly to retry the request
                            return ky(request, retryOptions);
                        } else {
                            // Refresh failed, log out
                            localStorage.removeItem('access_token');
                            window.location.href = '/login';
                        }
                    } catch (e) {
                        // Refresh failed, log out
                        console.error('Token refresh failed:', e);
                        localStorage.removeItem('access_token');
                        window.location.href = '/login';
                    }
                }
                // If no token, let the frontend handle the error (e.g., failed login)
            }
        ]
    }
});
