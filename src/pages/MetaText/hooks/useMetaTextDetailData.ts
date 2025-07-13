// Custom hook for fetching MetaText details

import { useEffect } from 'react';
import { useMetaTextDetailStore } from '../../../store';

export const useMetaTextDetailData = (metatextId: number | string | undefined) => {
    // UI message constants
    const MESSAGES = {
        NO_ID_ERROR: 'No MetaText ID provided in URL',
        META_TEXT_TITLE: 'Meta Text Title:',
        REVIEW_BUTTON: 'Review',
        NOT_FOUND_TITLE: 'MetaText not found',
        NOT_FOUND_MESSAGE: 'The MetaText with ID "{id}" could not be found.',
    } as const;

    const store = useMetaTextDetailStore();

    // Validate metatextId
    if (!metatextId) {
        throw new Error(MESSAGES.NO_ID_ERROR);
    }

    // Always use string for store
    const metatextIdStr = typeof metatextId === 'number' ? metatextId.toString() : metatextId;

    useEffect(() => {
        if (metatextIdStr) {
            store.fetchMetaTextDetail(metatextIdStr);
        } else {
            store.clearState();
        }
    }, [metatextIdStr, store.fetchMetaTextDetail]);

    // Handle critical MetaText errors
    if (!store.loading && store.errors.metatext) {
        throw new Error(store.errors.metatext);
    }

    return {
        metatext: store.metatext,
        loading: store.loading,
        errors: store.errors,
        metatextId: metatextIdStr,
        MESSAGES,
    };
};
