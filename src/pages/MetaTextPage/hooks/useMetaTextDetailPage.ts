import { useMetaTextDetail } from 'store';
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
 * Custom hook that fetches MetaText detail only
 * Handles only data fetching and error logging for MetaText, not source document or UI logic
 */
export const useMetaTextDetailPage = (metaTextId: number) => {
    const {
        metaText,
        loading,
        errors,
    } = useMetaTextDetail(metaTextId.toString());

    // Validate metaTextId
    if (!metaTextId) {
        throw new Error(MESSAGES.NO_ID_ERROR);
    }

    // Handle critical MetaText errors
    if (!loading && errors.metaText) {
        throw new Error(errors.metaText);
    }

    return {
        metaText,
        loading,
        errors,
        metaTextId,
        MESSAGES,
    };
};
