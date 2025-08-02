/**
 * Hook for MetatextDetailPage setup
 * Encapsulates all data fetching, state, and navigation logic for MetatextDetailPage
 * Destructured in MetatextDetailPage component
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserConfig, useUpdateUserConfig } from '@services/userConfigService';
import { useMetatextDetail, useSourceDocumentDetail } from '@features/documents/useDocumentsData';
import { useSearchKeyboard } from '@features/chunk-search/hooks/useSearchKeyboard'
import { useGenerateSourceDocInfo } from '@hooks/useGenerateSourceDocInfo';
import { useDownloadMetatext } from './useDownloadMetatext';
import getUiPreferences from '@utils/getUiPreferences';

export function useMetatextDetailPage() {
    // --- Routing and Navigation ---
    // Extract metatextId from URL and setup navigation
    const { metatextId } = useParams<{ metatextId?: string }>();
    const navigate = useNavigate();
    const parsedId = metatextId ? Number(metatextId) : null;

    // --- Data Fetching ---
    // Fetch metatext details and related source document
    const { data: metatext, isLoading: metatextIsLoading, error: metatextError } = useMetatextDetail(parsedId);
    const { data: sourceDoc } = useSourceDocumentDetail(metatext?.source_document_id);

    // Redirect to metatext list page if ID is invalid
    React.useEffect(() => {
        if (parsedId == null || isNaN(parsedId)) {
            navigate('/metatext');
        }
    }, [metatextError, parsedId, navigate]);

    // --- User Config and UI Preferences ---
    // Fetch user config and UI preferences
    const { data: userConfig } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const uiPreferences = getUiPreferences(userConfig);

    // --- Keyboard Shortcuts ---
    // Enable search keyboard shortcuts
    useSearchKeyboard({ enabled: true });

    // --- Review Navigation ---
    // Handler for navigating to review page
    const handleReviewClick = () => {
        if (!metatext) return;
        navigate(`/metatext/${metatext.id}/review`);
    };

    // --- Favorites State ---
    // State for showing only favorites
    const [showOnlyFavorites, setShowOnlyFavorites] = React.useState(false);

    // --- Source Document Info Generation ---
    // Generate source document info if metatext is available
    const generateSourceDocInfo = useGenerateSourceDocInfo(metatext?.source_document_id);

    // --- Download Metatext ---
    // Hook for downloading metatext
    const downloadMetatext = useDownloadMetatext(parsedId ?? undefined);








    // --- Return all hook values ---
    return {
        metatextId: parsedId,
        // Data
        metatext,
        metatextIsLoading,
        metatextError,
        sourceDoc,

        // UI State
        showOnlyFavorites,
        setShowOnlyFavorites,
        uiPreferences,

        // Navigation
        navigate,
        handleReviewClick,

        // User Config
        userConfig,
        updateUserConfig,

        // Source Doc Info Generation
        generateSourceDocInfo,

        // Download
        downloadMetatext,

        // Bookmark
        // metatextId is exposed; consuming components should use chunk-bookmark hooks for navigation/bookmark logic
    };
}
