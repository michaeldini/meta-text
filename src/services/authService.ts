
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
    // POST to /auth/login with JSON body
    return await apiPost(`${API_BASE}/login`, { username, password });
}

export async function refreshToken(): Promise<AuthResponse> {
    return await apiPost(`${API_BASE}/refresh`);
}

export async function logout(): Promise<void> {
    await apiPost(`${API_BASE}/logout`);
}

export async function getMe(token: string): Promise<User> {
    return await apiGet(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}
