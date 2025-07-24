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
                // Only redirect to login if user was previously authenticated
                const token = localStorage.getItem('access_token');
                if ((response.status === 401 || response.status === 403) && token) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
                // If no token, let the frontend handle the error (e.g., failed login)
            }
        ]
    }
});
