/*
 * Route definitions for the application.
 * 
 * To be used with React Router + imported in `src/App.tsx`.
 * 
 * Each route includes:
 * - A path string
 * - A React component (lazy loaded) to render
 * - An optional 'protected' boolean indicating if the route requires authentication
 * 
 * Routes for the app include:
 * - LoginPage, RegisterPage (public)
 * - HomePage (protected)
 * - SourceDocDetailPage (protected)
 * - MetatextDetailPage, MetatextReviewPage (protected)
 * - ExperimentsPage, RussianDollsPage (protected)
 * 
 * Unmatched routes are handled in `src/App.tsx` with a NotFound component.
 * 
 * Lazy loading is used for route components to optimize initial load time.
 * 
 * 
 */
import React, { lazy } from 'react';

export type LazyPage = React.LazyExoticComponent<React.ComponentType>;

export interface RouteConfig {
    path: string;
    element: LazyPage;
    protected?: boolean;
}

/**
 * 
 * Lazy loaded route components
 * 
 * These components are only loaded when the user navigates to their respective routes.
 * This helps reduce the initial bundle size and improve load times.
 */
const HomePage = lazy(() => import('@pages/HomePage/HomePage'));
const LoginPage = lazy(() => import('@pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/Auth/RegisterPage'));

const SourceDocDetailPage = lazy(() => import('@pages/SourceDocument/SourceDocDetailPage'));

const MetatextDetailPage = lazy(() => import('@pages/Metatext/MetatextDetailPage'));
const MetatextReviewPage = lazy(() => import('@pages/Metatext/MetatextReviewPage'));

const ExperimentsPage = lazy(() => import('@pages/ExperimentsPage'));
const RussianDollsPage = lazy(() => import('@pages/RussianDollsPage'));


/**
 * Route definitions
 *
 * Each route includes:
 * - A path the user can navigate to
 * - A React component to render
 * - An optional 'protected' boolean indicating if the route requires authentication
 */
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
