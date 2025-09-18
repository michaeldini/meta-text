/*
 * Route definitions for the application.
 * Keeps `src/App.tsx` focused on composition and routing logic.
 */
import React, { lazy } from 'react';

export type LazyPage = React.LazyExoticComponent<React.ComponentType>;

export interface RouteConfig {
    path: string;
    element: LazyPage;
    protected?: boolean;
}

// Lazy-load pages to keep bundle size small.
const HomePage = lazy(() => import('@pages/HomePage/HomePage'));
const LoginPage = lazy(() => import('@pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/Auth/RegisterPage'));

const SourceDocDetailPage = lazy(() => import('@pages/SourceDocument/SourceDocDetailPage'));

const MetatextDetailPage = lazy(() => import('@pages/Metatext/MetatextDetailPage'));
const MetatextReviewPage = lazy(() => import('@pages/Metatext/MetatextReviewPage'));

const ExperimentsPage = lazy(() => import('@pages/ExperimentsPage'));
const RussianDollsPage = lazy(() => import('@pages/RussianDollsPage'));

export const routes: RouteConfig[] = [
    { path: '/', element: HomePage, protected: true },
    { path: '/login', element: LoginPage, protected: false },
    { path: '/register', element: RegisterPage, protected: false },

    { path: '/sourcedoc/:sourceDocId', element: SourceDocDetailPage, protected: true },
    { path: '/metatext/:metatextId', element: MetatextDetailPage, protected: true },
    { path: '/metatext/:metatextId/review', element: MetatextReviewPage, protected: true },

    { path: '/experiments', element: ExperimentsPage, protected: true },
    { path: '/russiandolls', element: RussianDollsPage, protected: true },
];

export default routes;
