// src/pages/Auth/AuthGate.jsx
import React from 'react';
import { useAuth } from '../../store/authStore';
import LoginPage from './LoginPage';

export default function AuthGate({ children }) {
    const { user } = useAuth();
    if (!user) return <LoginPage />;
    return children;
}
