/**
 * @fileoverview Page components for the MetaText application
 * 
 * This module exports all main page components used in the application's routing.
 * Each page represents a distinct view or feature area within the application.
 * 
 */

export { default as HomePage } from './HomePage/HomePage';
export { default as MetaTextDetailPage } from './MetaTextPage/MetaTextDetailPage';
export { default as MetaTextReviewPage } from './MetaTextPage/MetaTextReviewPage';
export { default as SourceDocDetailPage } from './SourceDocPage/SourceDocDetailPage';
export { default as AboutPage } from './AboutPage';
export { default as ExperimentsPage } from './ExperimentsPage';

// Auth pages
export { default as AuthGate } from './Auth/AuthGate';
export { default as LoginPage } from './Auth/LoginPage';
export { default as RegisterPage } from './Auth/RegisterPage';
