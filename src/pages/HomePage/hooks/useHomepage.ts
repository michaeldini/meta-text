
import { useSourceDocuments, useMetatexts } from '@features/documents/useDocumentsData';


export function useHomepage() {

    // Fetch source documents & metatexts using TanStack Query
    // This will automatically fetch and cache the list in the background
    const sourceDocsQuery = useSourceDocuments();
    const metatextsQuery = useMetatexts();

    // Combined loading state for both queries
    const isLoading = sourceDocsQuery.isLoading || metatextsQuery.isLoading;


    return {
        sourceDocs: sourceDocsQuery.data,
        metatexts: metatextsQuery.data,
        refetchSourceDocs: sourceDocsQuery.refetch,
        refetchMetatexts: metatextsQuery.refetch,
        isLoading,
    };
}