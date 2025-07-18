/**
 * Zustand store for managing document state in the application.
 * Handles both source documents and meta texts with loading states, error handling,
 * and persistence. Provides actions for fetching, adding, and deleting documents.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MetatextSummary, SourceDocumentSummary, } from 'types'
import { getErrorMessage } from '../types/error';
import * as sourceDocService from 'services';
import * as metatextService from 'services';
interface DocumentsState {
    // Source Documents
    sourceDocs: SourceDocumentSummary[];
    sourceDocsLoading: boolean;
    sourceDocsError: string | null;

    // Meta Texts
    metatexts: MetatextSummary[];
    metatextsLoading: boolean;
    metatextsError: string | null;

    // Actions
    fetchSourceDocs: () => Promise<void>;
    fetchMetatexts: () => Promise<void>;
    deleteSourceDoc: (id: number) => Promise<void>;
    deleteMetatext: (id: number) => Promise<void>;
    addSourceDoc: (doc: SourceDocumentSummary) => void;
    addMetatext: (metatext: MetatextSummary) => void;
    clearErrors: () => void;
}

export const useDocumentsStore = create<DocumentsState>()(
    persist(
        (set, get) => ({
            // Initial state
            sourceDocs: [],
            sourceDocsLoading: false,
            sourceDocsError: null,
            metatexts: [],
            metatextsLoading: false,
            metatextsError: null,

            fetchSourceDocs: async () => {
                set({ sourceDocsLoading: true, sourceDocsError: null });
                try {
                    const docs = await sourceDocService.fetchSourceDocuments();
                    set({
                        sourceDocs: docs,
                        sourceDocsLoading: false,
                        sourceDocsError: null
                    });
                } catch (error: unknown) {
                    set({
                        sourceDocsError: getErrorMessage(error, 'Failed to fetch source documents'),
                        sourceDocsLoading: false
                    });
                }
            },

            fetchMetatexts: async () => {
                set({ metatextsLoading: true, metatextsError: null });
                try {
                    const texts = await metatextService.fetchMetatexts();
                    set({
                        metatexts: texts,
                        metatextsLoading: false,
                        metatextsError: null
                    });
                } catch (error: unknown) {
                    set({
                        metatextsError: getErrorMessage(error, 'Failed to fetch meta texts'),
                        metatextsLoading: false
                    });
                }
            },

            deleteSourceDoc: async (id: number) => {
                try {
                    await sourceDocService.deleteSourceDocument(id);
                    set(state => ({
                        sourceDocs: state.sourceDocs.filter(doc => doc.id !== id)
                    }));
                } catch (error: unknown) {
                    throw new Error(getErrorMessage(error, 'Failed to delete source document'));
                }
            },

            deleteMetatext: async (id: number) => {
                try {
                    await metatextService.deleteMetatext(id);
                    set(state => ({
                        metatexts: state.metatexts.filter(text => text.id !== id)
                    }));
                } catch (error: unknown) {
                    throw new Error(getErrorMessage(error, 'Failed to delete meta text'));
                }
            },

            addSourceDoc: (doc: SourceDocumentSummary) => {
                set(state => ({
                    sourceDocs: [...state.sourceDocs, doc]
                }));
            },

            addMetatext: (metatext: MetatextSummary) => {
                set(state => ({
                    metatexts: [...state.metatexts, metatext]
                }));
            },

            clearErrors: () => {
                set({
                    sourceDocsError: null,
                    metatextsError: null
                });
            },
        }),
        {
            name: 'documents-storage',
            partialize: (state) => ({
                // Only persist the actual data, not loading/error states
                sourceDocs: state.sourceDocs,
                metatexts: state.metatexts,
            }),
        }
    )
);
