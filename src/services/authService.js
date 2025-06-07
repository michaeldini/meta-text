// src/services/authService.js
import handleApiResponse from '../utils/api';

const API_BASE = '/api/auth';

export async function register({ username, password }) {
    const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return handleApiResponse(res, 'Registration failed');
}

export async function login({ username, password }) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    const res = await fetch(`${API_BASE}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });
    return handleApiResponse(res, 'Login failed');
}

export async function getMe(token) {
    const res = await fetch(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleApiResponse(res, 'Failed to fetch user info');
}
