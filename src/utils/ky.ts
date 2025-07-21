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
        ]
    }
});
