/**
 * Hook for MetatextDetailPage setup
 * Encapsulates all data fetching, state, and navigation logic for MetatextDetailPage
 * Destructured in MetatextDetailPage component
 */

import React from 'react';

// we need to get the parameters from the URL
// we need also navigate to other pages (just back to the homepage)
import { useParams, useNavigate } from 'react-router-dom';

// The user config has the style preferences
import { useUserConfig, useUpdateUserConfig } from '@services/userConfigService';

// Custom hooks for fetching metatext and source document details
import { useMetatextDetail, useSourceDocumentDetail } from '@features/documents/useDocumentsData';

// Keyboard shortcuts for search functionality
import { useSearchKeyboard } from '@features/chunk-search/hooks/useSearchKeyboard'

// Custom hook for generating source document info
import { useGenerateSourceDocInfo } from '@hooks/useGenerateSourceDocInfo';

// Custom hook for downloading metatext as json file
import { useDownloadMetatext } from './useDownloadMetatext';

// Utility function to get UI preferences from user config 
import getUiPreferences from '@utils/getUiPreferences';

// Importing the bookmark UI store to manage bookmark navigation
import { useBookmarkUIStore } from '@features/chunk-bookmark/store/bookmarkStore';

import { useUpdateSourceDocument } from '@features/documents/useDocumentsData';


export function useMetatextDetailPage() {
    // --- Routing and Navigation ---
    // Extract metatextId from URL and setup navigation
    const { metatextId } = useParams<{ metatextId?: string }>();
    const parsedId = metatextId ? Number(metatextId) : null;

    // --- Data Fetching ---
    // Fetch metatext details and related source document
    const { data: metatext, isLoading: metatextIsLoading, error: metatextError } = useMetatextDetail(parsedId);
    const { data: sourceDoc, isLoading, error, invalidate } = useSourceDocumentDetail(metatext?.source_document_id);

    // --- Source Document Info Generation ---
    // Generate source document info if metatext is available
    const generateSourceDocInfo = useGenerateSourceDocInfo(metatext?.source_document_id, invalidate);

    // Redirect to metatext list page if ID is invalid
    const navigate = useNavigate();
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


    // --- Download Metatext ---
    // Hook for downloading metatext
    const downloadMetatext = useDownloadMetatext(parsedId ?? undefined);


    // Get the function to set the bookmark navigation trigger
    const { setNavigateToBookmark } = useBookmarkUIStore();


    const updateSourceDocMutation = useUpdateSourceDocument(parsedId);




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
        setNavigateToBookmark,

        // Mutations
        updateSourceDocMutation,

    };
}
