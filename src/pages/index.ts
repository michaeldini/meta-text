/**
 * @module pages
 * Main application pages
 * - HomePage: The entry point for users
 * - Metatext: Pages related to Metatext documents
 * - SourceDocument: Pages related to Source Documents
 */

/**
 * HomePage: The entry point for users
 */
export { default as HomePage } from './HomePage/HomePage';

export * from './Metatext';
export * from './SourceDocument';
export { default as AboutPage } from './AboutPage';
export { default as ExperimentsPage } from './ExperimentsPage';

// Authentication pages
export * from './Auth';
