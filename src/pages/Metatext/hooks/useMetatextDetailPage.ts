/**
 * Hook for MetatextDetailPage setup
 * Encapsulates all data fetching, state, and navigation logic for MetatextDetailPage
 * Grouped by related operations for clarity and maintainability
 * Destructured in MetatextDetailPage component
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserConfig, useUpdateUserConfig } from '@services/userConfigService';
import { useMetatextDetail, useSourceDocumentDetail, useUpdateSourceDocument } from '@features/documents/useDocumentsData';
import { useSearchKeyboard } from '@features/chunk-search/hooks/useSearchKeyboard';
import { useGenerateSourceDocInfo } from '@hooks/useGenerateSourceDocInfo';
import { useDownloadMetatext } from './useDownloadMetatext';
import getUiPreferences from '@utils/getUiPreferences';

import { useMetatextDetailStore } from '@store/metatextDetailStore';
export function useMetatextDetailPage() {

    // =========================
    // Routing & Navigation
    // =========================
    // Get metatextId from route params and parse to number
    const { metatextId } = useParams<{ metatextId?: string }>();
    const parsedId = metatextId ? Number(metatextId) : null;
    const navigate = useNavigate();

    // =========================
    // Early return if parsedId is invalid
    // =========================
    if (parsedId == null || isNaN(parsedId)) {
        React.useEffect(() => {
            navigate('/');
        }, [navigate]);
        return null;
    }

    // =========================
    // Data Fetching
    // =========================
    // Fetch metatext details and source document details
    const { data: metatext, isLoading: metatextIsLoading, error: metatextError } = useMetatextDetail(parsedId);
    const { data: sourceDoc, invalidate } = useSourceDocumentDetail(metatext?.source_document_id);

    // =========================
    // State Management
    // =========================
    const setMetatextId = useMetatextDetailStore((state) => state.setMetatextId);
    React.useEffect(() => {
        setMetatextId(parsedId);
    }, [parsedId, setMetatextId]);

    const setMetatext = useMetatextDetailStore((state) => state.setMetatext);
    React.useEffect(() => {
        setMetatext(metatext ? metatext : null);
    }, [metatext, setMetatext]);

    // State for showing only favorites
    const [showOnlyFavorites, setShowOnlyFavorites] = React.useState(false);

    // =========================
    // User Config & UI Preferences
    // =========================
    const { data: userConfig } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const uiPreferences = getUiPreferences(userConfig);

    // =========================
    // Keyboard Shortcuts
    // =========================
    useSearchKeyboard({ enabled: true });

    // =========================
    // Source Document Info Generation
    // =========================
    const generateSourceDocInfo = useGenerateSourceDocInfo(metatext?.source_document_id, invalidate);

    // =========================
    // Download
    // =========================
    const downloadMetatext = useDownloadMetatext(parsedId ?? undefined);

    // =========================
    // Mutations
    // =========================
    const updateSourceDocMutation = useUpdateSourceDocument(parsedId);

    // =========================
    // Navigation Handlers
    // =========================
    const handleReviewClick = React.useCallback(() => {
        if (!metatext) return;
        navigate(`/metatext/${metatext.id}/review`);
    }, [metatext, navigate]);

    // =========================
    // Return all hook values
    // =========================
    return {
        // Routing & IDs
        metatextId: parsedId,
        navigate,

        // Data
        metatext,
        metatextIsLoading,
        metatextError,
        sourceDoc,

        // UI State
        showOnlyFavorites,
        setShowOnlyFavorites,
        uiPreferences,

        // User Config
        userConfig,
        updateUserConfig,

        // Source Doc Info Generation
        generateSourceDocInfo,

        // Download
        downloadMetatext,

        // Mutations
        updateSourceDocMutation,

        // Navigation Handlers
        handleReviewClick,
    };
}
