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
import { useBookmarkUIStore } from '@features/chunk-bookmark/store/bookmarkStore';
import { useMetatextStore } from '@store/metatextStore';
export function useMetatextDetailPage() {
    // =========================
    // Routing & Navigation
    // =========================
    const { metatextId } = useParams<{ metatextId?: string }>();
    const parsedId = metatextId ? Number(metatextId) : null;
    const navigate = useNavigate();

    // =========================
    // Data Fetching
    // =========================
    const { data: metatext, isLoading: metatextIsLoading, error: metatextError } = useMetatextDetail(parsedId);
    const { data: sourceDoc, isLoading, error, invalidate } = useSourceDocumentDetail(metatext?.source_document_id);

    // =========================
    // Navigation Effect (redirect if ID invalid)
    // =========================
    React.useEffect(() => {
        if (parsedId == null || isNaN(parsedId)) {
            navigate('/metatext');
        }
    }, [metatextError, parsedId, navigate]);

    // =========================
    // State Management
    // =========================
    const setMetatextId = useMetatextStore((state) => state.setMetatextId);
    React.useEffect(() => {
        setMetatextId(parsedId);
    }, [parsedId, setMetatextId]);

    const setMetatext = useMetatextStore((state) => state.setMetatext);
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
    // Download & Bookmark
    // =========================
    const downloadMetatext = useDownloadMetatext(parsedId ?? undefined);
    const { setNavigateToBookmark } = useBookmarkUIStore();

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

        // Download & Bookmark
        downloadMetatext,
        setNavigateToBookmark,

        // Mutations
        updateSourceDocMutation,

        // Navigation Handlers
        handleReviewClick,
    };
}
