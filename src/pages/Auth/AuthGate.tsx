import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '../../store/authStore';
import LoginPage from './LoginPage';
import log from '../../utils/logger';

interface AuthGateProps {
    children: ReactNode;
}

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
    const { user } = useAuth();
    useEffect(() => {
        log.info('AuthGate mounted');
        return () => log.info('AuthGate unmounted');
    }, []);
    if (!user) return <LoginPage />;
    return <>{children}</>;
};

export default AuthGate;
