// Custom hook for fetching MetaText details

import { useEffect } from 'react';
import { useMetaTextDetailStore } from '../../store';

export const useMetaTextDetailData = (metaTextId: number | string | undefined) => {
    // UI message constants
    const MESSAGES = {
        NO_ID_ERROR: 'No MetaText ID provided in URL',
        META_TEXT_TITLE: 'Meta Text Title:',
        REVIEW_BUTTON: 'Review',
        NOT_FOUND_TITLE: 'MetaText not found',
        NOT_FOUND_MESSAGE: 'The MetaText with ID "{id}" could not be found.',
    } as const;

    const store = useMetaTextDetailStore();

    // Validate metaTextId
    if (!metaTextId) {
        throw new Error(MESSAGES.NO_ID_ERROR);
    }

    // Always use string for store
    const metaTextIdStr = typeof metaTextId === 'number' ? metaTextId.toString() : metaTextId;

    useEffect(() => {
        if (metaTextIdStr) {
            store.fetchMetaTextDetail(metaTextIdStr);
        } else {
            store.clearState();
        }
    }, [metaTextIdStr, store.fetchMetaTextDetail]);

    // Handle critical MetaText errors
    if (!store.loading && store.errors.metaText) {
        throw new Error(store.errors.metaText);
    }

    return {
        metaText: store.metaText,
        loading: store.loading,
        errors: store.errors,
        metaTextId: metaTextIdStr,
        MESSAGES,
    };
};
