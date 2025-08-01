// Landing page for managing Metatext documents, allowing users to create and browse existing Metatexts.
// Uses DocumentManagementLayout for consistent layout with other document management pages.
// Provides a searchable list of Metatexts and a form to create new Metatexts from source documents.

import React, { ReactElement } from 'react';
import { PageContainer, } from '@components/PageContainer';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { StackSeparator } from '@chakra-ui/react/stack';
import { SearchableList } from '@components/SearchableList'

import MetatextCreateForm from './components/MetatextCreateForm';
import { MetatextSummary, SourceDocumentSummary } from '@mtypes/index';

interface MetatextPageProps {
    metatexts: MetatextSummary[] | undefined;
    sourceDocs: SourceDocumentSummary[] | undefined;
    refetch: () => void;
    isLoading: boolean;
}

function MetatextPage({
    metatexts,
    sourceDocs,
    refetch,
    isLoading
}: MetatextPageProps): ReactElement {
    return (
        <Box>
            <Stack
                direction={{ base: 'column', md: 'row' }}
                separator={<StackSeparator />}
                gap={10}
            >
                <Heading size="5xl" minWidth="220px">Metatexts</Heading>
                <SearchableList
                    items={metatexts || []}
                    filterKey="title"
                    title="Metatext"
                    loading={isLoading}
                    searchPlaceholder="Search Metatext documents..."
                    emptyMessage="No Metatext documents found. Create some Metatexts from your source documents to get started."
                    ariaLabel="List of Metatext documents"
                />
                <MetatextCreateForm
                    sourceDocs={sourceDocs || []}
                    sourceDocsLoading={isLoading}
                    onSuccess={refetch}
                />
            </Stack>
        </Box>
    );
}

export default MetatextPage;
