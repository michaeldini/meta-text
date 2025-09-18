
// Ai generated code    

import { api } from '../utils/ky';

const API_BASE = 'auth';

type AuthPayload = { username: string; password: string };

type AuthResponse = { access_token: string; token_type: string };

type User = { id: number; username: string };

export async function register({ username, password }: AuthPayload): Promise<User> {
    return api.post(`${API_BASE}/register`, { json: { username, password } }).json<User>();
}

export async function login({ username, password }: AuthPayload): Promise<{ message: string }> {
    // POST to /auth/login with JSON body - tokens are set as httpOnly cookies
    return api.post(`${API_BASE}/login`, { json: { username, password } }).json<{ message: string }>();
}

export async function refreshToken(): Promise<{ message: string }> {
    return api.post(`${API_BASE}/refresh`).json<{ message: string }>();
}

export async function logout(): Promise<void> {
    await api.post(`${API_BASE}/logout`);
}

export async function getMe(): Promise<User> {
    return api.get(`${API_BASE}/me`).json<User>();
}
