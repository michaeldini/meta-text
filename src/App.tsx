/**
 * 
 * CrashToggle component for testing error boundaries
 * 
 * This component allows toggling a crash state to simulate errors in the app.
 * It includes:
 * - A button to toggle the crash state.
 * - A Bomb component that throws an error when the crash state is active.
 * 
 * Usage:
 * - Click the button to trigger or reset a crash.
 * - When crashed, the Bomb component will throw an error, which can be caught by an error boundary.
 */
import { useState } from "react";

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) {
        // This simulates a render-time error
        throw new Error("Manual crash: Bomb component threw!");
    }
    return <div>Bomb is safe — toggle to explode.</div>;
}

export function CrashToggle() {
    const [explode, setExplode] = useState(false);
    return (
        <div style={{ padding: 8 }}>
            <button onClick={() => setExplode((s) => !s)}>
                {explode ? "Reset (un-crash)" : "Trigger crash"}
            </button>
            <div style={{ marginTop: 8 }}>
                <Bomb shouldThrow={explode} />
            </div>
        </div>
    );
}
/* 
*
*  Main application component for MetaText
*
*  - Sets up:
*   - Navigation bar
*   - Global notifications
*   - Authentication refresh on mount
*   - User configuration hydration on login
*
* 
* - Layout
*   - Uses a Box component for layout without padding
*   - App always displays NavBar at the top with the routes below
*   - GlobalNotifications component is always mounted and will show toasts as needed
* 
* 
* - Routing
*   - Uses React Router's Routes and Route components
*   - Maps over route definitions imported from `src/routes.ts`
*   - Wraps protected routes in a ProtectedRoute component to enforce authentication
*   - Catches all unmatched routes and displays a NotFound component
* 
* 
* - Error handling
*  - NotFound component displays a simple "Page not found" message for unmatched routes
* 
*/
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import ProtectedRoute from './components/ProtectedRoute';
import { NavBar } from '@features/navbar';
import { GlobalNotifications } from '@components/GlobalNotifications';
import { useAuthRefresh } from '@hooks/useAuthRefresh';
import { useAuthStore } from '@store/authStore';
import { useUserConfig } from '@services/userConfigService';
import { Box, Text } from '@styles';

/**
 * 404 component
 *
 * This is displayed when the user navigates to a route that does not exist.
 * 
 */
const NotFound = (
    <Box>
        <Text as="h2">Page not found</Text>
    </Box>
);

/**
 * App
 *
 * Root application component for MetaText.
 *
 * Responsibilities:
 * - Runs mount-time effects (refresh auth and hydrate user config).
 * - Renders global UI chrome (NavBar, GlobalNotifications) and a crash-testing toggle.
 * - Sets up client-side routing and wraps protected routes with ProtectedRoute.
 *
 * Notes:
 * - Uses useAuthRefresh and useUserConfig for side effects on mount and on auth changes.
 * - Returns the top-level layout containing routes and global components.
 *
 * @returns {JSX.Element} The root application element.
 */
export default function App() {

    /**
     * 
     * On mount actions:
     * - Refresh user configuration on app mount
     * - Refresh authentication token on app mount
     * - Hydrate user configuration when user logs in
     *
     */
    useAuthRefresh();
    const { user } = useAuthStore();
    useUserConfig(!!user);

    return (
        <Box noPad>

            {/* Global components */}
            <GlobalNotifications />
            <NavBar />
            <CrashToggle />

            {/* Routing
            Protected routes are wrapped in a ProtectedRoute component */}
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

                {/* Catch all unmatched routes */}
                <Route path="*" element={NotFound} />


            </Routes>
        </Box>
    );
}


