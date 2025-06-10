// src/pages/Auth/AuthGate.jsx
import React from 'react';
import { useAuth } from '../../store/authStore';
import LoginPage from './LoginPage';
import log from '../../utils/logger';

export default function AuthGate({ children }) {
    const { user } = useAuth();
    React.useEffect(() => {
        log.info('AuthGate mounted');
        return () => log.info('AuthGate unmounted');
    }, []);
    if (!user) return <LoginPage />;
    return children;
}
