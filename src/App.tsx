/* 
*  Main application component for MetaText
*  - Sets up routing and lazy loading for pages
*/
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Box, Text } from '@styles';
import { NavBar } from '@features/navbar';
import { GlobalNotifications } from '@components/GlobalNotifications';
import { Boundary } from '@components/Boundaries';
import { useAuthRefresh } from '@hooks/useAuthRefresh';
import { useAuthStore } from '@store/authStore';
import { useUserConfig } from '@services/userConfigService';

import routes from './routes';
import ProtectedRoute from './components/ProtectedRoute';
// Static 404 component to prevent recreation on each render
const NotFound = (
    <Box>
        <Text as="h2">Page not found</Text>
    </Box>
);

export default function App() {
    return (
        <Boundary fallbackText="Loading app...">
            <AppContent />
        </Boundary>
    );
}

export function AppContent() {
    // Refresh auth token on mount
    useAuthRefresh();

    // Hydrate user configuration when user logs in
    const { user } = useAuthStore();
    useUserConfig(!!user);

    return (
        <Boundary fallbackText="Loading">
            <Suspense>
                <Box noPad>
                    <GlobalNotifications />
                    <NavBar />
                    <Routes>
                        {routes.map((route) => {
                            const Page = route.element;
                            const pageElement = <Page />;
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={
                                        route.protected ? (
                                            <ProtectedRoute>{pageElement}</ProtectedRoute>
                                        ) : (
                                            pageElement
                                        )
                                    }
                                />
                            );
                        })}
                        <Route path="*" element={NotFound} />
                    </Routes>
                </Box>
            </Suspense>
        </Boundary>
    );
}
