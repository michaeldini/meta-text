/**
 * Custom hook for MetatextPage logic.
 * Handles:
 *  - Fetching metatexts and source documents
 *  - Refetching metatexts after creation
 * Returns all props needed for MetatextPage.
 */
import { useMetatexts, useSourceDocuments } from 'features';

export function useMetatextPage() {
    // Fetch metatexts and source documents using TanStack Query hooks
    const { data: metatexts, isLoading: metatextsLoading, refetch: refetchMetatexts } = useMetatexts();
    const { data: sourceDocs, isLoading: sourceDocsLoading } = useSourceDocuments();

    return {
        metatexts,
        metatextsLoading,
        refetchMetatexts,
        sourceDocs,
        sourceDocsLoading,
    };
}
