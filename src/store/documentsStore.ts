import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SourceDocument } from '../types/sourceDocument';
import type { MetaText } from '../types/metaText';
import { getErrorMessage } from '../types/error';
import * as sourceDocService from '../services/sourceDocumentService';
import * as metaTextService from '../services/metaTextService';

interface DocumentsState {
    // Source Documents
    sourceDocs: SourceDocument[];
    sourceDocsLoading: boolean;
    sourceDocsError: string | null;

    // Meta Texts
    metaTexts: MetaText[];
    metaTextsLoading: boolean;
    metaTextsError: string | null;

    // Actions
    fetchSourceDocs: () => Promise<void>;
    fetchMetaTexts: () => Promise<void>;
    deleteSourceDoc: (id: number) => Promise<void>;
    deleteMetaText: (id: number) => Promise<void>;
    addSourceDoc: (doc: SourceDocument) => void;
    addMetaText: (metaText: MetaText) => void;
    clearErrors: () => void;
}

export const useDocumentsStore = create<DocumentsState>()(
    persist(
        (set, get) => ({
            // Initial state
            sourceDocs: [],
            sourceDocsLoading: false,
            sourceDocsError: null,
            metaTexts: [],
            metaTextsLoading: false,
            metaTextsError: null,

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

            fetchMetaTexts: async () => {
                set({ metaTextsLoading: true, metaTextsError: null });
                try {
                    const texts = await metaTextService.fetchMetaTexts();
                    set({
                        metaTexts: texts,
                        metaTextsLoading: false,
                        metaTextsError: null
                    });
                } catch (error: unknown) {
                    set({
                        metaTextsError: getErrorMessage(error, 'Failed to fetch meta texts'),
                        metaTextsLoading: false
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

            deleteMetaText: async (id: number) => {
                try {
                    await metaTextService.deleteMetaText(id);
                    set(state => ({
                        metaTexts: state.metaTexts.filter(text => text.id !== id)
                    }));
                } catch (error: unknown) {
                    throw new Error(getErrorMessage(error, 'Failed to delete meta text'));
                }
            },

            addSourceDoc: (doc: SourceDocument) => {
                set(state => ({
                    sourceDocs: [...state.sourceDocs, doc]
                }));
            },

            addMetaText: (metaText: MetaText) => {
                set(state => ({
                    metaTexts: [...state.metaTexts, metaText]
                }));
            },

            clearErrors: () => {
                set({
                    sourceDocsError: null,
                    metaTextsError: null
                });
            },
        }),
        {
            name: 'documents-storage',
            partialize: (state) => ({
                // Only persist the actual data, not loading/error states
                sourceDocs: state.sourceDocs,
                metaTexts: state.metaTexts,
            }),
        }
    )
);
