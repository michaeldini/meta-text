/**
 * Custom hook for SourceDocDetailPage logic.
 * Handles:
 *  - Extracting and parsing sourceDocId from URL
 *  - Fetching document details
 *  - Setting up update mutation
 *  - Redirecting on error
 * Returns all props needed for SourceDocDetailPage.
 */
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSourceDocumentDetail, useUpdateSourceDocument } from '@features/documents/useDocumentsData';
import { useGenerateSourceDocInfo } from '@hooks/useGenerateSourceDocInfo';
import { useUserConfig } from '@services/userConfigService';

export function useSourceDocDetail() {
    // Extract the sourceDocId from the URL parameters
    const { sourceDocId } = useParams<{ sourceDocId?: string }>();
    const parsedId = sourceDocId ? Number(sourceDocId) : null;

    // react-query functions
    // Fetch and update using the raw ID; backend will validate and send errors
    const { data: doc, isLoading, error } = useSourceDocumentDetail(parsedId);
    const updateMutation = useUpdateSourceDocument(parsedId);

    const navigate = useNavigate();

    // Redirect if query error (invalid or not found)
    React.useEffect(() => {
        if (error && !isLoading) {
            navigate('/sourcedoc');
        }
    }, [error, isLoading, navigate]);

    // Setup generateSourceDocInfo hook if doc is available
    const generateSourceDocInfo = useGenerateSourceDocInfo(doc?.id ?? 0);
    // UI preferences (moved from useSourceDocEditor)
    // Fetch user config for UI preferences
    const { data: userConfig } = useUserConfig();
    const uiPrefs = userConfig?.uiPreferences || {};
    const textSizePx = uiPrefs.textSizePx ?? 28;
    const fontFamily = uiPrefs.fontFamily ?? 'Inter, sans-serif';
    const lineHeight = uiPrefs.lineHeight ?? 1.5;

    return {
        doc,
        isLoading,
        error,
        updateMutation,
        parsedId,
        generateSourceDocInfo,
        textSizePx,
        fontFamily,
        lineHeight,
    };
}
