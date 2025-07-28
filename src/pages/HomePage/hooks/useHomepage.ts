/**
 * HomePage component
 * - Hydrates user configuration on page load
 * - Prefetches data for SourceDoc and Metatext pages
 * - Navigates to SourceDoc and Metatext pages
 */

import { useNavigate } from 'react-router-dom';
import { useSourceDocuments, useMetatexts } from 'features';
import { useHydrateUserConfig } from 'hooks';


export function useHomepage() {
    // Hydrate user config on page load
    useHydrateUserConfig();

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