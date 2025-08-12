/**
 * MetatextManager
 * -----------------------------------------------------------------------------
 * Reusable home/dashboard section for listing, searching, creating, and deleting
 * Metatext entities. Formerly implemented as a route-level "MetatextPage" but
 * refactored into a sectional manager component (no routing concerns here).
 */
import React, { ReactElement } from 'react';
import { Heading } from '@chakra-ui/react/heading';
import SectionStack from '@components/SectionStack';

import MetatextCreateForm from './MetatextCreateForm';
import { MetatextSummary, SourceDocumentSummary } from '@mtypes/index';
import { useDeleteMetatext } from '@features/documents/useDocumentsData';
import { SearchableTable } from '@components/SearchableTable';

interface MetatextManagerProps {
    metatexts: MetatextSummary[];
    sourceDocs: SourceDocumentSummary[];
}

function MetatextManager({
    metatexts,
    sourceDocs,
}: MetatextManagerProps): ReactElement {
    return (
        <SectionStack>
            <Heading size="sub">Metatexts</Heading>
            <SearchableTable
                documents={metatexts}
                showTitle={true}
                navigateToBase="/metatext/"
                deleteItemMutation={useDeleteMetatext()}
            />
            <MetatextCreateForm
                sourceDocs={sourceDocs || []}
                sourceDocsLoading={false}
            />
        </SectionStack>
    );
}

export default MetatextManager;
