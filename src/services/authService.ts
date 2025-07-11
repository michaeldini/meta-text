// Ai generated code 

import { apiPost, apiGet } from '../utils/api';

const API_BASE = '/api/auth';

type AuthPayload = { username: string; password: string };

type AuthResponse = { access_token: string; token_type: string };

type User = { id: number; username: string };

export async function register({ username, password }: AuthPayload): Promise<User> {
    return await apiPost(`${API_BASE}/register`, { username, password });
}

export async function login({ username, password }: AuthPayload): Promise<AuthResponse> {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return await apiPost(`${API_BASE}/token`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
}

export async function getMe(token: string): Promise<User> {
    return await apiGet(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}
