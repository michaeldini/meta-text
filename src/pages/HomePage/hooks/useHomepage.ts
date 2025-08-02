/**
 * HomePage component
 * - Hydrates user configuration on page load
 * - Prefetches data for SourceDoc and Metatext pages
 * - Navigates to SourceDoc and Metatext pages
 */
import { useNavigate } from 'react-router-dom';
import { useSourceDocuments, useMetatexts } from '@features/documents/useDocumentsData';


export function useHomepage() {

    // Prefetch source documents & metatexts using TanStack Query
    // This will automatically fetch and cache the list in the background
    const sourceDocsQuery = useSourceDocuments();
    const metatextsQuery = useMetatexts();

    const navigate = useNavigate();

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