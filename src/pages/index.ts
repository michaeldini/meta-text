/**
 * @fileoverview Central export file for all page components in the application.
 * This barrel export file provides a single entry point for importing page components
 * throughout the application, making imports cleaner and more maintainable.
 */

// Home page
export { default as HomePage } from './HomePage/HomePage';

// Meta text pages - for managing and reviewing meta text documents
export { default as MetaTextPage } from './MetaTextPage/MetaTextPage';
export { default as MetaTextDetailPage } from './MetaTextPage/MetaTextDetailPage';
export { default as MetaTextReviewPage } from './MetaTextPage/MetaTextReviewPage';

// Source document pages - for managing source documents
export { default as SourceDocPage } from './SourceDocPage/SourceDocPage';
export { default as SourceDocDetailPage } from './SourceDocPage/SourceDocDetailPage';

// Static/informational pages
export { default as AboutPage } from './AboutPage';
export { default as ExperimentsPage } from './ExperimentsPage';

// Authentication pages
export { default as AuthGate } from './Auth/AuthGate';
export { default as LoginPage } from './Auth/LoginPage';
export { default as RegisterPage } from './Auth/RegisterPage';
