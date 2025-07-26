// // React Query hook for fetching a single source document detail
// // Replaces Zustand store logic for document detail state management

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { fetchSourceDocument, updateSourceDocument } from 'services';
// import type { SourceDocumentDetail, SourceDocumentUpdate } from 'types';
// import { getErrorMessage } from 'types/error';


// export function useSourceDocumentDetail(id: number | null) {
//     return useQuery<SourceDocumentDetail>({
//         queryKey: ['sourceDocumentDetail', id],
//         queryFn: async () => {
//             if (id == null) throw new Error('No document ID provided');
//             try {
//                 return await fetchSourceDocument(id);
//             } catch (err) {
//                 throw new Error(getErrorMessage(err, 'Failed to load document.'));
//             }
//         },
//         enabled: id != null,
//         retry: 1,
//         staleTime: 1000 * 60, // 1 minute
//     });
// }

// // Separate mutation hook for updating a source document
// export function useUpdateSourceDocument(docId: number | null) {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async (updateData: SourceDocumentUpdate) => {
//             if (docId == null) throw new Error('No document ID provided');
//             return updateSourceDocument(docId, updateData);
//         },
//         onSuccess: (data) => {
//             if (docId != null) {
//                 queryClient.setQueryData(['sourceDocumentDetail', docId], data);
//             }
//         },
//     });
// }

