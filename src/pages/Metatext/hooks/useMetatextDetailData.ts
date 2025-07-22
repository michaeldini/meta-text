// // Custom hook for fetching Metatext details

// import { useEffect } from 'react';
// import { useMetatextDetailStore, useAuthStore } from 'store';

// export const useMetatextDetailData = (metatextId: number | string | undefined) => {
//     // UI message constants
//     const MESSAGES = {
//         NO_ID_ERROR: 'No Metatext ID provided in URL',
//         METATEXT_TITLE: 'Metatext Title:',
//         REVIEW_BUTTON: 'Review',
//         NOT_FOUND_TITLE: 'Metatext not found',
//         NOT_FOUND_MESSAGE: 'The Metatext with ID "{id}" could not be found.',
//     } as const;

//     const store = useMetatextDetailStore();
//     const { user } = useAuthStore();
//     // Validate metatextId
//     if (!metatextId) {
//         throw new Error(MESSAGES.NO_ID_ERROR);
//     }
//     if (!user || !user.id) {
//         throw new Error('User is not authenticated or user ID is missing');
//     }

//     // Always use string for store
//     const metatextIdStr = typeof metatextId === 'number' ? metatextId.toString() : metatextId;

//     useEffect(() => {
//         if (metatextIdStr) {
//             store.fetchMetatextDetail(metatextIdStr, user.id);
//         } else {
//             store.clearState();
//         }
//     }, [metatextIdStr, store.fetchMetatextDetail,]);

//     // Handle critical Metatext errors
//     if (!store.loading && store.errors.metatext) {
//         throw new Error(store.errors.metatext);
//     }

//     return {
//         metatext: store.metatext,
//         loading: store.loading,
//         errors: store.errors,
//         metatextId: metatextIdStr,
//         MESSAGES,
//     };
// };
