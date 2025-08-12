/**
 * MetatextManager
 * -----------------------------------------------------------------------------
 * Reusable home/dashboard section for listing, searching, creating, and deleting
 * Metatext entities. Formerly implemented as a route-level "MetatextPage" but
 * refactored into a sectional manager component (no routing concerns here).
 */
import React, { ReactElement } from 'react';
import { Heading } from '@chakra-ui/react/heading';
import { Stack } from '@chakra-ui/react/stack';

import MetatextCreateForm from './MetatextCreateForm';
import { MetatextSummary, SourceDocumentSummary } from '@mtypes/index';
import { useDeleteMetatext } from '@features/documents/useDocumentsData';
import { SearchableTable } from '@components/SearchableTable';

interface MetatextManagerProps {
    metatexts: MetatextSummary[];
    sourceDocs: SourceDocumentSummary[];
    stackProps?: any;
    headingProps?: any;
}

function MetatextManager({
    metatexts,
    sourceDocs,
    stackProps,
    headingProps,
}: MetatextManagerProps): ReactElement {
    return (
        <Stack {...stackProps}>
            <Heading {...headingProps}>Metatexts</Heading>
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
        </Stack>
    );
}

export default MetatextManager;
