// utils/resetAppState.ts
// Utility to clear all user-specific app state and cache on logout/login
// Call this on logout or user switch to prevent data leakage between users.

import { useDocumentsStore } from '../store/documentsStore';
import { apiCache } from './cache';

/**
 * Clears all user-specific state and cache (Zustand store, persisted storage, API cache).
 * Call this on logout or after a user switch.
 */
export const resetAppState = () => {
    // Clear persisted Zustand store (localStorage)
    if (useDocumentsStore.persist?.clearStorage) {
        useDocumentsStore.persist.clearStorage();
    } else {
        // Fallback: remove manually if persist is not available
        localStorage.removeItem('documents-storage');
    }

    // Reset in-memory Zustand state
    useDocumentsStore.setState({
        sourceDocs: [],
        metatexts: [],
        sourceDocsLoading: false,
        sourceDocsError: null,
        metatextsLoading: false,
        metatextsError: null,
    });

    // Clear API cache
    apiCache.clear();
};
