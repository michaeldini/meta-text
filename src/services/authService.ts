
// Ai generated code    

import { api } from '../utils/ky';

const API_BASE = 'auth';

type AuthPayload = { username: string; password: string };

type AuthResponse = { access_token: string; token_type: string };

type User = { id: number; username: string };

export async function register({ username, password }: AuthPayload): Promise<User> {
    return api.post(`${API_BASE}/register`, { json: { username, password } }).json<User>();
}

export async function login({ username, password }: AuthPayload): Promise<AuthResponse> {
    // POST to /auth/login with JSON body
    return api.post(`${API_BASE}/login`, { json: { username, password } }).json<AuthResponse>();
}

export async function refreshToken(): Promise<AuthResponse> {
    return api.post(`${API_BASE}/refresh`).json<AuthResponse>();
}

export async function logout(): Promise<void> {
    await api.post(`${API_BASE}/logout`);
}

export async function getMe(token: string): Promise<User> {
    return api.get(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).json<User>();
}
