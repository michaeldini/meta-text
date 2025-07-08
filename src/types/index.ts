/**
 * @fileoverview Central type definitions for the MetaText application
 * 
 * This module serves as the main entry point for all TypeScript type definitions
 * used throughout the MetaText application. It provides a centralized location
 * for importing types related to documents, error handling, user sessions, and
 * other core application entities.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-08
 * @category Types
 */

/**
 * Document-related type definitions
 * 
 * Exports all types related to documents, including:
 * - DocType: Enumeration for document types (SourceDoc, MetaText)
 * - ViewMode: Enumeration for view modes (Search, Create)
 * - MetaTextSummary: Basic metadata for MetaText documents
 * - MetaTextDetail: Extended MetaText information with full content
 * - SourceDocumentSummary: Basic metadata for source documents
 * - SourceDocumentDetail: Extended source document information
 * - CreateFormData: Form data structures for document creation
 * 
 * @example
 * ```typescript
 * import { DocType, MetaTextDetail, ViewMode } from 'types';
 * 
 * const docType: DocType = DocType.MetaText;
 * const viewMode: ViewMode = ViewMode.Create;
 * ```
 */
export * from './documents';

/**
 * Error handling type definitions
 * 
 * Exports all error-related types and utilities:
 * - ApiError: Standard API error interface
 * - ValidationError: Form validation error structure
 * - AuthError: Authentication and authorization error types
 * - getErrorMessage: Utility function for extracting error messages
 * 
 * @example
 * ```typescript
 * import { ApiError, getErrorMessage } from 'types';
 * 
 * const handleError = (error: ApiError) => {
 *   const message = getErrorMessage(error);
 *   console.error(message);
 * };
 * ```
 */
export * from './error';

/**
 * User session type definitions
 * 
 * Exports types related to user chunk sessions:
 * - UserChunkSessionRead: Read-only session data from API
 * - UserChunkSessionCreate: Data structure for creating new sessions
 * 
 * These types manage user state when navigating through document chunks,
 * allowing the application to remember where users left off in their
 * document review sessions.
 * 
 * @example
 * ```typescript
 * import { UserChunkSessionCreate } from 'types';
 * 
 * const createSession: UserChunkSessionCreate = {
 *   user_id: 1,
 *   meta_text_id: 123,
 *   last_active_chunk_id: 5
 * };
 * ```
 */
export * from './userChunkSession';

/**
 * Error message utility function
 * 
 * Re-exported for convenience, this function safely extracts
 * human-readable error messages from various error types.
 * 
 * @example
 * ```typescript
 * import { getErrorMessage } from 'types';
 * 
 * try {
 *   // some operation
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   showNotification(message);
 * }
 * ```
 */
export { getErrorMessage } from './error';
