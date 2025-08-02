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
    useSourceDocuments();
    useMetatexts();

    const navigate = useNavigate();

    const handleNavigateToSourceDocs = () => {
        navigate('/sourcedoc');
    };

    const handleNavigateToMetatexts = () => {
        navigate('/metatext');
    };

    return {
        handleNavigateToSourceDocs,
        handleNavigateToMetatexts,
    };
}