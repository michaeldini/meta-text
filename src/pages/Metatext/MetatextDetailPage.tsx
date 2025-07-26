// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.


import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, useTheme, Slide, Stack, Paper } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import {
    PageContainer, ReviewButton, SourceDocInfo, GenerateSourceDocInfoButton,
    StyleControls,
    DocumentHeader,
    AppAlert,
} from 'components';
import { useUserConfig, useUpdateUserConfig } from 'services/userConfigService';

import { ChunkToolsPanel, PaginatedChunks, SearchContainer, BookmarkNavigateButton } from 'features';

import { useValidatedIdParam } from 'utils/urlValidation';



import { useSearchKeyboard, useMetatextDetail, ChunkFavoriteFilterToggle, useSourceDocumentDetail, ChunkPositionToggleButton } from 'features';

import { getMetatextDetailStyles } from './Metatext.styles';
import DownloadMetatextButton from './components/DownloadMetatextButton';


function MetatextDetailPage(): ReactElement | null {
    // Extract and parse the metatextId from the URL parameters
    const { metatextId } = useParams<{ metatextId?: string }>();
    const parsedId = metatextId ? Number(metatextId) : null;

    const [showOnlyFavorites, setShowOnlyFavorites] = React.useState(false);

    // Fetch the metatext details using the React Query hook
    const { data: metatext, isLoading, error } = useMetatextDetail(parsedId);

    // Fetch the source document details using the React Query hook
    const { data: sourceDoc } = useSourceDocumentDetail(
        metatext ? metatext.source_document_id ?? null : null
    );

    const navigate = useNavigate();
    React.useEffect(() => {
        if (error && !isLoading) {
            navigate('/metatext');
        }
    }, [error, isLoading, navigate]);

    const theme: Theme = useTheme();
    const styles = getMetatextDetailStyles(theme);
    useUserConfig();
    useSearchKeyboard({ enabled: true });
    const { data: userConfig } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const uiPreferences = userConfig?.uiPreferences || { showChunkPositions: false };

    let content;
    if (metatext) {
        content = (
            <Box sx={styles.container} data-testid="metatext-detail-content">
                <DocumentHeader title={metatext.title}>
                    {sourceDoc && <SourceDocInfo doc={sourceDoc} />}
                    <ReviewButton metatextId={metatext.id} />
                    <GenerateSourceDocInfoButton sourceDocumentId={metatext.source_document_id} />
                    <StyleControls />
                    <Stack spacing={2} alignItems="center" direction="row">
                        <ChunkPositionToggleButton
                            value={uiPreferences.showChunkPositions || false}
                            onChange={val => updateUserConfig.mutate({ showChunkPositions: val })}
                        />
                        <BookmarkNavigateButton metaTextId={metatext.id} />
                        <DownloadMetatextButton metatextId={metatext.id} />
                        <ChunkFavoriteFilterToggle
                            showOnlyFavorites={showOnlyFavorites}
                            onToggle={setShowOnlyFavorites}
                        />
                    </Stack>
                    <SearchContainer showTagFilters={true} />
                </DocumentHeader>
                <PaginatedChunks metatextId={metatext.id} showOnlyFavorites={showOnlyFavorites} />
                <ChunkToolsPanel />
            </Box>
        );
    }

    return (
        <PageContainer loading={isLoading} data-testid="metatext-detail-page">
            {content}
        </PageContainer>
    );
}

export { MetatextDetailPage };
export default MetatextDetailPage;
