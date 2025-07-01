import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMetaTextDetail } from 'store';
import { metaTextReviewRoute } from '../../../routes';
import { log } from 'utils';

// Constants
const MESSAGES = {
    NO_ID_ERROR: 'No MetaText ID provided in URL',
    META_TEXT_TITLE: 'Meta Text Title:',
    REVIEW_BUTTON: 'Review',
    NOT_FOUND_TITLE: 'MetaText not found',
    NOT_FOUND_MESSAGE: 'The MetaText with ID "{id}" could not be found.',
} as const;

/**
 * Custom hook that handles all MetaTextDetailPage logic
 * Separates data fetching, navigation, and error handling concerns
 */
export const useMetaTextDetailPage = (metaTextId: string | undefined) => {
    const navigate = useNavigate();
    const {
        metaText,
        loading,
        errors,
        sourceDocInfo,
        refetchSourceDoc,
    } = useMetaTextDetail(metaTextId);

    // Validate metaTextId
    if (!metaTextId) {
        throw new Error(MESSAGES.NO_ID_ERROR);
    }

    // Handle critical MetaText errors
    if (!loading && errors.metaText) {
        throw new Error(errors.metaText);
    }

    // Log non-critical sourceDoc errors
    if (errors.sourceDoc) {
        log.error('Source document error:', errors.sourceDoc);
    }

    // Memoized navigation handler
    const handleReviewClick = useCallback(() => {
        navigate(metaTextReviewRoute(metaTextId));
    }, [metaTextId, navigate]);

    // Memoized title calculation
    const displayTitle = useMemo(() => {
        return metaText?.title || metaTextId || 'Unknown';
    }, [metaText?.title, metaTextId]);

    // Memoized source document section
    const sourceDocSection = useMemo(() => {
        return sourceDocInfo ? (
            { doc: sourceDocInfo, onInfoUpdate: refetchSourceDoc }
        ) : null;
    }, [sourceDocInfo, refetchSourceDoc]);

    // UI state logic
    const uiState = useMemo(() => ({
        shouldShowContent: !!metaText,
        shouldShowNotFound: !loading && !errors.metaText,
    }), [metaText, loading, errors.metaText]);

    return {
        // Data
        metaText,
        loading,
        errors,
        sourceDocSection,
        displayTitle,
        metaTextId,

        // Actions
        handleReviewClick,

        // UI State
        ...uiState,

        // Constants
        MESSAGES,
    };
};
