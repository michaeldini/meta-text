/**
 * @fileoverview Page components for the MetaText application
 * 
 * This module exports all main page components used in the application's routing.
 * Each page represents a distinct view or feature area within the application.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-08
 */

export { default as HomePage } from './HomePage/HomePage';
export { default as AboutPage } from './AboutPage';
export { default as ExperimentsPage } from './ExperimentsPage';
export { default as MetaTextDetailPage } from './MetaTextPage/MetaTextDetailPage';
export { default as MetaTextReviewPage } from './MetaTextPage/MetaTextReviewPage';
export { default as SourceDocDetailPage } from './SourceDocPage/SourceDocDetailPage';

// Auth pages
export { default as AuthGate } from './Auth/AuthGate';
export { default as LoginPage } from './Auth/LoginPage';
export { default as RegisterPage } from './Auth/RegisterPage';
