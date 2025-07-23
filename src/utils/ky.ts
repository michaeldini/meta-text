import ky from 'ky';

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
            (request: Request, options: any, response: Response) => {
                // Handle expired/invalid tokens
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            }
        ]
    }
});
