// Hook for MetatextDetailPage setup
// Encapsulates all data fetching, state, and navigation logic for MetatextDetailPage

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserConfig, useUpdateUserConfig } from 'services';
import { useSearchKeyboard, useMetatextDetail, useSourceDocumentDetail } from 'features';
import { useGenerateSourceDocInfo } from 'hooks/useGenerateSourceDocInfo';

export function useMetatextDetailPage() {
    // Extract and parse the metatextId from the URL parameters
    const { metatextId } = useParams<{ metatextId?: string }>();
    const parsedId = metatextId ? Number(metatextId) : null;

    const [showOnlyFavorites, setShowOnlyFavorites] = React.useState(false);

    // Fetch the metatext details using the React Query hook
    const { data: metatext, isLoading, error } = useMetatextDetail(parsedId);

    // Fetch the source document details using the React Query hook
    const { data: sourceDoc } = useSourceDocumentDetail(
        metatext ? metatext.source_document_id ?? null : null
    );

    const navigate = useNavigate();
    React.useEffect(() => {
        if (error && !isLoading) {
            navigate('/metatext');
        }
    }, [error, isLoading, navigate]);

    useSearchKeyboard({ enabled: true });
    const { data: userConfig } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const uiPreferences = userConfig?.uiPreferences || { showChunkPositions: false };

    const handleReviewClick = () => {
        if (!metatext) return;
        navigate(`/metatext/${metatext.id}/review`);
    };

    // Setup generateSourceDocInfo hook if metatext is available
    const generateSourceDocInfo = metatext
        ? useGenerateSourceDocInfo(metatext.source_document_id)
        : { loading: false, error: null, handleClick: () => { } };

    return {
        metatext,
        isLoading,
        error,
        sourceDoc,
        showOnlyFavorites,
        setShowOnlyFavorites,
        navigate,
        userConfig,
        updateUserConfig,
        uiPreferences,
        handleReviewClick,
        generateSourceDocInfo,
    };
}
